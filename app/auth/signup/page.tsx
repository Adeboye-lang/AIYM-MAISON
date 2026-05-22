"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordStrength from "@/components/auth/PasswordStrength";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirm: "",
    terms: false, marketing: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [devLink, setDevLink] = useState("");

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName) e.firstName = "Required.";
    if (!form.lastName) e.lastName = "Required.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email.";
    if (!form.password || form.password.length < 8) e.password = "Min 8 characters.";
    else if (!/[A-Z]/.test(form.password)) e.password = "Must include an uppercase letter.";
    else if (!/[0-9]/.test(form.password)) e.password = "Must include a number.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    if (!form.terms) e.terms = "You must agree to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    setDevLink("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        marketingConsent: form.marketing,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setApiError(data.error ?? "Something went wrong.");
      return;
    }

    if (data.devVerifyLink) {
      // Dev mode: no email configured — show the link directly on this page
      setDevLink(data.devVerifyLink);
    } else {
      router.push("/auth/verify-email?email=" + encodeURIComponent(form.email));
    }
  };

  // Dev mode: show the verification link inline
  if (devLink) {
    return (
      <AuthLayout imageSrc="/images/Picture-2.png" imageAlt="AIYM lifestyle" tagline="Your glow. Your shade. Your way.">
        <div className="space-y-5">
          <div>
            <h1 className="font-display text-3xl text-brand-brown mb-1">Account created!</h1>
            <p className="text-brand-brown-light text-sm">Gmail isn&apos;t configured yet — click the link below to verify.</p>
          </div>
          <div className="h-px bg-brand-yellow w-full" />
          <div className="bg-brand-surface border border-brand-yellow p-4 space-y-3">
            <p className="text-xs uppercase tracking-widest text-brand-yellow">Dev Mode — Verify Link</p>
            <a
              href={devLink}
              className="block text-sm text-brand-brown underline break-all hover:text-brand-yellow transition-colors"
            >
              {devLink}
            </a>
            <p className="text-xs text-brand-brown-light">
              Once Gmail App Password is added to .env.local, this link will be sent by email instead.
            </p>
          </div>
          <a
            href={devLink}
            className="block w-full text-center uppercase tracking-widest text-xs font-medium px-6 py-4 bg-brand-yellow text-brand-brown hover:bg-brand-yellow-light transition-colors"
          >
            Click to Verify &amp; Sign In
          </a>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-brand-brown mb-1">Create your account</h1>
          <p className="text-brand-brown-light text-sm">Join the AIYM Inner Circle</p>
        </div>
        <div className="h-px bg-brand-yellow w-full" />

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="First name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} error={errors.firstName} required />
            <Input label="Last name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} error={errors.lastName} required />
          </div>

          <Input label="Email address" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} required />

          <div className="space-y-2">
            <PasswordInput label="Password" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} required />
            <PasswordStrength password={form.password} />
          </div>

          <PasswordInput label="Confirm password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} error={errors.confirm} required />

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.terms} onChange={(e) => set("terms", e.target.checked)} className="mt-0.5 accent-brand-yellow" required />
              <span className="text-xs text-brand-brown-mid">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-brand-yellow hover:underline">Terms &amp; Conditions</Link>
                {" "}and{" "}
                <Link href="/privacy" target="_blank" className="text-brand-yellow hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.marketing} onChange={(e) => set("marketing", e.target.checked)} className="mt-0.5 accent-brand-yellow" />
              <span className="text-xs text-brand-brown-mid">Yes, I&apos;d like exclusive offers and updates from AIYM</span>
            </label>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-brand-brown-mid">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-yellow hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
