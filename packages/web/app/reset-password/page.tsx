"use client";

import { useAuth } from "contexts/AuthContext";
import Link from "next/link";
import { useId, useState } from "react";
import ui from "styles/ui.module.scss";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  return (
    <main className={`${ui.container} ${ui.main} ${ui.flexCenter}`} style={{ minHeight: "80vh" }}>
      <div className={`${ui.box} ${ui.max400}`} style={{ width: "100%" }}>
        <h1 className={`${ui.textCenter} ${ui.mb24}`}>Reset Password</h1>
        {message && (
          <p className={`${ui.textCenter} ${ui.mb24}`} style={{ color: success ? "#28a745" : "#dc3545" }}>
            {message}
          </p>
        )}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setMessage(null);
            setLoading(true);
            try {
              await resetPassword(email, newPassword);
              setMessage("Password reset successfully!");
              setSuccess(true);
            } catch (error) {
              console.log(error);
              setMessage(error instanceof Error ? error.message : "Failed to reset password");
              setSuccess(false);
            } finally {
              setLoading(false);
            }
          }}
          className={ui.gridGap16}
        >
          <div className={ui.gridGap4}>
            <label htmlFor={emailId} className={ui.labelSm}>
              Email
            </label>
            <input
              id={emailId}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={ui.input}
              required
            />
          </div>
          <div className={ui.gridGap4}>
            <label htmlFor={passwordId} className={ui.labelSm}>
              New Password
            </label>
            <input
              id={passwordId}
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={ui.input}
              required
            />
          </div>
          <button type="submit" className={`${ui.btn} ${ui.btnPrimary}`} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className={`${ui.textCenter} ${ui.mt24}`}>
          <Link href="/login" className={ui.link}>
            ← Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
