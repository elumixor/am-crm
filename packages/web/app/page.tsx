import UsersPage from "./users/page";

export default async function Page() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>AM CRM Users</h1>
      <UsersPage />
    </main>
  );
}
