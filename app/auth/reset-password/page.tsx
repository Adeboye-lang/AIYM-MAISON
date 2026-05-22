"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordStrength from "@/components/auth/PasswordStrength";
import Button from "@/components/ui/Button";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [passErr, setPassErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [apiError, setApiError] = useState("");

  if (!token) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl text-brand-brown">Invalid link</h1>
        <p className="text-brand-brown-mid text-sm">
          This reset link is missing or invalid.{" "}
          <Link href="/auth/forgot-password" className="text-brand-yellow hover:underline">
            Request a new one
          </Link>.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassErr(""); setConfirmErr(""); setApiError("");
    if (newPass.length < 8) { setPassErr("Min 8 characters."); return; }
    if (newPass !== confirm) { setConfirmErr("Passwords do not match."); return; }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: newPass }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setApiError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/auth/login?reset=1");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-brand-brown mb-1">Choose a new password</h1>
        <p className="text-brand-brown-light text-sm">Must be at least 8 characters with a number and uppercase letter.</p>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded">
          {apiError}{" "}
          <Link href="/auth/forgot-password" className="underline">Request a new link</Link>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <PasswordInput label="New password" value={newPass} onChange={(e) => setNewPass(e.target.value)} error={passErr} required />
          <PasswordStrength password={newPass} />
        </div>
        <PasswordInput label="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={confirmErr} required />
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Update Password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard imageSrc="/images/Picture 20.png" imageAlt="AIYM lifestyle">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
