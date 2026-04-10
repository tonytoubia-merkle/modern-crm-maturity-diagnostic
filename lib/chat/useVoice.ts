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

  const audioQueueRef = useRef<string[]>([]);
  const playingRef = useRef(false);
  const cancelledRef = useRef(false);

  // Play a base64 PCM audio chunk via AudioContext
  const playPcmAudio = useCallback((base64: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const raw = atob(base64);
        const bytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

        // PCM 16-bit signed LE at 24kHz
        const samples = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(samples.length);
        for (let i = 0; i < samples.length; i++) {
          float32[i] = samples[i] / 32768;
        }

        const ctx = new AudioContext({ sampleRate: 24000 });
        const buffer = ctx.createBuffer(1, float32.length, 24000);
        buffer.copyToChannel(float32, 0);

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => { ctx.close(); resolve(); };
        source.start();
      } catch (err) {
        reject(err);
      }
    });
  }, []);

  // Process the sentence queue
  const processQueue = useCallback(async () => {
    if (playingRef.current) return;
    playingRef.current = true;
    cancelledRef.current = false;

    while (audioQueueRef.current.length > 0 && !cancelledRef.current) {
      const sentence = audioQueueRef.current.shift()!;
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: sentence }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.audio && !cancelledRef.current) {
          await playPcmAudio(data.audio);
        }
      } catch {
        // Skip failed sentence
      }
    }

    playingRef.current = false;
    if (!cancelledRef.current) {
      setState("inactive");
      setTimeout(() => startListening(), 300);
    }
  }, [playPcmAudio, startListening]);

  const speak = useCallback((text: string) => {
    // Stop listening while speaking
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Strip markdown formatting
    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/#{1,6}\s/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/<[^>]+>/g, "");

    // Split into sentences for incremental TTS
    const sentences = cleanText
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 5);

    if (sentences.length === 0) return;

    setState("speaking");
    audioQueueRef.current = sentences;
    processQueue();
  }, [processQueue]);

  // Queue a single sentence for TTS (called during streaming)
  const queueSentence = useCallback((sentence: string) => {
    const clean = sentence.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/<[^>]+>/g, "").trim();
    if (clean.length < 5) return;

    // Stop listening on first sentence
    if (!playingRef.current) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setState("speaking");
    }

    audioQueueRef.current.push(clean);
    if (!playingRef.current) processQueue();
  }, [processQueue]);

  const cancelSpeech = useCallback(() => {
    cancelledRef.current = true;
    audioQueueRef.current = [];
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
    queueSentence,
    cancelSpeech,
  };
}
