export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-lg border rounded p-lg">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
