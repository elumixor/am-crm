"use client";

import type { User } from "@am-crm/shared";
import { EntityChip } from "components/EntityChip";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { client, validJson } from "services/http";
import ui from "styles/ui.module.scss";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    const response = await client.users.$get();
    const { data } = await validJson(response);
    setUsers(data);
  }, []);

  // Fetch units
  const fetchUnits = useCallback(async () => {
    const response = await client.units.$get();
    const { data } = await response.json();
    setUnits(data);
  }, []);

  // Handle delete
  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.email}?`)) return;

    await client.users[":id"].$delete({ param: { id: user.id } });
    await fetchUsers();
  };

  useEffect(() => {
    void fetchUsers();
    void fetchUnits();
  }, [fetchUsers, fetchUnits]);

  return (
    <div className={`${ui.container} ${ui.main} ${ui.max1200} ${ui.mxAuto}`}>
      <div className={`${ui.flexRow} ${ui.justifyBetween} ${ui.alignCenter} ${ui.mb24}`}>
        <h1 className={ui.mt0}>User Management</h1>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className={ui.textMuted} style={{ textAlign: "center", padding: 40 }}>
          No users found.
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
                      <button type="button" onClick={() => handleDelete(user)} className={`${ui.btn} ${ui.btnDanger}`}>
                        Delete
                      </button>
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
