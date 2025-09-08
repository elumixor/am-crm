"use client";
import { useAuth } from "contexts/AuthContext";
import { useState } from "react";
import ui from "styles/ui.module.scss";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState<string | null>(null);

  return (
    <main className={`${ui.container} ${ui.main} ${ui.max400}`}>
      <h1>Reset Password</h1>
      {message && <p>{message}</p>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setMessage(null);
          await resetPassword(email, newPassword);
          setMessage("Password reset.");
        }}
        className={ui.gridGap12}
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
