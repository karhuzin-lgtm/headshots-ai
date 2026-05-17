"use client";

import { useEffect, useState } from "react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { createBrowserClient } from "@/lib/supabase/client";

export function UploadAuthStrip() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    void createBrowserClient()
      .auth.getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  if (email === undefined) {
    return null;
  }

  if (!email) {
    return (
      <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-6 text-center backdrop-blur-sm sm:flex-row sm:justify-center sm:py-5">
        <p className="text-sm text-muted-foreground">Sign in to upload your references.</p>
        <GoogleSignInButton className="h-10 shrink-0 rounded-full px-6" />
      </div>
    );
  }

  return (
    <p className="mb-6 text-center text-sm text-muted-foreground">
      Signed in as <span className="font-medium text-foreground">{email}</span>
    </p>
  );
}
