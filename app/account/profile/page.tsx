"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordStrength from "@/components/auth/PasswordStrength";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passSaving, setPassSaving] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");

  useEffect(() => {
    fetch("/api/account/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user ?? null);
        setFirstName(d.user?.firstName ?? "");
        setLastName(d.user?.lastName ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    const res = await fetch("/api/account/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName }),
    });
    setProfileSaving(false);
    if (res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUser((u: any) => ({ ...u, firstName, lastName }));
      setProfileMsg({ type: "success", text: "Changes saved." });
    } else {
      setProfileMsg({ type: "error", text: "Failed to save. Try again." });
    }
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPassMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    setPassSaving(true);
    setPassMsg(null);
    const res = await fetch("/api/account/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
    });
    const data = await res.json();
    setPassSaving(false);
    if (res.ok) {
      setCurrentPass(""); setNewPass(""); setConfirmPass("");
      setPassMsg({ type: "success", text: "Password updated." });
    } else {
      setPassMsg({ type: "error", text: data.error ?? "Failed to update password." });
    }
    setTimeout(() => setPassMsg(null), 4000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-brand-brown-light text-sm uppercase tracking-widest animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div>
        <h1 className="font-display text-4xl text-brand-brown uppercase mb-2">My Profile</h1>
        <div className="h-px bg-brand-yellow w-full" />
      </div>

      <section className="bg-brand-white p-6 border-t-[3px] border-brand-yellow space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown font-medium">Personal Details</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <Input label="Email address" type="email" value={user?.email ?? ""} readOnly />
            <p className="text-xs text-brand-brown-light mt-1">Changing your email requires re-verification.</p>
          </div>
          <Button type="submit" variant="primary" loading={profileSaving}>Save Changes</Button>
          {profileMsg && (
            <p className={`text-xs ${profileMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>{profileMsg.text}</p>
          )}
        </form>
      </section>

      <section className="bg-brand-white p-6 border-t-[3px] border-brand-yellow space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown font-medium">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <PasswordInput label="Current password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} required />
          <div className="space-y-2">
            <PasswordInput label="New password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required />
            <PasswordStrength password={newPass} />
          </div>
          <PasswordInput label="Confirm new password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />
          <Button type="submit" variant="primary" loading={passSaving}>Update Password</Button>
          {passMsg && (
            <p className={`text-xs ${passMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>{passMsg.text}</p>
          )}
        </form>
      </section>

      <section className="bg-brand-white p-6 border-t-[3px] border-brand-yellow space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown font-medium mb-3">Account Details</h2>
        <p className="text-sm text-brand-brown-mid">Member since: {user?.createdat ? formatDate(user.createdat) : "—"}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-widest text-brand-brown font-medium">Danger Zone</h2>
        <button type="button" onClick={() => setDeleteOpen(true)} className="text-sm text-red-500 hover:underline">
          Delete my account
        </button>
      </section>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Account" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="text-sm text-brand-brown-mid">
            Are you sure? This is permanent and cannot be undone. All your order history will be deleted.
          </p>
          <Input
            label={`Type "${user?.email ?? ""}" to confirm`}
            value={deleteEmail}
            onChange={(e) => setDeleteEmail(e.target.value)}
            placeholder={user?.email ?? ""}
          />
          <button
            type="button"
            disabled={deleteEmail !== user?.email}
            className="w-full py-3 bg-red-600 text-white text-xs uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Yes, Delete My Account
          </button>
        </div>
      </Modal>
    </div>
  );
}
