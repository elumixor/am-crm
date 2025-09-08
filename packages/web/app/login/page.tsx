"use client";

import { useAuth } from "contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ui from "styles/ui.module.scss";

export default function LoginPage() {
  const { login, loading, token } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!loading && token) router.replace("/profile");

  return (
    <main className={`${ui.container} ${ui.main} ${ui.max400}`}>
      <h1>Login</h1>
      {error && <p className={ui.textDanger}>{error}</p>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          const ok = await login(email, password);
          if (!ok) setError("Invalid credentials");
          else router.replace("/profile");
        }}
        className={ui.gridGap12}
      >
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>
        No account? <a href="/register">Register</a>
      </p>
    </main>
  );
}
