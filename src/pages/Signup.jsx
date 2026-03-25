// src/pages/Signup.jsx
// Registration screen for ClassMate.
// Sends firstName, lastName, email, and password to the User Service via the API Gateway.
// On success, the returned JWT token is stored in sessionStorage via AuthContext.login()
// and the user is redirected to /dashboard.
//
// Client-side validation:
//   - All fields required
//   - Password minimum 6 characters
//   - Passwords must match before submit is enabled

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../auth/AuthContext";

// Toggle icon for the show/hide password button.
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

// Minimum password length enforced on both client and ideally also on the backend.
const MIN_PASSWORD_LENGTH = 6;

export default function Signup() {
  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [error,           setError]           = useState("");
  const [isSubmitting,    setIsSubmitting]    = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  // True only when confirmPassword is filled and does not match password.
  const passwordMismatch = useMemo(() => {
    if (!confirmPassword) return false;
    return password !== confirmPassword;
  }, [password, confirmPassword]);

  // True when password is filled but shorter than the minimum length.
  const passwordTooShort = useMemo(() => {
    if (!password) return false;
    return password.length < MIN_PASSWORD_LENGTH;
  }, [password]);

  // Submit button is disabled until all fields pass client-side validation.
  const canSubmit = useMemo(() => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      password &&
      confirmPassword &&
      !passwordMismatch &&
      !passwordTooShort &&
      !isSubmitting
    );
  }, [firstName, lastName, email, password, confirmPassword, passwordMismatch, passwordTooShort, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (passwordMismatch) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordTooShort) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/api/v1/auth/register", {
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     email.trim(),
        password,
      });

      // Store token and redirect to dashboard on successful registration.
      login(res.data.token);
      navigate("/dashboard");

    } catch (err) {
      // Log full error context to the console for debugging.
      console.error("Signup request failed", {
        status: err?.response?.status,
        data:   err?.response?.data,
        url:    err?.config?.url,
        method: err?.config?.method,
      });

      // Map HTTP status codes to user-facing messages.
      let message = "Something went wrong during sign up. Please try again.";

      if (err?.response?.status === 409) {
        message = "This email is already in use. Please try a different email.";
      } else if (err?.response?.status === 400) {
        message = err?.response?.data?.message || "Please check your input and try again.";
      } else if (err?.response?.status === 401) {
        message = "Authentication failed. Please try again.";
      } else if (err?.response?.status === 403) {
        message = "Access was denied. Please try again or contact the team.";
      } else if (err?.response?.status === 404) {
        message = "Signup service was not found. Please check the backend configuration.";
      } else if (err?.response?.status >= 500) {
        message = "The server is having a problem right now. Please try again later.";
      } else if (err?.request && !err?.response) {
        message = "Could not reach the server. Please make sure the backend is running.";
      } else if (typeof err?.response?.data === "string") {
        message = err.response.data;
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
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
        <h2 className="auth-title">Sign Up</h2>
        <p className="auth-subtitle">
          Create your account to manage courses, tasks, grades, and reminders.
        </p>

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
                className={`auth-input auth-input--with-icon ${passwordMismatch || passwordTooShort ? "auth-input--error" : ""}`}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
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
            {passwordTooShort && (
              <div className="auth-hint auth-hint--error">
                Password must be at least {MIN_PASSWORD_LENGTH} characters.
              </div>
            )}
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
            {isSubmitting ? "Signing up…" : "Sign Up"}
          </button>

          <div className="auth-footer">
            Already have an account?{" "}
            {/* Use Link instead of <a> to avoid a full page reload. */}
            <Link to="/login" className="auth-link">Log in</Link>
          </div>

        </form>
      </div>
    </div>
  );
}