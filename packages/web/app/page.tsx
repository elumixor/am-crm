import UsersPage from "./users/page";

async function fetchUsers() {
  const base = process.env.API_BASE_URL;
  if (!base) throw new Error("API_BASE_URL is not defined");

  try {
    const res = await fetch(`${base}/users`, { cache: "no-store" });
    console.log(res);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Page() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>AM CRM Users</h1>
      <UsersPage />
    </main>
  );
}
