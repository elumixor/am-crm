"use client";

import type { User } from "@am-crm/shared";
import { EntityChip } from "components/EntityChip";
import type { InferRequestType } from "hono/client";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { client } from "services/http";
import ui from "styles/ui.module.scss";
import { z } from "zod";

type CreateUserPayload = InferRequestType<typeof client.users.$post>["json"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ email: "" });
  const [submitting, setSubmitting] = useState(false);

  const emailId = useId();

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await client.users.$get();
      if (!response.ok) throw new Error("Failed to fetch users");
      const { data } = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnits = useCallback(async () => {
    const res = await (await client.units.$get()).json();
    if (res.ok) setUnits(res.data);
  }, []);

  // Create user
  const createUserSchema = z.object({ email: z.email() });
  const createUser = (userData: CreateUserPayload) => {
    // Client-side guard mirroring API validator
    createUserSchema.parse(userData);
    return client.users.$post({ json: { email: userData.email } });
  };

  // Update user
  const updateUserSchema = z.object({ email: z.email() });
  const updateUser = async (id: string, userData: CreateUserPayload) => {
    updateUserSchema.parse(userData);
    return await client.users[":id"].$put({ param: { id }, json: { email: userData.email } });
  };

  // Delete user
  const deleteUser = async (id: string) => {
    const res = await client.users[":id"].$delete({ param: { id } });
    if (!res.ok) throw new Error("Failed to delete user");
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
    fetchUnits();
  }, [fetchUsers, fetchUnits]);

  return (
    <div className={`${ui.container} ${ui.main} ${ui.max1200} ${ui.mxAuto}`}>
      <div className={`${ui.flexRow} ${ui.justifyBetween} ${ui.alignCenter} ${ui.mb24}`}>
        <h1 className={ui.mt0}>User Management</h1>
        <button type="button" onClick={() => setShowForm(true)} className={`${ui.btn} ${ui.btnPrimary}`}>
          Add New User
        </button>
      </div>

      {error && (
        <div className={ui.panel} style={{ background: "#f8d7da", borderColor: "#f5c6cb", color: "#721c24" }}>
          {error}
        </div>
      )}

      {/* User Form Modal */}
      {showForm && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <h2 style={{ margin: 0, marginBottom: 20 }}>{editingUser ? "Edit User" : "Add New User"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label htmlFor={emailId} style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                  Email *
                </label>
                <input
                  id={emailId}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className={ui.input}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                {/* Name field removed (schema now uses displayName/spiritualName elsewhere) */}
              </div>
              <div className={`${ui.flexRowGap12} ${ui.justifyEnd}`}>
                <button type="button" onClick={handleCancel} className={`${ui.btn} ${ui.btnOutline}`}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className={`${ui.btn} ${ui.btnPrimary}`}>
                  {submitting ? "Saving..." : editingUser ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className={ui.textMuted} style={{ textAlign: "center", padding: 40 }}>
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className={ui.textMuted} style={{ textAlign: "center", padding: 40 }}>
          No users found. Click "Add New User" to create one.
        </div>
      ) : (
        <div className={ui.card}>
          <table className={ui.table}>
            <thead>
              <tr className={ui.tableHead}>
                <th className={ui.th}>User</th>
                <th className={ui.th}>Unit</th>
                <th className={ui.th}>Mentor</th>
                <th className={ui.th}>Mentees</th>
                <th className={`${ui.th} ${ui.textCenter}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const unit = units.find((u) => u.id === user.unitId);
                const unitLabel = unit ? unit.name : user.unitId || "-";
                const display = user.displayName || user.spiritualName || user.fullName || "-";
                return (
                  <tr key={user.id}>
                    <td className={ui.td}>
                      <div className={`${ui.flexRowGap8} ${ui.alignCenter}`}>
                        <Link href={`/users/${user.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                          <div
                            className={""}
                            style={{
                              backgroundImage: user.photoUrl ? `url(${user.photoUrl})` : "url(/images/user.png)",
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              border: "1px solid #ccc",
                              flexShrink: 0,
                            }}
                          />
                        </Link>
                        <div style={{ display: "grid" }}>
                          <Link href={`/users/${user.id}`} className={ui.link}>
                            {display}
                          </Link>
                          <span className={ui.textMuted} style={{ fontSize: 12 }}>
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={ui.td}>
                      {user.unitId && unit ? (
                        <EntityChip id={unit.id} type="unit" name={unitLabel} href={`/units/${unit.id}`} />
                      ) : (
                        <span style={{ color: "#999" }}>-</span>
                      )}
                    </td>
                    <td className={ui.td}>
                      {(() => {
                        if (!user.mentorId) return "-";
                        const mentor = users.find((u) => u.id === user.mentorId);
                        return mentor ? (
                          <EntityChip
                            id={mentor.id}
                            type="user"
                            name={mentor.displayName || mentor.spiritualName || mentor.email}
                            href={`/users/${mentor.id}`}
                            photoUrl={mentor.photoUrl || undefined}
                          />
                        ) : (
                          user.mentorId
                        );
                      })()}
                    </td>
                    <td className={ui.td}>{user.menteeIds?.length ?? 0}</td>
                    <td className={`${ui.td} ${ui.textCenter}`}>
                      <div className={`${ui.flexRowGap8} ${ui.justifyCenter}`}>
                        <button type="button" onClick={() => handleEdit(user)} className={`${ui.btn} ${ui.btnWarn}`}>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className={`${ui.btn} ${ui.btnDanger}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
