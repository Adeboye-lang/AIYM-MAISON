"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetLink, setDevResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.devResetLink) setDevResetLink(data.devResetLink);
    setSubmitted(true);
  };

  return (
    <AuthCard imageSrc="/public/Picture 5.png" imageAlt="AIYM glow lifestyle">
      <div className="space-y-6">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-xs text-brand-brown-light hover:text-brand-brown transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>

        <div>
          <h1 className="font-display text-2xl text-brand-brown mb-2">Reset your password</h1>
          {!submitted && (
            <p className="text-brand-brown-light text-sm">
              Enter the email on your account and we&apos;ll send you a reset link.
            </p>
          )}
        </div>

        {submitted ? (
          <div className="space-y-4">
            {devResetLink ? (
              <>
                <div className="bg-brand-surface border border-brand-yellow p-4 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-brand-yellow">Dev Mode — Reset Link</p>
                  <a
                    href={devResetLink}
                    className="block text-sm text-brand-brown underline break-all hover:text-brand-yellow transition-colors"
                  >
                    {devResetLink}
                  </a>
                </div>
                <a
                  href={devResetLink}
                  className="block w-full text-center uppercase tracking-widest text-xs font-medium px-6 py-4 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-colors"
                >
                  Click to Reset Password
                </a>
              </>
            ) : (
              <p className="font-display text-xl text-brand-brown">
                If an account exists for{" "}
                <span className="text-brand-yellow">{email}</span>,
                a reset link has been sent. Check your inbox and spam folder.
              </p>
            )}
            <Link href="/auth/login" className="block text-xs text-brand-yellow hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Send Reset Link
            </Button>
          </form>
        )}
      </div>
    </AuthCard>
  );
}
