"use client";

import { useAuth } from "contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import ui from "styles/ui.module.scss";

export default function LoginPage() {
  const { login, userId } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const emailId = useId();
  const passwordId = useId();

  const redirect = () => router.replace(`/users/${userId}`);

  if (userId) redirect();

  return (
    <main className={`${ui.container} ${ui.main} ${ui.flexCenter}`} style={{ minHeight: "80vh" }}>
      <div className={`${ui.box} ${ui.max400}`} style={{ width: "100%" }}>
        <h1 className={`${ui.textCenter} ${ui.mb24}`}>Welcome Back</h1>
        {error && <p className={`${ui.textDanger} ${ui.textCenter} ${ui.mb24}`}>{error}</p>}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            try {
              await login(email, password);
              redirect();
            } catch (error) {
              setError("Log in failed");
              throw error;
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
              Password
            </label>
            <input
              id={passwordId}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={ui.input}
              required
            />
          </div>
          <button type="submit" className={`${ui.btn} ${ui.btnPrimary}`}>
            Sign In
          </button>
        </form>
        <div className={`${ui.textCenter} ${ui.mt24} ${ui.gridGap8}`}>
          <Link href="/reset-password" className={ui.link}>
            Forgot your password?
          </Link>
          <p className={ui.textMuted}>
            Don't have an account?{" "}
            <Link href="/register" className={ui.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
