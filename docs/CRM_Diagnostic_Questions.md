# Modern CRM Maturity Diagnostic — Questions & Answer Options

> **Source of truth:** `lib/data/questions.ts` on `main`.
> **Entry points:** `/assessment/new` (manual), `/assessment/chat` (conversational), `/cannes` (Cannes-branded landing → conversational), `/marketing` (dentsu-branded landing → conversational).

The diagnostic is a **30-question core assessment** across **8 capability dimensions**, plus **5 optional industry questions** for one of 5 industries. Every question uses the same 5-point maturity scale.

---

## Maturity Scale (applies to every question)

| Score | Label | Description |
|:---:|---|---|
| **1** | Not in Place | Capability does not exist or is highly fragmented with no formal process. |
| **2** | Emerging | Limited pilots or isolated capabilities exist but are not consistently applied. |
| **3** | Operational | Capability is in use and operational but not consistently integrated across teams or channels. |
| **4** | Integrated | Capability operates across teams and channels with clear governance and coordination. |
| **5** | Optimized | Capability is fully orchestrated, continuously improved through data and experimentation, and drives measurable outcomes. |

---

## Maturity Stages (overall roll-up)

| Overall Score | Stage | Label |
|:---:|:---:|---|
| < 1.75 | Stage 1 | Campaign-Centric CRM |
| 1.75 – 2.74 | Stage 2 | Segmented Engagement |
| 2.75 – 3.74 | Stage 3 | Orchestrated Engagement |
| 3.75 – 5.0 | Stage 4 | Relationship Growth Engine |

---

# Core Questions (30)

## 1. Identity — Customer Recognition

*Assess the extent to which the organization can recognize and connect customers across interactions.*

### Q1
**To what extent does the organization maintain a unified customer profile across channels and touchpoints?**

*A unified customer profile is a single, persistent record that connects all known data about a customer — purchases, interactions, preferences, and identifiers — across every channel and touchpoint.*

### Q2
**To what extent can the organization recognize the same customer across digital, mobile, in-store, and service interactions?**

### Q3
**To what extent are households or customer relationships (family members, shared accounts, gift buyers) identified and connected?**

### Q4
**To what extent is customer identity and data shared consistently across organizational divisions and business units?**

---

## 2. Signals — Customer Understanding

*Assess the extent to which the organization can capture behavioral signals and connect them to customer profiles.*

### Q5
**To what extent are behavioral intent signals such as purchase, browsing, engagement, or usage captured and connected to customer profiles?**

*Behavioral intent signals are actions a customer takes — page views, cart activity, email opens, app sessions, store visits — that indicate interest or readiness to engage.*

### Q6
**To what extent are real-time or near-real-time signals used to trigger engagement or messaging?**

*Real-time signals are captured and available for activation within minutes, rather than in batch processes that run daily or weekly.*

### Q7
**To what extent are customer lifecycle or milestone signals identified and used to guide engagement strategies?**

*Lifecycle signals include events like onboarding completion, anniversary dates, lapse risk indicators, tier changes, or renewal windows.*

---

## 3. Decisioning — Next Best Action

*Assess the extent to which the organization can determine the most relevant interaction for each customer.*

### Q8
**To what extent are segmentation or predictive models used to guide engagement strategies?**

*Predictive models are statistical or machine learning models that estimate the likelihood of future customer behavior — such as purchase propensity, churn risk, or lifetime value.*

### Q9
**To what extent are next-best-actions determined dynamically based on customer behavior or context?**

*Next-best-action (NBA) is a decisioning approach where the system determines the most relevant message, offer, or experience for each customer based on their current context, history, and behavior.*

### Q10
**To what extent are decisioning rules or prioritization logic used to coordinate offers, messages, and experiences?**

---

## 4. Engagement — Experience Delivery

*Understand the extent to which the organization can activate personalized engagement across channels.*

### Q11
**To what extent are customer journeys orchestrated across channels such as email, mobile, app, web, store, and service?**

*Orchestration means channels are coordinated so each interaction builds on the last — rather than operating independently in silos with separate strategies.*

### Q12
**To what extent are loyalty or recognition programs integrated with CRM engagement strategies?**

*This includes traditional loyalty tiers as well as modern recognition models — value exchange, experiential rewards, personalized benefits, and non-transactional engagement mechanics.*

### Q13
**To what extent are promotions or offers personalized using behavioral signals rather than broadly distributed?**

### Q14
**To what extent are customer service interactions connected to loyalty or CRM engagement strategies?**

### Q15
**To what extent are dynamic content or personalized experiences assembled in real time based on customer signals and context?**

---

## 5. Media Activation — Growth Engine

*Assess the extent to which first-party customer signals are used to improve media performance and acquisition.*

### Q16
**To what extent is first-party customer data used to inform paid media targeting?**

### Q17
**To what extent do CRM or loyalty signals create high-value audiences for media activation?**

### Q18
**To what extent are paid media campaigns designed to drive owned relationship growth such as app adoption, loyalty enrollment, or profile completion?**

---

## 6. Learning & Optimization — Feedback Loop

*Assess whether the organization continuously improves engagement and media strategies through data and experimentation.*

### Q19
**To what extent are experiments or test-and-learn programs used to improve engagement strategies?**

### Q20
**To what extent are media performance insights fed back into CRM engagement strategies?**

### Q21
**To what extent does the organization measure incremental lift from loyalty, promotions, and messaging programs?**

*Incremental lift measures the true causal impact of a program — the additional revenue or engagement that would not have occurred without the intervention, beyond what customers would have done anyway.*

### Q22
**To what extent are customer insights used to refine segmentation, journeys, and targeting strategies?**

---

## 7. Technology — Value Realization

*Assess the extent to which the technology stack enables seamless data flow, modular integration, and rapid deployment of new CRM capabilities.*

### Q23
**To what extent is the organization's technology stack architected to enable seamless data flow across CRM, loyalty, media, service, and commerce systems?**

### Q24
**To what extent can the organization deploy new use cases (e.g., journeys, loyalty experiences, triggers, integrations) without significant engineering effort or delays?**

### Q25
**To what extent does the current technology stack support modular integration with external platforms, including loyalty, decisioning, and media ecosystems?**

### Q26
**To what extent does the organization maintain data quality, governance, and consistency across customer, loyalty, and engagement systems?**

---

## 8. Organization & Process — Operating Model

*Assess whether teams, processes, and governance are aligned around shared customer outcomes and cross-functional collaboration.*

### Q27
**To what extent are teams aligned around shared customer and business outcomes (e.g., lifetime value, loyalty engagement, retention) rather than channel-specific goals?**

### Q28
**To what extent are ownership and accountability clearly defined for end-to-end customer experience, including loyalty, across marketing, media, and service functions?**

### Q29
**To what extent does the organization operate with cross-functional collaboration models (e.g., pods or squads) that integrate CRM, loyalty, media, and service teams?**

### Q30
**To what extent are data, analytics, and marketing teams integrated to support decisioning, loyalty strategy, and ongoing optimization?**

---

# Industry Modules (optional — 5 questions per industry)

Industry questions add contextual depth but do not modify the core capability scores.

## Retail / Commerce

| # | Question | Capability |
|:---:|---|---|
| R1 | To what extent are households or family relationships identified and activated in marketing? | Identity |
| R2 | To what extent are life-stage signals used to personalize messaging and offers? | Signals |
| R3 | To what extent are category purchase patterns used to anticipate next purchase needs? | Decisioning |
| R4 | To what extent are loyalty signals used to reduce blanket discounting? | Engagement |
| R5 | To what extent are gift buyers or secondary purchasers identified and engaged? | Identity |

## Quick Service / Fast Casual (QSR)

| # | Question | Capability |
|:---:|---|---|
| QSR1 | To what extent are visit frequency patterns used to trigger personalized engagement? | Signals |
| QSR2 | To what extent are daypart behaviors used to drive cross-occasion growth? | Signals |
| QSR3 | To what extent are loyalty signals used to optimize offers instead of blanket promotions? | Engagement |
| QSR4 | To what extent does CRM support migration from third-party delivery platforms to first-party ordering? | Engagement |
| QSR5 | To what extent are location and proximity signals used to trigger engagement? | Signals |

## Financial Services

| # | Question | Capability |
|:---:|---|---|
| FS1 | To what extent are onboarding journeys designed to drive early product activation? | Engagement |
| FS2 | To what extent are transaction signals used to identify cross-sell opportunities? | Signals |
| FS3 | To what extent are CRM and loyalty strategies used to increase product utilization? | Engagement |
| FS4 | To what extent are customer service interactions integrated into relationship engagement strategies? | Engagement |
| FS5 | To what extent are lifecycle events used to trigger financial guidance or engagement? | Signals |

## Travel & Hospitality

| # | Question | Capability |
|:---:|---|---|
| TH1 | To what extent are travel intent signals used to trigger engagement or offers? | Signals |
| TH2 | To what extent are recognition and value exchange programs used to personalize guest experiences beyond transactional rewards? | Engagement |
| TH3 | To what extent are service recovery moments integrated with loyalty gestures? | Engagement |
| TH4 | To what extent are trip milestones used to drive engagement before, during, and after travel? | Signals |
| TH5 | To what extent are ancillary revenue opportunities personalized using customer signals? | Decisioning |

## Automotive / Mobility

| # | Question | Capability |
|:---:|---|---|
| AUTO1 | To what extent are vehicle lifecycle milestones used to trigger engagement? | Signals |
| AUTO2 | To what extent are connected vehicle signals integrated into CRM engagement strategies? | Signals |
| AUTO3 | To what extent are service interactions used to strengthen the customer relationship? | Engagement |
| AUTO4 | To what extent are loyalty or engagement programs used to drive participation in the broader brand ecosystem? | Engagement |
| AUTO5 | To what extent does CRM extend beyond purchase to support ongoing brand engagement? | Engagement |
