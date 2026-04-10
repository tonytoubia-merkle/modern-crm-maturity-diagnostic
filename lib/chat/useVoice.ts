"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Web Speech API types — these aren't in the default TS lib
// Using Record<string, unknown> as base for untyped browser APIs
type SpeechRecognitionInstance = Record<string, unknown> & {
  continuous: boolean;
  interimResults: boolean;
  language: string;
  onresult: ((event: Record<string, unknown>) => void) | null;
  onerror: ((event: Record<string, unknown>) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export type VoiceState =
  | "inactive"       // mic off, nothing happening
  | "listening"      // mic on, waiting for or receiving speech
  | "countdown"      // silence detected, ring depleting
  | "paused"         // user tapped "still thinking"
  | "speaking"       // TTS playing
  | "processing";    // sent, waiting for response

interface UseVoiceOptions {
  silenceDelay?: number;     // ms after last speech before countdown starts (default 1500)
  countdownDuration?: number; // ms for ring to deplete (default 3000)
  maxDuration?: number;       // ms max recording time (default 60000)
  onComplete?: (transcript: string) => void;
}

export function useVoice(options: UseVoiceOptions = {}) {
  const {
    silenceDelay = 1500,
    countdownDuration = 3000,
    maxDuration = 60000,
    onComplete,
  } = options;

  const [state, setState] = useState<VoiceState>("inactive");
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [countdown, setCountdown] = useState<number>(1); // 0-1 ring percentage
  const [isSupported, setIsSupported] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const lastSpeechTimeRef = useRef<number>(0);
  const countdownStartRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const finalTranscriptRef = useRef("");
  const stateRef = useRef(state);
  stateRef.current = state;

  // Check browser support
  useEffect(() => {
    const SR = typeof window !== "undefined"
      ? (window as unknown as Record<string, unknown>).SpeechRecognition ||
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition
      : null;
    setIsSupported(!!SR);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      speechSynthesis?.cancel();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) return;

    // Cancel any TTS
    speechSynthesis?.cancel();

    const recognition = new (SR as new () => SpeechRecognitionInstance)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.language = "en-US";

    finalTranscriptRef.current = "";
    setTranscript("");
    setInterimText("");
    setCountdown(1);
    countdownStartRef.current = null;
    startTimeRef.current = Date.now();
    lastSpeechTimeRef.current = Date.now();

    recognition.onresult = (event: Record<string, unknown>) => {
      const results = event.results as { isFinal: boolean; 0: { transcript: string } }[];
      lastSpeechTimeRef.current = Date.now();

      // Reset countdown if it was running
      if (countdownStartRef.current !== null && stateRef.current === "countdown") {
        countdownStartRef.current = null;
        setCountdown(1);
        setState("listening");
      }

      let interim = "";
      let final = "";
      for (let i = 0; i < results.length; i++) {
        if (results[i].isFinal) {
          final += results[i][0].transcript + " ";
        } else {
          interim += results[i][0].transcript;
        }
      }

      if (final) {
        finalTranscriptRef.current = final.trim();
        setTranscript(final.trim());
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: Record<string, unknown>) => {
      if (event.error === "no-speech") return;
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      // Restart if we're still supposed to be listening
      if (stateRef.current === "listening" || stateRef.current === "countdown" || stateRef.current === "paused") {
        try { recognition.start(); } catch {}
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setState("listening");
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }

    // Start the silence detection interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastSpeech = now - lastSpeechTimeRef.current;
      const totalElapsed = now - startTimeRef.current;

      setElapsed(Math.floor(totalElapsed / 1000));

      // Max duration safety cap
      if (totalElapsed > maxDuration) {
        stopAndSend();
        return;
      }

      const currentState = stateRef.current;

      // Start countdown after silence delay
      if (
        currentState === "listening" &&
        timeSinceLastSpeech > silenceDelay &&
        finalTranscriptRef.current.length > 0 // only countdown if they said something
      ) {
        countdownStartRef.current = now;
        setState("countdown");
      }

      // Update countdown ring
      if (currentState === "countdown" && countdownStartRef.current !== null) {
        const countdownElapsed = now - countdownStartRef.current;
        const remaining = 1 - countdownElapsed / countdownDuration;
        setCountdown(Math.max(0, remaining));

        if (remaining <= 0) {
          stopAndSend();
        }
      }
    }, 50);
  }, [isSupported, silenceDelay, countdownDuration, maxDuration]);

  const stopAndSend = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }

    const text = finalTranscriptRef.current.trim();
    setState("processing");
    setCountdown(1);
    setInterimText("");

    if (text && onComplete) {
      onComplete(text);
    }
  }, [onComplete]);

  const stopListening = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setState("inactive");
    setCountdown(1);
  }, []);

  const pauseCountdown = useCallback(() => {
    countdownStartRef.current = null;
    setCountdown(1);
    setState("paused");
  }, []);

  const resumeCountdown = useCallback(() => {
    lastSpeechTimeRef.current = Date.now();
    setState("listening");
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Stop listening while speaking
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Strip markdown-like formatting for cleaner speech
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/#{1,6}\s/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/<[^>]+>/g, "");

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Try to pick a natural-sounding voice
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Samantha") || v.name.includes("Google") || v.name.includes("Natural"))
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setState("speaking");
    utterance.onend = () => {
      setState("inactive");
      // Auto-start listening after speaking
      setTimeout(() => startListening(), 300);
    };
    utterance.onerror = () => setState("inactive");

    speechSynthesis.speak(utterance);
  }, [startListening]);

  const cancelSpeech = useCallback(() => {
    speechSynthesis?.cancel();
    setState("inactive");
  }, []);

  const manualSend = useCallback(() => {
    stopAndSend();
  }, [stopAndSend]);

  return {
    state,
    setState,
    isSupported,
    transcript,
    interimText,
    countdown,
    elapsed,
    startListening,
    stopListening,
    stopAndSend: manualSend,
    pauseCountdown,
    resumeCountdown,
    speak,
    cancelSpeech,
  };
}
