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
  bargeIn?: boolean;          // allow user to interrupt TTS by speaking (default true)
  onComplete?: (transcript: string) => void;
}

// Barge-in tuning
// Energy threshold is an RMS-normalized value (0–1). ~0.04 catches speech while
// ignoring breath/low-level noise once echo cancellation is active.
const BARGE_IN_RMS_THRESHOLD = 0.04;
const BARGE_IN_MIN_DURATION_MS = 160; // sustained voice energy to confirm intent
const BARGE_IN_WARMUP_MS = 250;       // ignore VAD for this long after TTS starts

export function useVoice(options: UseVoiceOptions = {}) {
  const {
    silenceDelay = 1500,
    countdownDuration = 3000,
    maxDuration = 60000,
    bargeIn = true,
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

  // --- Playback tracking (lets us hard-stop TTS on barge-in or cancel) ---
  const activeCtxRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // --- Barge-in VAD (Web Audio AnalyserNode on mic) ---
  const vadStreamRef = useRef<MediaStream | null>(null);
  const vadCtxRef = useRef<AudioContext | null>(null);
  const vadAnalyserRef = useRef<AnalyserNode | null>(null);
  const vadRafRef = useRef<number | null>(null);
  const vadActiveSinceRef = useRef<number | null>(null);
  const vadArmedAtRef = useRef<number>(0);

  // Check browser support
  useEffect(() => {
    const SR = typeof window !== "undefined"
      ? (window as unknown as Record<string, unknown>).SpeechRecognition ||
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition
      : null;
    setIsSupported(!!SR);
  }, []);

  const stopActivePlayback = useCallback(() => {
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch {}
      try { activeSourceRef.current.disconnect(); } catch {}
      activeSourceRef.current = null;
    }
    if (activeCtxRef.current) {
      try { activeCtxRef.current.close(); } catch {}
      activeCtxRef.current = null;
    }
  }, []);

  const stopBargeInWatch = useCallback(() => {
    if (vadRafRef.current !== null) {
      cancelAnimationFrame(vadRafRef.current);
      vadRafRef.current = null;
    }
    vadActiveSinceRef.current = null;
  }, []);

  const teardownVad = useCallback(() => {
    stopBargeInWatch();
    if (vadAnalyserRef.current) {
      try { vadAnalyserRef.current.disconnect(); } catch {}
      vadAnalyserRef.current = null;
    }
    if (vadCtxRef.current) {
      try { vadCtxRef.current.close(); } catch {}
      vadCtxRef.current = null;
    }
    if (vadStreamRef.current) {
      try { vadStreamRef.current.getTracks().forEach((t) => t.stop()); } catch {}
      vadStreamRef.current = null;
    }
  }, [stopBargeInWatch]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      stopActivePlayback();
      teardownVad();
    };
  }, [stopActivePlayback, teardownVad]);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) return;

    // Cancel any TTS and stop barge-in watch — we own the mic now.
    speechSynthesis?.cancel();
    stopActivePlayback();
    stopBargeInWatch();

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
  }, [isSupported, silenceDelay, countdownDuration, maxDuration, stopActivePlayback, stopBargeInWatch]);

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
    setCountdown(1);
    setInterimText("");

    if (text && onComplete) {
      setState("processing");
      onComplete(text);
      return;
    }

    // Empty transcript — the user tapped Send (or the orb) without
    // anything captured. Don't spin forever; play a brief reprompt
    // and re-open the mic. processQueue auto-restarts listening once
    // playback finishes, so we just drop into that path.
    // Note: startListening, processQueue, and fetchTtsWithRetry are
    // declared later in this hook. We capture them via closure rather
    // than including them in the deps array — putting them in deps would
    // TDZ-fire when useCallback evaluates the array during render. By
    // the time stopAndSend is actually invoked (button click / timer),
    // those identifiers have been bound, so the closure resolves fine.
    if (repromptingRef.current) {
      setState("inactive");
      startListening();
      return;
    }
    repromptingRef.current = true;
    setState("speaking");
    cancelledRef.current = false;
    const promptText =
      "I didn't quite catch that — could you say that again?";
    audioQueueRef.current = [
      {
        sentence: promptText,
        audio: fetchTtsWithRetry(promptText),
      },
    ];
    processQueue().finally(() => {
      repromptingRef.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Pipelined TTS queue. Each item is the raw sentence and a Promise
  // that resolves to its base64 audio. Pushing a sentence kicks off its
  // fetch immediately, so by the time the player is ready for it the
  // network round-trip is usually already done.
  const audioQueueRef = useRef<
    Array<{ sentence: string; audio: Promise<string | null> }>
  >([]);
  const playingRef = useRef(false);
  const cancelledRef = useRef(false);
  // Tracks the most recent "didn't catch that" reprompt so we can
  // avoid stacking them if the user repeatedly taps with no transcript.
  const repromptingRef = useRef(false);

  // Ensure we have an active mic stream + analyser for barge-in detection.
  // Returns true if VAD is available, false if mic permission fails.
  const ensureVad = useCallback(async (): Promise<boolean> => {
    if (vadAnalyserRef.current && vadStreamRef.current) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      vadStreamRef.current = stream;
      const AC = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ||
        (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return false;
      const ctx = new AC();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      vadCtxRef.current = ctx;
      vadAnalyserRef.current = analyser;
      return true;
    } catch (err) {
      console.warn("Barge-in VAD unavailable (mic permission or API):", err);
      teardownVad();
      return false;
    }
  }, [teardownVad]);

  // Start watching mic energy during TTS playback. On sustained voice, trigger barge-in.
  const startBargeInWatch = useCallback((onBargeIn: () => void) => {
    if (!vadAnalyserRef.current) return;
    stopBargeInWatch();
    vadArmedAtRef.current = Date.now();
    vadActiveSinceRef.current = null;
    const analyser = vadAnalyserRef.current;
    const buf = new Uint8Array(analyser.fftSize);

    const tick = () => {
      if (!vadAnalyserRef.current) return;
      analyser.getByteTimeDomainData(buf);
      // RMS of zero-centered signal
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / buf.length);
      const now = Date.now();
      const warm = now - vadArmedAtRef.current > BARGE_IN_WARMUP_MS;

      if (warm && rms > BARGE_IN_RMS_THRESHOLD) {
        if (vadActiveSinceRef.current === null) {
          vadActiveSinceRef.current = now;
        } else if (now - vadActiveSinceRef.current > BARGE_IN_MIN_DURATION_MS) {
          stopBargeInWatch();
          onBargeIn();
          return;
        }
      } else if (vadActiveSinceRef.current !== null) {
        // Reset if energy drops before threshold duration met
        vadActiveSinceRef.current = null;
      }

      vadRafRef.current = requestAnimationFrame(tick);
    };
    vadRafRef.current = requestAnimationFrame(tick);
  }, [stopBargeInWatch]);

  // Play a base64 PCM audio chunk via AudioContext (trackable for barge-in cancellation)
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
        activeCtxRef.current = ctx;
        activeSourceRef.current = source;
        source.onended = () => {
          if (activeSourceRef.current === source) activeSourceRef.current = null;
          if (activeCtxRef.current === ctx) activeCtxRef.current = null;
          try { ctx.close(); } catch {}
          resolve();
        };
        source.start();
      } catch (err) {
        reject(err);
      }
    });
  }, []);

  // Fetch a TTS sentence with one retry on failure.
  const fetchTtsWithRetry = useCallback(async (sentence: string): Promise<string | null> => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: sentence }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.audio) return data.audio as string;
        }
      } catch {
        // fall through to retry
      }
      if (attempt === 0) await new Promise((r) => setTimeout(r, 400));
    }
    return null;
  }, []);

  // Process the sentence queue
  const processQueue = useCallback(async () => {
    if (playingRef.current) return;
    playingRef.current = true;
    cancelledRef.current = false;

    // Arm barge-in detection for this playback session.
    let bargeInArmed = false;
    if (bargeIn) {
      const ok = await ensureVad();
      if (ok) {
        bargeInArmed = true;
        startBargeInWatch(() => {
          // User interrupted — cancel queue, stop current playback,
          // and immediately open the mic.
          cancelledRef.current = true;
          audioQueueRef.current = [];
          stopActivePlayback();
          startListening();
        });
      }
    }

    while (audioQueueRef.current.length > 0 && !cancelledRef.current) {
      const item = audioQueueRef.current.shift()!;
      // Audio fetch was already kicked off when this sentence was
      // queued, so this await usually returns near-instantly. Anything
      // we wait on here happens in parallel with the previous play.
      const audio = await item.audio;
      if (!audio || cancelledRef.current) continue;
      try {
        await playPcmAudio(audio);
      } catch {
        // Skip failed playback; move to next
      }
    }

    if (bargeInArmed) stopBargeInWatch();
    playingRef.current = false;

    // Resume listening immediately once the agent is done speaking
    // (no artificial gap — "AgentAudioDone" is the trigger).
    if (!cancelledRef.current) {
      setState("inactive");
      startListening();
    }
  }, [bargeIn, ensureVad, startBargeInWatch, stopBargeInWatch, stopActivePlayback, playPcmAudio, fetchTtsWithRetry, startListening]);

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
    // Kick off all TTS fetches in parallel. They'll resolve in order
    // when processQueue awaits them.
    audioQueueRef.current = sentences.map((sentence) => ({
      sentence,
      audio: fetchTtsWithRetry(sentence),
    }));
    processQueue();
  }, [processQueue, fetchTtsWithRetry]);

  // Queue a single sentence for TTS (called during streaming).
  // Kicks off the TTS fetch immediately so the audio is ready by the
  // time the player gets to it — that's what closes the gap between
  // text appearing and TTS playing.
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

    audioQueueRef.current.push({
      sentence: clean,
      audio: fetchTtsWithRetry(clean), // fire fetch now, await later
    });
    if (!playingRef.current) processQueue();
  }, [processQueue, fetchTtsWithRetry]);

  const cancelSpeech = useCallback(() => {
    cancelledRef.current = true;
    audioQueueRef.current = [];
    stopActivePlayback();
    stopBargeInWatch();
    setState("inactive");
  }, [stopActivePlayback, stopBargeInWatch]);

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
