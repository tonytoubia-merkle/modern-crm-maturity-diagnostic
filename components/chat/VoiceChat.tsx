"use client";

import { useState, useCallback, useRef } from "react";
import { ChatView } from "./ChatView";
import { VoiceOrb } from "./VoiceOrb";
import { useVoice } from "@/lib/chat/useVoice";
import type { Industry } from "@/lib/types";

interface VoiceChatProps {
  assessmentId: string;
  shareId: string;
  clientName: string;
  respondentName: string;
  industry: Industry | null;
  clientFacing?: boolean;
}

export function VoiceChat(props: VoiceChatProps) {
  const [voiceMode, setVoiceMode] = useState(true);
  const sendRef = useRef<((text: string) => void) | null>(null);

  const voice = useVoice({
    silenceDelay: 1500,
    countdownDuration: 3000,
    onComplete: (transcript) => {
      if (sendRef.current && transcript.trim()) {
        sendRef.current(transcript.trim());
      }
    },
  });

  // Queue individual sentences for TTS as they stream in
  const handleSentence = useCallback((sentence: string) => {
    if (voiceMode && voice.isSupported) {
      voice.queueSentence(sentence);
    }
  }, [voiceMode, voice]);

  const handleSetSendRef = useCallback((fn: (text: string) => void) => {
    sendRef.current = fn;
  }, []);

  // True when the voice orb should own the input row.
  // Falls back to text automatically when the browser doesn't support speech.
  const voiceActive = voiceMode && voice.isSupported;

  const switchToText = () => {
    voice.stopListening();
    voice.cancelSpeech();
    setVoiceMode(false);
  };
  const switchToVoice = () => {
    if (!voice.isSupported) return;
    setVoiceMode(true);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Input-mode toggle – segmented control */}
      <div className="flex items-center justify-center gap-2 py-1.5 bg-slate-50 border-b border-slate-100">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-[11px] font-medium">
          <button
            type="button"
            onClick={switchToVoice}
            disabled={!voice.isSupported}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
              voiceActive
                ? "bg-green-50 text-green-700"
                : "text-slate-500 hover:text-slate-700 disabled:opacity-40 disabled:hover:text-slate-500"
            }`}
            aria-pressed={voiceActive}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            Voice
          </button>
          <button
            type="button"
            onClick={switchToText}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
              !voiceActive
                ? "bg-slate-100 text-slate-800"
                : "text-slate-500 hover:text-slate-700"
            }`}
            aria-pressed={!voiceActive}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            Text
          </button>
        </div>
        {!voice.isSupported && (
          <span className="text-[10px] text-slate-400">Voice not supported in this browser</span>
        )}
      </div>

      {/* Chat view – hides its own text input when voice owns input */}
      <div className="flex-1 min-h-0">
        <ChatView
          {...props}
          onAssistantSentence={voiceActive ? handleSentence : undefined}
          setSendRef={handleSetSendRef}
          hideInput={voiceActive}
        />
      </div>

      {/* Voice orb – only visible when voice mode is active */}
      {voiceActive && (
        <div className="border-t border-slate-200 bg-white">
          <VoiceOrb
            state={voice.state}
            countdown={voice.countdown}
            elapsed={voice.elapsed}
            transcript={voice.transcript}
            interimText={voice.interimText}
            onTap={voice.startListening}
            onPause={voice.pauseCountdown}
            onResume={voice.resumeCountdown}
            onSkipSpeech={() => {
              voice.cancelSpeech();
              voice.startListening();
            }}
            onSend={voice.stopAndSend}
          />
        </div>
      )}
    </div>
  );
}
