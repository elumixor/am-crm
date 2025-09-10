"use client";

import { Icon } from "components/Icon";
import Link from "next/link";
import AuthSection from "./Auth";
import styles from "./style.module.scss";

export default function NavBar() {
  const linkClass = "button no-border unstyled";
  return (
    <nav className={`flex-between p-sm ${styles.navbar}`}>
      <div className="flex-center gap-sm">
        <Link href="/" className={styles.logoLink}>
          <Icon icon="logo" size="sm" />
        </Link>
        <Link href="/mentorship" className={linkClass}>
          Mentorship
        </Link>
        <Link href="/users" className={linkClass}>
          Users
        </Link>
        <Link href="/units" className={linkClass}>
          Units
        </Link>
      </div>
      <AuthSection />
    </nav>
  );
}
