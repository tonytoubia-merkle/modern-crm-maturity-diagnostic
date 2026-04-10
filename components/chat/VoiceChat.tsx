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

  return (
    <div className="flex flex-col h-full">
      {/* Voice mode toggle */}
      <div className="flex items-center justify-center gap-2 py-1.5 bg-slate-50 border-b border-slate-100">
        <button
          onClick={() => {
            setVoiceMode(!voiceMode);
            if (voiceMode) {
              voice.stopListening();
              voice.cancelSpeech();
            }
          }}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full border transition-colors ${
            voiceMode
              ? "border-green-300 bg-green-50 text-green-700"
              : "border-slate-200 bg-white text-slate-500"
          }`}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          Voice {voiceMode ? "On" : "Off"}
        </button>
        {!voice.isSupported && (
          <span className="text-[10px] text-slate-400">Voice not supported in this browser</span>
        )}
      </div>

      {/* Chat view */}
      <div className="flex-1 min-h-0">
        <ChatView
          {...props}
          onAssistantSentence={voiceMode ? handleSentence : undefined}
          setSendRef={handleSetSendRef}
        />
      </div>

      {/* Voice orb overlay */}
      {voiceMode && voice.isSupported && (
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
