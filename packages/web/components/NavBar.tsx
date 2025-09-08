"use client";

import { useAuth } from "contexts/AuthContext";
import styles from "styles/ui.module.scss";

export default function NavBar() {
  const { token, logout } = useAuth();
  return (
    <nav className={styles.navbar}>
      <a href="/">Home</a>
      {!token && <a href="/login">Login</a>}
      {!token && <a href="/register">Register</a>}
      {token && <a href="/profile">My Profile</a>}
      {<a href="/users">Users</a>}
      {<a href="/units">Units</a>}
      {token && (
        <button type="button" onClick={logout} className={styles.navbarLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}
