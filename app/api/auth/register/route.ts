import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { isAllowedEmail } from "@/lib/auth/domains";

const MIN_PASSWORD_LENGTH = 8;

// Creates an already-confirmed account so there is no confirmation email;
// the browser signs in with the same credentials right after.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isAllowedEmail(email)) {
    return NextResponse.json({ error: "domain" }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json({ error: "password_short" }, { status: 400 });
  }

  const { error } = await createServerClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.code === "email_exists" || /already/i.test(error.message)) {
      return NextResponse.json({ error: "exists" }, { status: 409 });
    }
    if (error.code === "weak_password") {
      return NextResponse.json({ error: "weak_password", message: error.message }, { status: 400 });
    }
    console.error("register: createUser failed", error.code, error.message);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
