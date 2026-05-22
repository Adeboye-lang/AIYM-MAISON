"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import Button from "@/components/ui/Button";

function VerifyEmailContent() {
  const params = useSearchParams();
  const email = params.get("email") ?? params.get("resend") ?? "";
  const error = params.get("error");

  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  const resend = async () => {
    if (!email || countdown > 0) return;
    setResendLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "verify" }),
    });
    setResendLoading(false);
    setResendDone(true);
    setCountdown(60);
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  if (error) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-50 flex items-center justify-center rounded-full">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div>
          <h1 className="font-display text-2xl text-brand-brown mb-2">Link expired or invalid</h1>
          <p className="text-brand-brown-mid text-sm">
            This verification link has expired or already been used. Request a new one below.
          </p>
        </div>
        <Link href="/auth/login" className="block w-full text-center uppercase tracking-widest text-xs font-medium px-6 py-3 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-colors">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-brand-yellow-light flex items-center justify-center">
          {resendDone ? <CheckCircle className="h-8 w-8 text-brand-yellow" /> : <Mail className="h-8 w-8 text-brand-yellow" />}
        </div>
      </div>

      <div>
        <h1 className="font-display text-3xl text-brand-brown mb-3">Check your email</h1>
        <p className="text-brand-brown-mid text-sm leading-relaxed">
          {resendDone
            ? "A new verification link has been sent. Check your inbox."
            : <>We&apos;ve sent a verification link to <strong>{email || "your email"}</strong>. Click it to activate your AIYM account.</>
          }
        </p>
      </div>

      {email && (
        <Button variant="ghost" fullWidth onClick={resend} disabled={countdown > 0} loading={resendLoading}>
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend verification email"}
        </Button>
      )}

      <Link href="/auth/login" className="block text-xs text-brand-yellow hover:underline">
        Back to sign in
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthCard imageSrc="/public/Picture 11.png" imageAlt="AIYM lifestyle">
      <Suspense>
        <VerifyEmailContent />
      </Suspense>
    </AuthCard>
  );
}
