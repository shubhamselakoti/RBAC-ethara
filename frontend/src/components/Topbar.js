import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="topbar-brand">AuthApp</div>
      <div className="topbar-right">
        {user && <span>{user.name}</span>}
        {user?.role === "admin" && (
          <button className="btn-secondary btn-sm" onClick={() => navigate("/admin")}>
            Admin Panel
          </button>
        )}
        {window.location.pathname === "/admin" && (
          <button className="btn-secondary btn-sm" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        )}
        <button className="btn-secondary btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
