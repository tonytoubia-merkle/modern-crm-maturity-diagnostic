# AWS Migration Runbook

Moving the Modern CRM Maturity Diagnostic from **Vercel + Supabase + Resend**
to **AWS**. This doc is the step-by-step to run once your GCP—er, AWS project
is provisioned.

## Target architecture

| Concern   | Today (Vercel)        | Target (AWS)                                  |
| --------- | --------------------- | --------------------------------------------- |
| Hosting   | Vercel                | **App Runner** (container; min instances = 1) |
| Database  | Supabase Postgres     | **RDS for PostgreSQL** (or Aurora Serverless) |
| Auth      | Supabase Auth         | **Okta (OIDC)** via Auth.js                   |
| Email     | Resend                | **Amazon SES**                                |
| Secrets   | Vercel env vars       | **Secrets Manager / SSM Parameter Store**     |
| DNS / TLS | Vercel                | **Route 53 + ACM**                            |

---

## What's already done in this PR (no provisioning needed)

These are non-breaking — the app still runs on Vercel/Supabase/Resend unchanged.

1. **`output: "standalone"`** in `next.config.mjs`, gated behind
   `NEXT_OUTPUT_STANDALONE=1` so only the container build uses it.
2. **`Dockerfile`** + **`.dockerignore`** — multi-stage build producing a slim
   runtime image that runs `node server.js` on port 3000.
3. **Provider-agnostic email transport** (`lib/email/send.ts`): set
   `EMAIL_PROVIDER=ses` to switch from Resend to SES — **no code change**. The
   SES SDK (`@aws-sdk/client-sesv2`) is lazy-loaded.
4. **Env reference** updated in `.env.local.example`.

Still **code migrations** (large; see Phases 3 & 4): database client + auth.
`@supabase/*` is used in **~103 files** across all domains, so those are a
focused effort to run *after* RDS + Okta exist — not partially flipped here.

---

## Env var reference

| Variable                        | Where        | Notes                                                        |
| ------------------------------- | ------------ | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | build arg    | Inlined at build (until DB migration removes Supabase)       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | build arg    | Inlined at build                                             |
| `NEXT_PUBLIC_APP_URL`           | build arg    | The public URL of the deployment (QR + email links read it) |
| `SUPABASE_SERVICE_ROLE_KEY`     | runtime/secret | Server only — never a build arg                            |
| `EMAIL_PROVIDER`                | runtime      | `resend` (default) or `ses`                                  |
| `EXEC_FROM_EMAIL`               | runtime      | Verified From address, both providers                        |
| `RESEND_API_KEY`                | runtime/secret | Resend only                                                |
| `AWS_REGION`                    | runtime      | SES only, e.g. `us-east-1`                                   |

> NEXT_PUBLIC_* are compiled into the client bundle at **build time** — they
> must be passed as `--build-arg` to `docker build`. Everything else is
> injected at **runtime** (App Runner env / Secrets Manager).

---

## Phase 1 — Hosting on App Runner (ready now)

Prereqs: AWS account/project, AWS CLI configured, Docker installed locally (or
use CodeBuild). Replace `<ACCT>`, `<REGION>`.

```bash
# 1. Create an ECR repository
aws ecr create-repository --repository-name modern-crm --region <REGION>

# 2. Log Docker in to ECR
aws ecr get-login-password --region <REGION> \
  | docker login --username AWS --password-stdin <ACCT>.dkr.ecr.<REGION>.amazonaws.com

# 3. Build the image (NEXT_PUBLIC_* are build args)
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..." \
  --build-arg NEXT_PUBLIC_APP_URL="https://assessment.merkle.com" \
  -t modern-crm .

# 4. Tag + push
docker tag modern-crm:latest <ACCT>.dkr.ecr.<REGION>.amazonaws.com/modern-crm:latest
docker push <ACCT>.dkr.ecr.<REGION>.amazonaws.com/modern-crm:latest
```

Then create the **App Runner service** (console is easiest):

- Source: the ECR image above. Deployment: manual or auto-on-push.
- **Port: 3000**.
- **Auto scaling → min size = 1** (avoids cold-start lag at the kiosk).
- **Health check**: HTTP `GET /api/health` (returns `{"status":"ok"}` without
  hitting the DB; included in this PR).
- **Runtime environment variables**: `SUPABASE_SERVICE_ROLE_KEY`,
  `EMAIL_PROVIDER`, `EXEC_FROM_EMAIL`, `AWS_REGION`, plus `RESEND_API_KEY` if
  still on Resend. Prefer wiring secrets from **Secrets Manager** (Phase 5).
- **Instance role**: attach an IAM role (needed for SES — Phase 2).

### CI/CD — GitHub Actions (included, inert until configured)

`.github/workflows/deploy-apprunner.yml` builds the image, pushes to ECR, and
triggers an App Runner deployment. It's **manual-dispatch only** (won't run or
fail on pushes) until you set its config, and uses **OIDC** so no AWS keys are
stored in GitHub.

To enable:

1. Create an IAM role that trusts GitHub's OIDC provider
   (`token.actions.githubusercontent.com`), scoped to this repo, with
   permissions for ECR push + `apprunner:StartDeployment`.
2. Repo → Settings → Secrets and variables → Actions:
   - **Secret**: `AWS_DEPLOY_ROLE_ARN`
   - **Variables**: `AWS_REGION`, `ECR_REPOSITORY`, `APP_RUNNER_SERVICE_ARN`,
     `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
     `NEXT_PUBLIC_APP_URL`
3. Run it from the **Actions** tab. To auto-deploy on merge, add a
   `push: branches: [main]` trigger to the workflow.

> Infra-as-code (Terraform/CDK) intentionally omitted until your org's
> provisioning standard / landing zone is known — the CLI steps above and this
> workflow are platform-agnostic. Ask and I'll add IaC matching your standard.

---

## Phase 2 — Email on SES (ready now — just provision)

1. **Verify the sending domain** in SES → add the **DKIM** CNAME records to DNS.
2. **Request production access** (SES starts in a sandbox that only sends to
   verified addresses). Support → "Request production access".
3. Grant the App Runner **instance role** permission:
   ```json
   { "Effect": "Allow", "Action": "ses:SendEmail", "Resource": "*" }
   ```
4. Set env on the service: `EMAIL_PROVIDER=ses`, `AWS_REGION=<REGION>`,
   `EXEC_FROM_EMAIL="Merkle Modern CRM <no-reply@merkle.com>"`.
   **No access keys** — the SDK uses the instance role automatically.
5. Test: submit the kiosk results form → confirm delivery. Preview the template
   anytime at **`/crm/exec/email-preview`**.

That's the whole email switch — the transport already supports SES.

---

## Phase 3 — Database on RDS for PostgreSQL (code migration)

Infra:

1. Create an **RDS PostgreSQL** instance (or Aurora Serverless v2) in a private
   subnet; security group allows the App Runner VPC connector.
2. Apply the existing schema. Migrations live in the repo's SQL migration files
   — run them against RDS (psql or a migration tool).
3. Import existing data from Supabase (`pg_dump` from Supabase → `pg_restore`
   into RDS) during the cutover window.

Code (focused effort — ~103 files reference `@supabase/*`):

- Replace `@supabase/ssr` / `@supabase/supabase-js` with a Postgres client
  (`pg`, or **Drizzle**/**Prisma** for type safety). Centralize in
  `lib/db/*` and swap `.from(...)` query-builder calls.
- **Row-Level Security**: Supabase RLS policies enforced access using
  `auth.uid()`. RDS has no Supabase auth context, so that authorization must
  move into the **application layer** (check the Okta session/role on each
  query) — this is the most important correctness item, do not skip it.
- Server reads currently using the service-role key become ordinary pooled DB
  connections.

> Recommend migrating **domain by domain** (start with CRM, then CSC/B2B/AICX/
> AIENT) behind a branch, with the data layer abstracted so both can't drift.

---

## Phase 4 — Auth on Okta via Auth.js (code migration)

1. In Okta, create an **OIDC Web app**; note client ID/secret, issuer URL; set
   the redirect URI to `https://<domain>/api/auth/callback/okta`.
2. Add **Auth.js (NextAuth)** with the Okta provider. Env:
   `AUTH_OKTA_ID`, `AUTH_OKTA_SECRET`, `AUTH_OKTA_ISSUER`, `AUTH_SECRET`.
3. Replace the Supabase session check in `middleware.ts` and
   `lib/supabase/middleware.ts` with the Auth.js session/JWT check. **Keep the
   existing `PUBLIC_ROUTES` / `PUBLIC_PREFIXES` allowlist intact** — the kiosk
   (`/crm/exec*`) and shared survey/results links must stay public.
4. Replace `app/login`, `app/register`, `app/auth/callback` with the Okta flow.
5. Map Okta groups/claims to the app's existing roles (`lib/auth/roles.ts`).

---

## Phase 5 — Secrets

Store `SUPABASE_SERVICE_ROLE_KEY` (until Phase 3), `RESEND_API_KEY`,
`AUTH_OKTA_SECRET`, `AUTH_SECRET`, DB credentials in **Secrets Manager**, and
reference them as env vars on the App Runner service. Keep only non-secret
config (`EMAIL_PROVIDER`, `AWS_REGION`, `NEXT_PUBLIC_APP_URL`) inline.

---

## Phase 6 — Domain & TLS

1. Request/validate an **ACM certificate** for the domain.
2. App Runner → **Custom domains** → add the domain, create the CNAME/validation
   records your domain owners provide.
3. Update `NEXT_PUBLIC_APP_URL` to the final domain and rebuild (it's baked in).

---

## Cutover checklist

- [ ] Image builds & pushes to ECR; App Runner serves the app on the temp URL.
- [ ] `EMAIL_PROVIDER=ses`, domain verified, out of sandbox, test email lands.
- [ ] RDS schema applied; data imported; app reads/writes against RDS.
- [ ] App-layer authz replaces RLS (verified per role).
- [ ] Okta login works; public kiosk/survey/results routes still open.
- [ ] Secrets in Secrets Manager; no secrets baked into the image.
- [ ] Custom domain + TLS live; `NEXT_PUBLIC_APP_URL` rebuilt to match.
- [ ] DNS flipped from Vercel to App Runner; decommission Vercel/Supabase/Resend.

---

## TL;DR — what to do the moment you get the project

1. **Hosting + email can go live immediately** with this PR: build the Docker
   image (Phase 1), stand up App Runner, verify the SES domain and set
   `EMAIL_PROVIDER=ses` (Phase 2). At that point the kiosk runs on AWS with SES
   email — **still pointing at the existing Supabase DB/Auth over HTTPS**
   (that's fine and keeps it working).
2. **Then** schedule the DB (Phase 3) and Okta (Phase 4) migrations as a focused
   block — ping me and I'll implement the data-layer + auth swap once RDS and
   the Okta app exist.
