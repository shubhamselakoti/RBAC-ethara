import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import api from "../utils/api";

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  // Unapproved users see pending screen
  if (!user.isApproved) {
    return (
      <div className="pending-screen">
        <div className="pending-box">
          <div className="pending-icon">⏳</div>
          <h2>Pending Approval</h2>
          <p>
            Your account is awaiting admin approval. You'll be able to access the app once an admin reviews your request.
          </p>
          <button
            className="btn-secondary"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const handleAdminRequest = async () => {
    setMsg("");
    setLoading(true);
    try {
      if (user.adminRequestPending) {
        await api.delete("/user/request-admin");
        setMsg("Admin request cancelled.");
      } else {
        await api.post("/user/request-admin");
        setMsg("Admin role request submitted! An admin will review it.");
      }
      await refreshUser();
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Topbar />
      <div className="page-content">
        <div className="dashboard-welcome">
          <h1>Hello, {user.name.split(" ")[0]} 👋</h1>
          <p>Here's your account overview.</p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <div className="label">Account Status</div>
            <div className="value">
              <span className="status-badge badge-approved">✓ Approved</span>
            </div>
          </div>
          <div className="info-card">
            <div className="label">Role</div>
            <div className="value">
              <span className={`status-badge ${user.role === "admin" ? "badge-admin" : "badge-pending"}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
          <div className="info-card">
            <div className="label">Email</div>
            <div className="value">{user.email}</div>
          </div>
          <div className="info-card">
            <div className="label">Member Since</div>
            <div className="value">Active</div>
          </div>
        </div>

        {user.role !== "admin" && (
          <div className="card" style={{ maxWidth: 480 }}>
            <h3 style={{ marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>Admin Access</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
              {user.adminRequestPending
                ? "Your admin role request is pending review."
                : "Request elevated admin privileges. An admin will review your request."}
            </p>
            {msg && (
              <div className={msg.includes("wrong") ? "error-msg" : "success-msg"} style={{ marginBottom: 12 }}>
                {msg}
              </div>
            )}
            <button
              className={user.adminRequestPending ? "btn-danger btn-sm" : "btn-secondary btn-sm"}
              onClick={handleAdminRequest}
              disabled={loading}
            >
              {loading
                ? "Processing…"
                : user.adminRequestPending
                ? "Cancel Request"
                : "Request Admin Role"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
