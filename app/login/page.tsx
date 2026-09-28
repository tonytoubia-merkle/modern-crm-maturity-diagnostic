"use client";

import { useEffect } from "react";

export default function LoginRedirect() {
  useEffect(() => {
    // Redirect to new passwordless auth page, preserving redirect param
    const redirect = new URLSearchParams(window.location.search).get("redirect") || "/";
    window.location.href = `/auth?redirect=${encodeURIComponent(redirect)}`;
  }, []);

  return <div className="text-center p-8">Redirecting to sign in...</div>;
}
