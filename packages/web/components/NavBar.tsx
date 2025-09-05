"use client";
import { useAuth } from "./AuthContext";

export default function NavBar() {
  const { token, logout } = useAuth();
  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", gap: 16, fontFamily: "system-ui" }}>
      <a href="/">Home</a>
      {!token && <a href="/login">Login</a>}
      {!token && <a href="/register">Register</a>}
      {token && <a href="/profile">My Profile</a>}
      {<a href="/users">Users</a>}
      {<a href="/units">Units</a>}
      {token && (
        <button type="button" onClick={logout} style={{ marginLeft: "auto" }}>
          Logout
        </button>
      )}
    </nav>
  );
}
