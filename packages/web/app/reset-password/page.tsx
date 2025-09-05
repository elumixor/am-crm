"use client";
import { useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!apiBase) throw new Error("API_BASE_URL is not defined");

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 400 }}>
      <h1>Reset Password</h1>
      {message && <p>{message}</p>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setMessage(null);
          const res = await fetch(`${apiBase}/auth/reset-password`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email, newPassword }),
          });
          setMessage(res.ok ? "Password reset." : "Failed to reset password");
        }}
        style={{ display: "grid", gap: 12 }}
      >
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="new password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset</button>
      </form>
      <p>
        <a href="/login">Back to login</a>
      </p>
    </main>
  );
}
