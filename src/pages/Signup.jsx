import { useMemo, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 5c7 0 10 7 10 7s-3 7-10 7S2 12 2 12s3-7 10-7Zm0 2C7 7 4.6 10.7 4.1 12c.5 1.3 2.9 5 7.9 5s7.4-3.7 7.9-5C19.4 10.7 17 7 12 7Zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Z"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2 5.3 3.3 4 20 20.7 18.7 22l-2.1-2.1c-1.4.7-3 .1-4.6.1-7 0-10-7-10-7a18.5 18.5 0 0 1 5-5.8L2 5.3Zm8.2 8.2a2.5 2.5 0 0 0 3.3 3.3l-3.3-3.3ZM12 7c-.7 0-1.4.1-2 .2l-1.6-1.6c1.1-.4 2.3-.6 3.6-.6 7 0 10 7 10 7a18.9 18.9 0 0 1-4.1 5.1l-2.1-2.1A15 15 0 0 0 19.9 12C19.4 10.7 17 7 12 7Zm0 2.5c.2 0 .4 0 .6.1l-3 3c0-.2-.1-.4-.1-.6A2.5 2.5 0 0 1 12 9.5Z"
      />
    </svg>
  );
}

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const passwordMismatch = useMemo(() => {
    if (!confirmPassword) return false;
    return password !== confirmPassword;
  }, [password, confirmPassword]);

  const canSubmit = useMemo(() => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      password &&
      confirmPassword &&
      !passwordMismatch &&
      !isSubmitting
    );
  }, [firstName, lastName, email, password, confirmPassword, passwordMismatch, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (passwordMismatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/api/v1/auth/register", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        `Signup failed (status: ${err?.response?.status ?? "unknown"})`;

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">ClassMate™</div>
        <h2 className="auth-title">Sign Up</h2>
        <p className="auth-subtitle">Create your account to manage courses, tasks, grades, and reminders.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-row">
            <label className="auth-label" htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              className="auth-input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              autoComplete="given-name"
              required
            />
          </div>

          <div className="auth-row">
            <label className="auth-label" htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              className="auth-input"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              autoComplete="family-name"
              required
            />
          </div>

          <div className="auth-row">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-row">
            <label className="auth-label" htmlFor="password">Password</label>
            <div className="auth-input-wrap">
              <input
                id="password"
                className={`auth-input auth-input--with-icon ${passwordMismatch ? "auth-input--error" : ""}`}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-icon-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <div className="auth-row">
            <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-input-wrap">
              <input
                id="confirmPassword"
                className={`auth-input auth-input--with-icon ${passwordMismatch ? "auth-input--error" : ""}`}
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-icon-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {passwordMismatch && (
              <div className="auth-hint auth-hint--error">Passwords do not match.</div>
            )}
          </div>

          <button className="auth-button" type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>

          <div className="auth-footer">
            Already have an account?{" "}
            <a className="auth-link" href="/login">Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
