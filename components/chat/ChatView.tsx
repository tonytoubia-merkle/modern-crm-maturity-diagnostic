"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CoverageTracker } from "./CoverageTracker";
import { ScoreMapModal } from "./ScoreMapModal";
import { parseAssistantMessage } from "@/lib/chat/parseScores";
import { calculatePhase, getTotalQuestionCount } from "@/lib/chat/coverageUtils";
import { CORE_QUESTIONS, QUESTIONS_BY_CAPABILITY, CAPABILITIES_ORDER } from "@/lib/data/questions";
import type { ChatMessage, InferredScore, ChatPhase } from "@/lib/chat/types";
import type { Industry, Capability } from "@/lib/types";

/**
 * Splits an assistant message into acknowledgement (observations/insights)
 * and questions (follow-up prompts). Renders them with different UI treatments.
 */
function AssistantMessage({ content }: { content: string }) {
  // Split into paragraphs
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());

  if (paragraphs.length <= 1) {
    return (
      <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-slate-800">
        {content}
      </div>
    );
  }

  // Heuristic: paragraphs containing "?" are likely questions/prompts
  // Everything before the first question paragraph is acknowledgement
  const ackParagraphs: string[] = [];
  const questionParagraphs: string[] = [];
  let foundQuestion = false;

  for (const p of paragraphs) {
    const hasQuestion = p.includes("?") || /^(could you|can you|tell me|how does|what about|i'd love|let's)/i.test(p.trim());
    if (hasQuestion && !foundQuestion) {
      foundQuestion = true;
    }
    if (foundQuestion) {
      questionParagraphs.push(p);
    } else {
      ackParagraphs.push(p);
    }
  }

  // If no clear split, just render as one block
  if (ackParagraphs.length === 0 || questionParagraphs.length === 0) {
    return (
      <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-slate-800">
        {paragraphs.map((p, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Acknowledgement — warm, conversational */}
      <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed text-slate-700">
        {ackParagraphs.map((p, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
        ))}
      </div>
      {/* Questions — structured, distinct */}
      <div className="rounded-xl px-4 py-3 text-sm leading-relaxed border-l-[3px]" style={{ borderColor: "#00205B", backgroundColor: "#f0f4ff" }}>
        {questionParagraphs.map((p, i) => {
          // Check if the paragraph contains numbered items or bullet-like content
          const lines = p.split(/\n/).filter((l) => l.trim());
          const isList = lines.length > 1 && lines.every((l) => /^\d+[\.\)]\s|^[-•]\s/.test(l.trim()));

          if (isList) {
            return (
              <ul key={i} className={`space-y-1 ${i > 0 ? "mt-2" : ""}`}>
                {lines.map((l, li) => (
                  <li key={li} className="flex gap-2 text-slate-700">
                    <span className="flex-shrink-0" style={{ color: "#00205B" }}>
                      {l.match(/^\d+/)?.[0] ? `${l.match(/^\d+/)?.[0]}.` : "•"}
                    </span>
                    <span>{l.replace(/^\d+[\.\)]\s*|^[-•]\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            );
          }

          return <p key={i} className={`text-slate-700 ${i > 0 ? "mt-2" : ""}`}>{p}</p>;
        })}
      </div>
    </div>
  );
}

interface ChatViewProps {
  assessmentId: string;
  shareId: string;
  clientName: string;
  respondentName: string;
  industry: Industry | null;
  clientFacing?: boolean;
}

export function ChatView({
  assessmentId,
  shareId,
  clientName,
  respondentName,
  industry,
  clientFacing = false,
}: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [scores, setScores] = useState<Map<string, InferredScore>>(new Map());
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [showScoreMap, setShowScoreMap] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [emailGate, setEmailGate] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const [averages, setAverages] = useState<{ overall: Record<string, number>; industry: Record<string, number> | null } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const totalQuestions = getTotalQuestionCount(industry);
  const phase = calculatePhase(scores, skipped, totalQuestions);
  const allCovered = scores.size + skipped.size >= totalQuestions;

  // Fetch averages when all covered (for client-facing comparison)
  useEffect(() => {
    if (allCovered && !averages) {
      const url = industry ? `/api/averages?industry=${industry}` : "/api/averages";
      fetch(url).then((r) => r.json()).then(setAverages).catch(() => {});
    }
  }, [allCovered, averages, industry]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-start conversation
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage("", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(async (userText: string, isAutoStart = false) => {
    const newMessages = [...messages];
    if (userText && !isAutoStart) {
      newMessages.push({
        id: `user-${Date.now()}`,
        role: "user",
        content: userText,
      });
    }

    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    // Prepare scores object for API
    const scoresObj: Record<string, InferredScore> = {};
    scores.forEach((v, k) => { scoresObj[k] = v; });

    try {
      // Build API messages — always ensure it starts with a user message
      // and alternates user/model (Gemini requirement)
      let apiMessages: Array<{ role: "user" | "assistant"; content: string }>;
      if (isAutoStart) {
        apiMessages = [{ role: "user", content: "Please begin the assessment." }];
      } else {
        // Prepend the hidden auto-start user message so history is valid
        apiMessages = [
          { role: "user", content: "Please begin the assessment." },
          ...newMessages.map((m) => ({ role: m.role, content: m.content })),
        ];
        // Ensure no two consecutive messages have the same role
        apiMessages = apiMessages.filter((m, i) =>
          i === 0 || m.role !== apiMessages[i - 1].role
        );
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          currentScores: scoresObj,
          skipped: Array.from(skipped),
          phase,
          industry,
          clientName,
          respondentName,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Chat request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      const assistantId = `assistant-${Date.now()}`;

      // Add empty assistant message that we'll stream into
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullResponse += parsed.text;
              // Show streamed content WITHOUT the scores block
              const { displayContent } = parseAssistantMessage(fullResponse);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: displayContent }
                    : m
                )
              );
            }
          } catch {
            // Skip unparseable chunks
          }
        }
      }

      // Parse final response for scores
      const { displayContent, scoreUpdate } = parseAssistantMessage(fullResponse);

      // Update displayed message with clean content
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: displayContent } : m
        )
      );

      // Process score updates
      if (scoreUpdate) {
        setScores((prev) => {
          const next = new Map(prev);
          for (const update of scoreUpdate.updates) {
            const qIdStr = String(update.questionId);
            // Find the capability for this question
            let capability: Capability = "identity";
            let isIndustry = false;
            const coreQ = CORE_QUESTIONS.find((q) => String(q.id) === qIdStr);
            if (coreQ) {
              capability = coreQ.capability;
            } else {
              // Industry question
              isIndustry = true;
              // Extract capability from industry questions data
              for (const cap of CAPABILITIES_ORDER) {
                // We'll default to the first matching capability
                capability = cap;
                break;
              }
            }

            next.set(qIdStr, {
              questionId: update.questionId,
              score: update.score,
              confidence: update.confidence,
              evidence: update.evidence,
              capability,
              isIndustryQuestion: isIndustry,
            });
          }
          return next;
        });

        if (scoreUpdate.skipped.length > 0) {
          setSkipped((prev) => {
            const next = new Set(prev);
            for (const id of scoreUpdate.skipped) {
              next.add(String(id));
            }
            return next;
          });
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I encountered an issue. Please try sending your message again.",
        },
      ]);
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }, [messages, scores, skipped, phase, industry, clientName, respondentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    sendMessage(input.trim());
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const scoresObj: Record<string, InferredScore> = {};
      scores.forEach((v, k) => { scoresObj[k] = v; });

      const res = await fetch("/api/chat/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId,
          scores: scoresObj,
          skipped: Array.from(skipped),
        }),
      });

      if (!res.ok) throw new Error("Confirm failed");
      const data = await res.json();
      window.location.href = `/results/${data.shareId || shareId}`;
    } catch (err) {
      console.error("Confirm error:", err);
      setConfirming(false);
    }
  };

  const handleUpdateScore = (questionId: string, score: number) => {
    setScores((prev) => {
      const next = new Map(prev);
      const existing = next.get(questionId);
      if (existing) {
        next.set(questionId, { ...existing, score });
      } else {
        // Find capability
        const q = CORE_QUESTIONS.find((q) => String(q.id) === questionId);
        next.set(questionId, {
          questionId: Number(questionId),
          score,
          confidence: "high",
          evidence: "Manually set during review",
          capability: q?.capability || "identity",
          isIndustryQuestion: false,
        });
      }
      return next;
    });
  };

  return (
    <>
      <div className="flex h-[calc(100vh-44px)]">
        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.filter((m) => m.role !== "user" || m.content).map((m) => (
              <div key={m.id}>
                {m.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed bg-blue-600 text-white">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] space-y-2">
                      {m.content ? (
                        <AssistantMessage content={m.content} />
                      ) : (
                        <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                          <span className="inline-flex gap-1.5 items-center">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            <span className="text-xs text-slate-400 ml-1">Thinking...</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 px-4 py-3 bg-white">
            {allCovered && !confirming ? (
              clientFacing && !emailGate ? (
                /* Client-facing email gate */
                <div className="space-y-3">
                  <p className="text-sm text-slate-700 font-medium">
                    Your assessment is complete. Enter your email to see your results and how you compare to industry benchmarks.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={gateEmail}
                      onChange={(e) => setGateEmail(e.target.value)}
                      className="flex-1 text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && gateEmail.includes("@")) {
                          setEmailGate(true);
                          setShowScoreMap(true);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (gateEmail.includes("@")) {
                          setEmailGate(true);
                          setShowScoreMap(true);
                        }
                      }}
                      disabled={!gateEmail.includes("@")}
                      className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg hover:opacity-90 disabled:opacity-40"
                      style={{ backgroundColor: "#00205B" }}
                    >
                      View Results
                    </button>
                  </div>
                </div>
              ) : (
                /* Internal or post-gate */
                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-600 flex-1">
                    All questions covered. Ready to generate results.
                  </p>
                  <button
                    onClick={() => setShowScoreMap(true)}
                    className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Review Scores
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="text-xs font-semibold px-4 py-2 rounded-lg text-white hover:opacity-90"
                    style={{ backgroundColor: "#00205B" }}
                  >
                    Generate Results →
                  </button>
                </div>
              )
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Tell me about your CRM capabilities..."
                  disabled={streaming}
                  rows={1}
                  className="flex-1 text-sm px-4 py-2.5 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-slate-400 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-30 hover:opacity-90 transition-colors"
                  style={{ backgroundColor: "#00205B" }}
                >
                  →
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar — coverage tracker (desktop) */}
        <div className="hidden lg:block w-64 border-l border-slate-200 bg-white p-4 overflow-y-auto">
          <CoverageTracker
            scores={scores}
            skipped={skipped}
            totalQuestions={totalQuestions}
            phase={phase}
            onViewScoreMap={() => setShowScoreMap(true)}
          />
        </div>

        {/* Mobile coverage badge */}
        <button
          onClick={() => setMobileSidebar(!mobileSidebar)}
          className="lg:hidden fixed bottom-20 right-4 z-30 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: "#00205B" }}
        >
          {scores.size + skipped.size}/{totalQuestions}
        </button>

        {/* Mobile sidebar overlay */}
        {mobileSidebar && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSidebar(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl p-4 overflow-y-auto">
              <div className="flex justify-end mb-2">
                <button onClick={() => setMobileSidebar(false)} className="text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CoverageTracker
                scores={scores}
                skipped={skipped}
                totalQuestions={totalQuestions}
                phase={phase}
                onViewScoreMap={() => { setMobileSidebar(false); setShowScoreMap(true); }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Score map modal */}
      {showScoreMap && (
        <ScoreMapModal
          scores={scores}
          skipped={skipped}
          industry={industry}
          onClose={() => setShowScoreMap(false)}
          onUpdateScore={handleUpdateScore}
          onConfirm={handleConfirm}
          confirming={confirming}
          allCovered={allCovered}
          averages={averages}
          clientFacing={clientFacing}
        />
      )}
    </>
  );
}
