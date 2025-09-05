"use client";

import type { CreateUserPayload, User } from "@am-crm/shared";
import { useCallback, useEffect, useId, useState } from "react";

type UserFormData = CreateUserPayload;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({ email: "" });
  const [submitting, setSubmitting] = useState(false);

  const emailId = useId();

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) throw new Error("API_BASE_URL is not defined");

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBase}/users`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  // Create user
  const createUser = async (userData: UserFormData) => {
    const response = await fetch(`${apiBase}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  };

  // Update user
  const updateUser = async (id: string, userData: UserFormData) => {
    const response = await fetch(`${apiBase}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  };

  // Delete user
  const deleteUser = async (id: string) => {
    const response = await fetch(`${apiBase}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) return;

    try {
      setSubmitting(true);
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      await fetchUsers();
      setShowForm(false);
      setEditingUser(null);
      setFormData({ email: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.email}?`)) return;

    try {
      await deleteUser(user.id);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  // Handle edit
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ email: user.email });
    setShowForm(true);
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ email: "" });
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div style={{ fontFamily: "system-ui", padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, color: "#333" }}>User Management</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Add New User
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "24px",
            border: "1px solid #f5c6cb",
          }}
        >
          {error}
        </div>
      )}

      {/* User Form Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90vw",
            }}
          >
            <h2 style={{ margin: "0 0 20px 0" }}>{editingUser ? "Edit User" : "Add New User"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label htmlFor={emailId} style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
                  Email *
                </label>
                <input
                  id={emailId}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                {/* Name field removed (schema now uses displayName/spiritualName elsewhere) */}
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #ddd",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? "Saving..." : editingUser ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading users...</div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          No users found. Click "Add New User" to create one.
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Display</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Unit</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Mentor</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Mentees</th>
                <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #dee2e6" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "12px" }}>{user.email}</td>
                  <td style={{ padding: "12px" }}>{user.displayName || user.spiritualName || user.fullName || "-"}</td>
                  <td style={{ padding: "12px" }}>{user.unitId || "-"}</td>
                  <td style={{ padding: "12px" }}>{user.mentorId || "-"}</td>
                  <td style={{ padding: "12px" }}>{user.menteeIds?.length ?? 0}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#ffc107",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
