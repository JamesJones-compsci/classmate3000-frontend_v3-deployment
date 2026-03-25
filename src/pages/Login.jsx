// src/pages/Login.jsx
// Login screen for ClassMate.
// On success, JWT token and email are stored in sessionStorage via AuthContext.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [error,        setError]        = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/api/v1/auth/login", {
        email: email.trim(),
        password,
      });

      // Login endpoint returns only token — use email initial as display name fallback.
      const emailInitial = email.trim().charAt(0).toUpperCase();
      login(res.data.token, emailInitial, "", email.trim());
      navigate("/dashboard");

    } catch (err) {
      console.error("Login failed", {
        status: err?.response?.status,
        data:   err?.response?.data,
        url:    err?.config?.url,
      });

      let message = "Something went wrong. Please try again.";
      if (err?.response?.status === 401) {
        message = "Incorrect email or password. Please try again.";
      } else if (err?.response?.status === 404) {
        message = "No account found with that email address.";
      } else if (err?.response?.status >= 500) {
        message = "The server is having a problem right now. Please try again later.";
      } else if (err?.request && !err?.response) {
        message = "Could not reach the server. Please make sure the backend is running.";
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">ClassMate™</div>
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">
          Sign in to manage courses, tasks, grades, and reminders.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-row">
            <label className="auth-label" htmlFor="email">Email</label>
            <input id="email" className="auth-input" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" autoComplete="email" required />
          </div>

          <div className="auth-row">
            <label className="auth-label" htmlFor="password">Password</label>
            <input id="password" className="auth-input" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password" required />
          </div>

          <button className="auth-button" type="submit"
            disabled={isSubmitting || !email.trim() || !password}>
            {isSubmitting ? "Signing in…" : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="auth-link">Sign up here</Link>
        </div>
      </div>
    </div>
  );
}