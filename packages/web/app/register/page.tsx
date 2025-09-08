"use client";

import { useAuth } from "contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import ui from "styles/ui.module.scss";

export default function RegisterPage() {
  const { register, loading, token } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const emailId = useId();
  const passwordId = useId();

  if (!loading && token) router.replace("/profile");

  return (
    <main className={`${ui.container} ${ui.main} ${ui.flexCenter}`} style={{ minHeight: "80vh" }}>
      <div className={`${ui.box} ${ui.max400}`} style={{ width: "100%" }}>
        <h1 className={`${ui.textCenter} ${ui.mb24}`}>Create Account</h1>
        {error && <p className={`${ui.textDanger} ${ui.textCenter} ${ui.mb24}`}>{error}</p>}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            const ok = await register(email, password);
            if (!ok) setError("Registration failed. Please try again.");
            else router.replace("/profile");
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
              Password
            </label>
            <input
              id={passwordId}
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={ui.input}
              required
            />
          </div>
          <button type="submit" className={`${ui.btn} ${ui.btnPrimary}`} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <div className={`${ui.textCenter} ${ui.mt24}`}>
          <p className={ui.textMuted}>
            Already have an account?{" "}
            <Link href="/login" className={ui.link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
