import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import api from "../utils/api";

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setActionMsg("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const doAction = async (method, url, successMsg) => {
    setActionMsg("");
    try {
      await api[method](url);
      setActionMsg(successMsg);
      fetchUsers();
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Action failed");
    }
  };

  const pendingApproval = users.filter((u) => !u.isApproved && u._id !== user?.id);
  const adminRequests = users.filter((u) => u.adminRequestPending);
  const allUsers = users.filter((u) => u._id !== user?.id);

  return (
    <div className="app-shell">
      <Topbar />
      <div className="page-content">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage users, approvals, and roles.</p>
        </div>

        {actionMsg && (
          <div
            className={actionMsg.toLowerCase().includes("fail") || actionMsg.toLowerCase().includes("cannot") ? "error-msg" : "success-msg"}
            style={{ marginBottom: 20 }}
          >
            {actionMsg}
          </div>
        )}

        {/* Pending Approvals */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="section-title">⏳ Pending Approvals ({pendingApproval.length})</div>
          {loading ? (
            <p style={{ color: "var(--muted)" }}>Loading…</p>
          ) : pendingApproval.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>No pending approvals.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Provider</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApproval.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td style={{ color: "var(--muted)" }}>{u.email}</td>
                    <td><span className="status-badge badge-pending">{u.authProvider}</span></td>
                    <td>
                      <div className="actions">
                        <button className="btn-success" onClick={() => doAction("patch", `/admin/users/${u._id}/approve`, `${u.name} approved`)}>
                          Approve
                        </button>
                        <button className="btn-danger" onClick={() => doAction("patch", `/admin/users/${u._id}/reject`, `${u.name} rejected`)}>
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Admin Role Requests */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="section-title">🔑 Admin Role Requests ({adminRequests.length})</div>
          {adminRequests.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>No pending admin requests.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminRequests.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td style={{ color: "var(--muted)" }}>{u.email}</td>
                    <td><span className="status-badge badge-pending">{u.role}</span></td>
                    <td>
                      <div className="actions">
                        <button className="btn-success" onClick={() => doAction("patch", `/admin/users/${u._id}/approve-admin`, `${u.name} made admin`)}>
                          Grant Admin
                        </button>
                        <button className="btn-danger" onClick={() => doAction("patch", `/admin/users/${u._id}/reject-admin`, `Request rejected`)}>
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* All Users */}
        <div className="card">
          <div className="section-title">👥 All Users ({allUsers.length})</div>
          {loading ? (
            <p style={{ color: "var(--muted)" }}>Loading…</p>
          ) : allUsers.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>No other users.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      {u.name}
                      {u.isSeededAdmin && (
                        <span className="status-badge badge-admin" style={{ marginLeft: 8, fontSize: 10 }}>SEED</span>
                      )}
                    </td>
                    <td style={{ color: "var(--muted)" }}>{u.email}</td>
                    <td>
                      <span className={`status-badge ${u.role === "admin" ? "badge-admin" : "badge-pending"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.isApproved ? "badge-approved" : "badge-pending"}`}>
                        {u.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td>
                      {u.isSeededAdmin ? (
                        <span style={{ color: "var(--muted)", fontSize: 12 }}>Protected</span>
                      ) : (
                        <div className="actions">
                          {u.role === "user" ? (
                            <button className="btn-sm btn-secondary" onClick={() => doAction("patch", `/admin/users/${u._id}/promote`, `${u.name} promoted`)}>
                              Promote
                            </button>
                          ) : (
                            <button className="btn-sm btn-secondary" onClick={() => doAction("patch", `/admin/users/${u._id}/demote`, `${u.name} demoted`)}>
                              Demote
                            </button>
                          )}
                          {!u.isApproved ? (
                            <button className="btn-success" onClick={() => doAction("patch", `/admin/users/${u._id}/approve`, `${u.name} approved`)}>
                              Approve
                            </button>
                          ) : (
                            <button className="btn-sm btn-secondary" onClick={() => doAction("patch", `/admin/users/${u._id}/reject`, `${u.name} unapproved`)}>
                              Revoke
                            </button>
                          )}
                          <button className="btn-danger" onClick={() => {
                            if (window.confirm(`Delete ${u.name}?`)) {
                              doAction("delete", `/admin/users/${u._id}`, `${u.name} deleted`);
                            }
                          }}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
