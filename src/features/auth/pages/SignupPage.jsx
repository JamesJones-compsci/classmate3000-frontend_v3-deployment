import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { authService } from "../services/auth.service";

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

const MIN_PASSWORD_LENGTH = 6;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getPasswordStrength(password) {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) || /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  return Math.min(score, 3);
}

export default function SignupPage() {
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

  const passwordTooShort = useMemo(() => {
    if (!password) return false;
    return password.length < MIN_PASSWORD_LENGTH;
  }, [password]);

  const emailValid = useMemo(() => {
    if (!email.trim()) return false;
    return isValidEmail(email);
  }, [email]);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const canSubmit = useMemo(() => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      emailValid &&
      password &&
      confirmPassword &&
      !passwordMismatch &&
      !passwordTooShort &&
      !isSubmitting
    );
  }, [
    firstName,
    lastName,
    email,
    emailValid,
    password,
    confirmPassword,
    passwordMismatch,
    passwordTooShort,
    isSubmitting,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (passwordMismatch) return setError("Passwords do not match.");
    if (passwordTooShort) {
      return setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    }

    setIsSubmitting(true);

    try {
      const data = await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });

      login(data.token, data.firstName, data.lastName, data.email);
      navigate("/dashboard");
    } catch (err) {
      let message = "Something went wrong. Please try again.";

      if (err?.response?.status === 409) {
        message = "This email is already in use.";
      } else if (err?.response?.status === 400) {
        message = err?.response?.data?.message || "Please check your input and try again.";
      } else if (err?.response?.status >= 500) {
        message = "The server is having a problem. Please try again later.";
      } else if (err?.request && !err?.response) {
        message = "Could not reach the server. Please make sure the backend is running.";
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const strengthClass =
    passwordStrength === 1
      ? "auth-strengthBar--activeWeak"
      : passwordStrength === 2
      ? "auth-strengthBar--activeMedium"
      : "auth-strengthBar--activeStrong";

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
            <label className="auth-label" htmlFor="firstName">
              First Name
            </label>
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
            <label className="auth-label" htmlFor="lastName">
              Last Name
            </label>
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
            <div className="auth-labelRow">
              <label className="auth-label" htmlFor="email">
                Email
              </label>
              {emailValid ? <span className="auth-statusOk">Valid</span> : null}
            </div>

            <input
              id="email"
              className={`auth-input ${
                email.trim() ? (emailValid ? "auth-input--success" : "auth-input--error") : ""
              }`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            {email.trim() && !emailValid ? (
              <div className="auth-hint auth-hint--error">
                Please enter a valid email address.
              </div>
            ) : null}
          </div>

          <div className="auth-row">
            <label className="auth-label" htmlFor="password">
              Password
            </label>

            <div className="auth-inputWrapIcon">
              <input
                id="password"
                className={`auth-input auth-input--with-icon ${
                  passwordMismatch || passwordTooShort ? "auth-input--error" : ""
                }`}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-iconBtn"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            <div className="auth-strength">
              <span
                className={`auth-strengthBar ${
                  passwordStrength >= 1 ? strengthClass : ""
                }`}
              />
              <span
                className={`auth-strengthBar ${
                  passwordStrength >= 2 ? strengthClass : ""
                }`}
              />
              <span
                className={`auth-strengthBar ${
                  passwordStrength >= 3 ? strengthClass : ""
                }`}
              />
            </div>

            {passwordTooShort ? (
              <div className="auth-hint auth-hint--error">
                Password must be at least {MIN_PASSWORD_LENGTH} characters.
              </div>
            ) : password ? (
              <div className="auth-hint auth-hint--success">
                {passwordStrength === 1
                  ? "Weak password"
                  : passwordStrength === 2
                  ? "Medium password"
                  : "Strong password"}
              </div>
            ) : null}
          </div>

          <div className="auth-row">
            <label className="auth-label" htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="auth-inputWrapIcon">
              <input
                id="confirmPassword"
                className={`auth-input auth-input--with-icon ${
                  passwordMismatch
                    ? "auth-input--error"
                    : confirmPassword && !passwordMismatch
                    ? "auth-input--success"
                    : ""
                }`}
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-iconBtn"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {passwordMismatch ? (
              <div className="auth-hint auth-hint--error">Passwords do not match.</div>
            ) : confirmPassword ? (
              <div className="auth-hint auth-hint--success">Passwords match.</div>
            ) : null}
          </div>

          <button className="auth-button" type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Signing up…" : "Sign Up"}
          </button>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}