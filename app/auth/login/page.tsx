"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/auth/PasswordInput";
import Button from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/account/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");

  const validate = () => {
    let ok = true;
    setEmailErr(""); setPassErr("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErr("Please enter a valid email address."); ok = false;
    }
    if (!password || password.length < 8) {
      setPassErr("Password must be at least 8 characters."); ok = false;
    }
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (data.code === "EMAIL_NOT_VERIFIED") {
        router.push("/auth/verify-email?resend=" + encodeURIComponent(email));
      } else {
        setError(data.error ?? "Invalid email or password.");
      }
      return;
    }

    const destination = data.role === "admin" ? "/admin/dashboard" : next;
    router.push(destination);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-brand-brown mb-1">Welcome back</h1>
        <p className="text-brand-brown-light text-sm">Sign in to your AIYM account</p>
      </div>
      <div className="h-px bg-brand-yellow w-full" />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={emailErr} required />
        <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} error={passErr} required />

        <div className="flex items-center justify-between text-xs">
          <span />
          <Link href="/auth/forgot-password" className="text-brand-yellow hover:underline">
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-xs text-brand-brown-mid">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-brand-yellow hover:underline font-medium">
          Sign up here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout imageSrc="/images/Picture-3.png" imageAlt="Model with golden tan" tagline="Crafted for melanin. Built for glow.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
