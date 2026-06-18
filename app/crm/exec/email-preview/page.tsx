import { renderExecResultsEmail } from "@/lib/email/execResultsEmail";

export const metadata = {
  title: "Email preview — Modern CRM results",
};

/**
 * Static preview of the dynamic results email, rendered with sample data so
 * the design can be reviewed in a browser. The email HTML is shown inside an
 * iframe (srcDoc) so it renders in isolation, exactly as an inbox would.
 */
export default function ExecEmailPreview() {
  const { subject, html } = renderExecResultsEmail({
    maturityStage: 2,
    overallScore: 2.2,
    high: { key: "decisioning_personalization", score: 3.0 },
    low: { key: "orchestration_experience", score: 1.0 },
    fullUrl: "https://merkle-maturity-assessment.vercel.app/crm/assessment/new",
  });

  return (
    <div style={{ minHeight: "100dvh", background: "#e9e9ee", padding: "20px 12px" }}>
      <p
        style={{
          textAlign: "center",
          font: "600 13px/1.4 system-ui,-apple-system,sans-serif",
          color: "#52525b",
          margin: "0 0 16px",
        }}
      >
        Sample results email · subject: &ldquo;{subject}&rdquo;
      </p>
      <iframe
        title="Modern CRM results email preview"
        srcDoc={html}
        style={{
          display: "block",
          width: "100%",
          maxWidth: 640,
          height: "calc(100dvh - 76px)",
          margin: "0 auto",
          border: "1px solid #d6d6de",
          borderRadius: 12,
          background: "#fff",
        }}
      />
    </div>
  );
}
