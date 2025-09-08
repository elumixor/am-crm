"use client";

import ui from "styles/ui.module.scss";

export default function MenteesPage() {
  return (
    <main className={`${ui.container} ${ui.main}`}>
      <h1>Mentees</h1>
      <div style={{ display: "grid", gap: "24px" }}>
        <section style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px" }}>
          <h2>My Mentees</h2>
          <p>Placeholder for My Mentees section.</p>
        </section>
        <section style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px" }}>
          <h2>Unit Stats</h2>
          <p>Placeholder for Unit Stats section.</p>
        </section>
        <section style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px" }}>
          <h2>Global Stats</h2>
          <p>Placeholder for Global Stats section.</p>
        </section>
      </div>
    </main>
  );
}
