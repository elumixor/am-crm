"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../components/AuthContext";

export default function RegisterPage() {
  const { register, loading, token } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!loading && token) router.replace("/profile");

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 400 }}>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          const ok = await register(email, password);
          if (!ok) setError("Registration failed");
          else router.replace("/profile");
        }}
        style={{ display: "grid", gap: 12 }}
      >
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <p>
        Have an account? <a href="/login">Login</a>
      </p>
    </main>
  );
}
