import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/ui/SectionHeader";
import Button from "../components/ui/Button";
import { useAuth } from "../auth/AuthContext";
import { profileService } from "../features/profile/services/profile.service";
import styles from "./ProfilePage.module.css";

function getInitials(firstName = "", lastName = "", email = "") {
  const f = firstName.trim().charAt(0).toUpperCase();
  const l = lastName.trim().charAt(0).toUpperCase();

  if (f && l) return `${f}${l}`;
  if (f) return f;
  if (email) return email.trim().charAt(0).toUpperCase();
  return "?";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [savedProfile, setSavedProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const fallback = {
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
      };

      const stored = await profileService.getProfile();
      const next = stored
        ? {
            firstName: stored.firstName ?? fallback.firstName,
            lastName: stored.lastName ?? fallback.lastName,
            email: stored.email ?? fallback.email,
          }
        : fallback;

      setForm(next);
      setSavedProfile(next);
      updateProfile(next);
    }

    loadProfile();
  }, [updateProfile, user?.email, user?.firstName, user?.lastName]);

  useEffect(() => {
    if (!saveSuccess) return;

    const timer = window.setTimeout(() => {
      setSaveSuccess("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [saveSuccess]);

  const initials = useMemo(
    () => getInitials(form.firstName, form.lastName, form.email),
    [form.firstName, form.lastName, form.email]
  );

  function handleChange(field) {
    return (e) => {
      const value = e.target.value;

      setForm((prev) => ({ ...prev, [field]: value }));
      setSaveError("");
      setSaveSuccess("");
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };
  }

  function validate() {
    const nextErrors = {};

    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleEditToggle() {
    setIsEditing(true);
    setSaveError("");
    setSaveSuccess("");
  }

  function handleCancel() {
    setForm(savedProfile);
    setErrors({});
    setSaveError("");
    setSaveSuccess("");
    setIsEditing(false);
  }

  async function handleSave(e) {
    e.preventDefault();

    setSaveError("");
    setSaveSuccess("");

    if (!validate()) return;

    setIsSaving(true);

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
      };

      const saved = await profileService.updateProfile(payload);

      setSavedProfile(saved);
      setForm(saved);
      updateProfile(saved);
      setIsEditing(false);
      setSaveSuccess("Profile updated successfully.");
    } catch {
      setSaveError("Could not save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Profile"
        breadcrumbs={[
          { label: "Home", to: "/dashboard/courses" },
          { label: "Profile" },
        ]}
      />

      <form className={styles.layout} onSubmit={handleSave}>
        <section className={styles.heroCard}>
          <div className={styles.initialsBadge}>{initials}</div>

          <div className={styles.heroText}>
            <h2 className={styles.name}>
              {[form.firstName, form.lastName].filter(Boolean).join(" ") || "ClassMate User"}
            </h2>
            <p className={styles.email}>{form.email || "No email available"}</p>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Account Details</h3>

            {!isEditing ? (
              <Button type="button" variant="secondary" onClick={handleEditToggle}>
                Edit
              </Button>
            ) : (
              <div className={styles.panelActions}>
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>

          {saveSuccess ? <div className={styles.successMessage}>{saveSuccess}</div> : null}
          {saveError ? <div className={styles.errorMessage}>{saveError}</div> : null}

          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="profile-first-name">
                First Name
              </label>
              <input
                id="profile-first-name"
                className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
                type="text"
                value={form.firstName}
                onChange={handleChange("firstName")}
                disabled={!isEditing}
              />
              {errors.firstName ? <div className={styles.fieldError}>{errors.firstName}</div> : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="profile-last-name">
                Last Name
              </label>
              <input
                id="profile-last-name"
                className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
                type="text"
                value={form.lastName}
                onChange={handleChange("lastName")}
                disabled={!isEditing}
              />
              {errors.lastName ? <div className={styles.fieldError}>{errors.lastName}</div> : null}
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                disabled={!isEditing}
              />
              {errors.email ? <div className={styles.fieldError}>{errors.email}</div> : null}
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}