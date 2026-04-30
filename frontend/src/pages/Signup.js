import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      setSuccess("Account created! An admin will review and approve your account.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = useCallback(async (response) => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/google", { credential: response.credential });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  }, [login, navigate]);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleSuccess,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signup-btn"),
        { theme: "outline", size: "large", width: "100%", text: "signup_with" }
      );
    }
  }, [handleGoogleSuccess]);

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="card">
          <h1>Create account</h1>
          <p className="subtitle">Your account will need admin approval before you can sign in.</p>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Creating…" : "Create Account"}
              </button>
            </form>
          )}

          {!success && (
            <>
              <div className="divider">or</div>
              <div id="google-signup-btn" style={{ display: "flex", justifyContent: "center" }} />
            </>
          )}

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--muted)" }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
