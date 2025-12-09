import { useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("Email & Password are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      login(res.data.token, res.data.role, res.data.userId);

      if (res.data.role === "ADMIN") navigate("/admin/dashboard");
      else if (res.data.role === "USER") navigate("/user/dashboard");
      else if (res.data.role === "OWNER") navigate("/owner/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getInputStyle = (fieldName) => ({
    ...styles.input,
    ...(focusedField === fieldName ? styles.inputFocus : {}),
    ...(error ? styles.inputError : {}),
  });

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.card}>

          {/* ---------- Logo Section ---------- */}
          <div style={styles.logoSection}>
            <div style={styles.logoCircle}>
              <span style={styles.logoIcon}>🔐</span>
            </div>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to continue to your account</p>
          </div>

          {/* ---------- Login Form ---------- */}
          <div style={styles.formContainer}>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>📧</span>
                <input
                  type="email"
                  style={getInputStyle("email")}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  value={email}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  style={getInputStyle("password")}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  value={password}
                />
                <span
                  style={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div style={styles.errorContainer}>
                <span style={styles.errorIcon}>⚠️</span>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}

            <div style={styles.forgotPassword}>
              <span style={styles.forgotLink}>Forgot password?</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.buttonDisabled : {}),
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div style={styles.buttonContent}>
                  <div style={styles.buttonSpinner}></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Sign Up Redirect */}
          <p style={styles.signupText}>
            Don't have an account?{" "}
            <span
              style={styles.signupLink}
              onClick={() => navigate("/role-selection")}
            >
              Create one now
            </span>
          </p>
        </div>

        {/* No JSX comment here - FIXED */}
        {/* (Removed buggy JSX comment that caused the build error) */}
      </div>
    </div>
  );
}

/* ---------------------------------------
   Inline Styles (unchanged)
---------------------------------------- */

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  logoSection: {
    marginBottom: "25px",
  },
  logoCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "rgba(102,126,234,0.2)",
    margin: "0 auto 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: { fontSize: "35px" },
  title: { fontSize: "26px", fontWeight: "700" },
  subtitle: { fontSize: "15px", color: "#666", marginTop: "5px" },

  formContainer: { marginTop: "20px" },
  fieldGroup: { marginBottom: "20px", textAlign: "left" },
  label: { fontWeight: "600", marginBottom: "6px", display: "block" },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "15px",
    fontSize: "18px",
    opacity: 0.7,
  },
  input: {
    width: "100%",
    padding: "14px 16px 14px 45px",
    borderRadius: "12px",
    border: "2px solid #ddd",
    outline: "none",
    fontSize: "15px",
    transition: "0.2s",
  },
  inputFocus: {
    borderColor: "#667eea",
    boxShadow: "0 0 6px rgba(102,126,234,0.3)",
  },
  inputError: {
    borderColor: "#ef4444",
  },

  togglePassword: {
    position: "absolute",
    right: "12px",
    cursor: "pointer",
    fontSize: "18px",
    opacity: 0.7,
  },

  errorContainer: {
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  errorIcon: { fontSize: "18px" },
  errorText: { color: "#b91c1c", margin: 0, fontWeight: "600" },

  forgotPassword: { textAlign: "right", marginBottom: "15px" },
  forgotLink: { cursor: "pointer", color: "#667eea", fontSize: "14px" },

  button: {
    width: "100%",
    background: "#667eea",
    color: "#fff",
    padding: "14px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    transition: "0.3s",
  },
  buttonDisabled: { opacity: 0.6, cursor: "not-allowed" },

  buttonContent: { display: "flex", gap: "10px", justifyContent: "center" },
  buttonSpinner: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "3px solid #fff",
    borderTopColor: "transparent",
    animation: "spin 1s linear infinite",
  },

  signupText: { marginTop: "20px", color: "#555" },
  signupLink: { color: "#667eea", fontWeight: "700", cursor: "pointer" },
};

