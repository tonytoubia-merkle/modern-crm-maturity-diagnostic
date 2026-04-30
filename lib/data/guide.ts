import type { EmailTemplate, ChecklistItem, GuideStep } from "@/lib/types";

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "survey_distribution",
    name: "Survey Distribution",
    subject: "Modern CRM Maturity Diagnostic – Your Input Needed",
    body: `Hi [STAKEHOLDER_NAME],

As part of our upcoming CRM diagnostic engagement with [CLIENT_NAME], we're gathering input from key stakeholders to assess your organization's current CRM maturity.

Your perspective is essential to building an accurate picture of where [CLIENT_NAME] stands today and where the biggest opportunities lie.

The survey takes approximately 15-20 minutes. Please use the link below:

[SURVEY_URL]
[PASSWORD_LINE]
Please complete the survey by [DUE_DATE]. Your responses are confidential and will be aggregated with other stakeholder inputs.

A few things to know:
- It's OK to select "Not sure" for areas outside your expertise
- We'll be averaging responses across all participants
- Use the notes field to add any context or caveats

If you have questions, please don't hesitate to reach out.

Thank you,
[YOUR_NAME]
[YOUR_TITLE]
Merkle | a dentsu company`,
    placeholders: ["[STAKEHOLDER_NAME]", "[CLIENT_NAME]", "[SURVEY_URL]", "[PASSWORD_LINE]", "[DUE_DATE]", "[YOUR_NAME]", "[YOUR_TITLE]"],
    usage: "Send individually to each stakeholder with their unique survey link. Replace [PASSWORD_LINE] with 'Survey password: [PASSWORD]' if set, or remove the line.",
  },
  {
    id: "survey_reminder",
    name: "Survey Reminder",
    subject: "Reminder: CRM Maturity Survey Due [DUE_DATE]",
    body: `Hi [STAKEHOLDER_NAME],

Friendly reminder – we haven't yet received your CRM Maturity Diagnostic survey response for [CLIENT_NAME]. Your input is important for an accurate assessment.

The survey takes about 15-20 minutes:
[SURVEY_URL]
[PASSWORD_LINE]
Deadline: [DUE_DATE]

If you've already completed it, please disregard. If you're having difficulty, I'm happy to walk through it with you.

Thank you,
[YOUR_NAME]
Merkle | a dentsu company`,
    placeholders: ["[STAKEHOLDER_NAME]", "[CLIENT_NAME]", "[SURVEY_URL]", "[PASSWORD_LINE]", "[DUE_DATE]", "[YOUR_NAME]"],
    usage: "Send 3-5 days before deadline to stakeholders showing 'Invited' status on the dashboard.",
  },
  {
    id: "workshop_invite",
    name: "Workshop Invite",
    subject: "Modern CRM Workshop – [CLIENT_NAME] | [DATE]",
    body: `Hi [STAKEHOLDER_NAME],

Thank you for completing the CRM Maturity Diagnostic survey. We've aggregated the results and are ready to dive deeper in a collaborative workshop.

Workshop Details:
  Date: [DATE]
  Time: [TIME]
  Duration: [DURATION]
  Location: [LOCATION]
  [VIRTUAL_LINE]

The workshop brings together key stakeholders from [CLIENT_NAME] and subject matter experts from Merkle to explore the diagnostic findings, identify priority opportunities, and shape a Modern CRM roadmap.

What to expect:
- Review of aggregated CRM maturity results
- Collaborative exercises on your highest-priority capability gaps
- Hands-on strategy development for key opportunity areas
- Clear next steps and engagement roadmap

Please come prepared with:
- Context on your team's CRM challenges and priorities
- Questions or reactions from the survey experience
- Your strategic priorities for the next 12-18 months

Please confirm your attendance by replying to this email.

Looking forward to it,
[YOUR_NAME]
[YOUR_TITLE]
Merkle | a dentsu company`,
    placeholders: ["[STAKEHOLDER_NAME]", "[CLIENT_NAME]", "[DATE]", "[TIME]", "[DURATION]", "[LOCATION]", "[VIRTUAL_LINE]", "[YOUR_NAME]", "[YOUR_TITLE]"],
    usage: "Send after aggregation, 5-10 business days before the workshop. Replace [VIRTUAL_LINE] with 'Video: [MEETING_URL] | Miro: [MIRO_URL]' for virtual, or remove for on-site.",
  },
  {
    id: "post_workshop_followup",
    name: "Post-Workshop Follow-Up",
    subject: "Modern CRM Workshop Recap & Next Steps – [CLIENT_NAME]",
    body: `Hi [STAKEHOLDER_NAME],

Thank you for your time and engagement during the Modern CRM Workshop on [DATE]. Your contributions were invaluable.

Attached:
1. Workshop summary deck (PPTX) – maturity results, capability scores, and opportunity roadmap
2. Miro board export (PDF) – collaborative exercise outputs

Key findings:
- Overall CRM maturity: [MATURITY_STAGE] ([SCORE]/5.0)
- Top opportunities: [TOP_OPPORTUNITIES]
- Recommended next steps: [NEXT_STEPS]

Proposed path forward:
1. [STEP_1]
2. [STEP_2]
3. [STEP_3]

We'd like to schedule a 30-minute follow-up in the next two weeks to discuss engagement scope. [COLLEAGUE] will be reaching out to find a time.

Thank you for your partnership,
[YOUR_NAME]
[YOUR_TITLE]
Merkle | a dentsu company`,
    placeholders: ["[STAKEHOLDER_NAME]", "[CLIENT_NAME]", "[DATE]", "[MATURITY_STAGE]", "[SCORE]", "[TOP_OPPORTUNITIES]", "[NEXT_STEPS]", "[STEP_1]", "[STEP_2]", "[STEP_3]", "[COLLEAGUE]", "[YOUR_NAME]", "[YOUR_TITLE]"],
    usage: "Send within 48 hours of workshop. Attach PPTX export and Miro board PDF.",
  },
];

export const CHECKLIST: ChecklistItem[] = [
  // Logistics
  { id: "room", label: "Conference room booked (full duration + 30 min buffer)", category: "logistics", onsite: true, virtual: false },
  { id: "av", label: "AV confirmed: projector/screens, HDMI/USB-C adapters, audio", category: "logistics", onsite: true, virtual: false },
  { id: "wifi", label: "Guest wifi credentials obtained for client attendees", category: "logistics", onsite: true, virtual: false },
  { id: "video_platform", label: "Video platform set up with breakout rooms enabled", category: "logistics", onsite: false, virtual: true },
  { id: "calendar", label: "Calendar invites sent to all attendees", category: "logistics", onsite: true, virtual: true },
  { id: "catering", label: "Catering arranged (coffee, water, lunch if full-day)", category: "logistics", onsite: true, virtual: false },
  { id: "parking", label: "Parking/building access instructions sent", category: "logistics", onsite: true, virtual: false },
  // Materials
  { id: "agenda_print", label: "Printed agenda for each attendee", category: "materials", onsite: true, virtual: false },
  { id: "agenda_digital", label: "Digital agenda shared before session", category: "materials", onsite: false, virtual: true },
  { id: "name_tags", label: "Name tags or tent cards for all participants", category: "materials", onsite: true, virtual: false },
  { id: "supplies", label: "Sticky notes, markers, and dot-voting stickers", category: "materials", onsite: true, virtual: false },
  { id: "whiteboard", label: "Whiteboard or flip chart with markers", category: "materials", onsite: true, virtual: false },
  { id: "results_print", label: "Printed maturity results one-pager per attendee", category: "materials", onsite: true, virtual: false },
  { id: "results_pdf", label: "PDF of maturity results shared digitally", category: "materials", onsite: false, virtual: true },
  // Technology
  { id: "miro", label: "Miro board generated and link shared with all participants", category: "technology", onsite: true, virtual: true, details: "Use 'Generate Miro Board' on the project dashboard" },
  { id: "miro_test", label: "Verify all participants can access Miro", category: "technology", onsite: true, virtual: true },
  { id: "pptx", label: "PPTX export generated and reviewed", category: "technology", onsite: true, virtual: true, details: "Use 'Export PPTX' on the results page" },
  { id: "backup_pdf", label: "Backup PDF of key slides", category: "technology", onsite: true, virtual: true },
  { id: "screenshare", label: "Screen sharing tested on meeting platform", category: "technology", onsite: false, virtual: true },
  // Facilitation
  { id: "facilitator", label: "Lead facilitator and co-facilitator identified", category: "facilitation", onsite: true, virtual: true },
  { id: "smes", label: "Required SMEs confirmed and briefed on their vignettes", category: "facilitation", onsite: true, virtual: true, details: "Check SME mapping for each triggered opportunity" },
  { id: "notetaker", label: "Designated note-taker for each session", category: "facilitation", onsite: true, virtual: true },
  { id: "timekeeper", label: "Timekeeper role assigned", category: "facilitation", onsite: true, virtual: true },
  { id: "dryrun", label: "Dry run completed with facilitation team (30 min)", category: "facilitation", onsite: true, virtual: true },
  // Follow-up
  { id: "followup_draft", label: "Post-workshop follow-up email drafted", category: "follow_up", onsite: true, virtual: true },
  { id: "sf_opp", label: "Salesforce opportunity created/updated", category: "follow_up", onsite: true, virtual: true },
  { id: "miro_export", label: "Miro board exported as PDF for deliverable", category: "follow_up", onsite: true, virtual: true },
];

export const GUIDE_STEPS: GuideStep[] = [
  {
    stepNumber: 1,
    title: "Organize for Success",
    description: "You likely already know the client – this step is about lining up the right people and setting the stage for a productive diagnostic.",
    timing: "3-4 weeks before workshop",
    substeps: [
      "Confirm the industry vertical – this unlocks industry-specific questions in the survey",
      "Identify 4-8 stakeholders to participate – aim for a mix: marketing leadership, CRM/loyalty, data/analytics, technology, and channel leads",
      "Gather stakeholder names, emails, and titles for the survey distribution",
      "Align internally on who from Merkle should be involved (the tool will surface SME recommendations based on results)",
    ],
    tips: [
      "More diverse roles = richer diagnostic. The tool highlights where stakeholders diverge – that's some of the most valuable signal.",
      "If you can't get 4+ stakeholders, the Quick Assessment (/assessment/new) is useful for internal discovery and triage before committing to a full workshop.",
    ],
  },
  {
    stepNumber: 2,
    title: "Create the Project",
    description: "Set up the diagnostic project and add stakeholders.",
    timing: "2-3 weeks before workshop",
    substeps: [
      "Go to /project/new and fill in client details",
      "Fill in client details and optionally set a survey password",
      "Add each stakeholder by name, email, and role",
      "Copy each stakeholder's unique survey link",
      "Bookmark the project dashboard URL – this is your command center",
    ],
  },
  {
    stepNumber: 3,
    title: "Distribute Surveys",
    description: "Send personalized survey links to each stakeholder.",
    timing: "2-3 weeks before workshop",
    substeps: [
      "Use the Survey Distribution email template",
      "Personalize each email with the stakeholder's name and unique URL",
      "Include the password if set",
      "Set a clear deadline (at least 5 business days before workshop)",
      "Send individually – each link is unique per stakeholder",
    ],
    emailTemplateId: "survey_distribution",
  },
  {
    stepNumber: 4,
    title: "Track Completion",
    description: "Monitor progress and send reminders.",
    timing: "Ongoing",
    substeps: [
      "Check the project dashboard for stakeholder status (Invited / In Progress / Done)",
      "Send reminder emails to 'Invited' stakeholders 3-5 days before deadline",
      "For 'In Progress' stakeholders, offer to walk through on a call",
      "Minimum 2 completed surveys for aggregation; aim for 100%",
    ],
    emailTemplateId: "survey_reminder",
  },
  {
    stepNumber: 5,
    title: "Aggregate & Review",
    description: "Generate combined results and review the workshop agenda.",
    timing: "1-2 weeks before workshop",
    substeps: [
      "Click 'Aggregate Results' on the project dashboard",
      "Review capability scores, maturity stage, and triggered opportunities",
      "Review the auto-generated workshop agenda and vignette selection",
      "Check the SME mapping for each triggered opportunity – these are the Merkle experts to invite",
      "Confirm SME availability and brief them on their vignettes",
    ],
  },
  {
    stepNumber: 6,
    title: "Prepare Workshop",
    description: "Complete logistics, generate materials, brief the team.",
    timing: "1 week before",
    substeps: [
      "Send workshop invite emails to all stakeholders",
      "Generate the Miro board from the project dashboard",
      "Export the PPTX from the results page",
      "Complete the workshop checklist (on-site or virtual)",
      "Conduct a 30-minute dry run with the facilitation team",
      "Print materials if on-site: agenda, results one-pager, vignette handouts, name tags",
    ],
    tips: [
      "On-site strongly preferred – whiteboards and sticky notes drive better engagement",
      "For virtual: test Miro access for all participants beforehand",
    ],
    emailTemplateId: "workshop_invite",
  },
  {
    stepNumber: 7,
    title: "Facilitate the Workshop",
    description: "Execute the agenda and capture outputs.",
    timing: "Workshop day",
    substeps: [
      "Arrive 30 min early to set up room/AV/materials",
      "Welcome, introductions, and ground rules (phones silent, candid discussion, no wrong answers)",
      "Walk through aggregated scores – highlight strengths, gaps, and stakeholder divergence",
      "For each vignette: follow the facilitation guide (setup, exercises, wrap-up)",
      "Capture all outputs on Miro or whiteboard",
      "Close with summary of findings, priorities, and 2-3 concrete next steps with owners",
    ],
    tips: [
      "Stakeholder divergence is a feature – it reveals organizational misalignment worth discussing",
      "Don't try to solve everything. The goal is to identify and prioritize.",
      "Time management is critical – assign a dedicated timekeeper",
    ],
  },
  {
    stepNumber: 8,
    title: "Follow Up",
    description: "Send deliverables, update Salesforce, schedule next conversation.",
    timing: "Within 48 hours",
    substeps: [
      "Export final PPTX and Miro board PDF",
      "Send post-workshop follow-up email with both attachments",
      "Create/update Salesforce opportunity with workshop outcomes",
      "Schedule a 30-minute follow-up call within 2 weeks",
      "Coordinate with practice leads on engagement proposals using SME mapping",
    ],
    emailTemplateId: "post_workshop_followup",
  },
];

export function getEmailTemplate(id: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find((t) => t.id === id);
}

export function getChecklist(format: "onsite" | "virtual"): ChecklistItem[] {
  return CHECKLIST.filter((c) => format === "onsite" ? c.onsite : c.virtual);
}
