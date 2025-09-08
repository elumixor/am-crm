"use client";

import AuthSection from "components/AuthSection";
import Image from "next/image";
import Link from "next/link";
import styles from "styles/ui.module.scss";

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/images/logo.png" alt="App Logo" width={32} height={32} className={styles.logo} />
        </Link>
        <Link href="/mentees" className={styles.navButton}>
          <Image src="/images/mentorship.png" alt="Mentorship" width={20} height={20} />
          Mentorship
        </Link>
        <Link href="/users" className={styles.navButton}>
          <Image src="/images/people.png" alt="Users" width={20} height={20} />
          Users
        </Link>
        <Link href="/units" className={styles.navButton}>
          <Image src="/images/unit.png" alt="Units" width={20} height={20} />
          Units
        </Link>
      </div>
      <div className={styles.navbarRight}>
        <AuthSection />
      </div>
    </nav>
  );
}
