"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface PasswordGateProps {
  inviteToken: string;
  onVerified: () => void;
}

export function PasswordGate({ inviteToken, onVerified }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/survey/${inviteToken}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.valid) {
        onVerified();
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center max-w-sm mx-auto py-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/merkle-logo.webp" alt="Merkle" className="h-8 w-auto mx-auto mb-6" />
      <h2 className="text-xl font-bold text-slate-900 mb-2">Survey Access</h2>
      <p className="text-sm text-slate-600 mb-6">
        This survey is password protected. Enter the password provided by your Merkle contact to continue.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Enter survey password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-sm px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" size="lg" loading={loading}>
          Continue →
        </Button>
      </form>
    </div>
  );
}
