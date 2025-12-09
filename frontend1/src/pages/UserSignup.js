import { useState } from "react";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function UserSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Name is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email.";
    if (!form.address) e.address = "Address required.";
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password)) {
      e.password = "Password must be 8-16 chars, contain 1 uppercase & 1 special character";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.post("/auth/signup", { ...form, role: "USER" });
      alert("User Signup Successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getInputStyle = (fieldName) => ({
    ...styles.input,
    ...(focusedField === fieldName ? styles.inputFocus : {}),
    ...(errors[fieldName] ? styles.inputError : {}),
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>User Signup</h2>
          <p style={styles.subtitle}>Create your account to get started</p>
        </div>

        <div style={styles.formContainer}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle("name")}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle("email")}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Address</label>
            <textarea
              name="address"
              placeholder="Enter your address"
              value={form.address}
              onChange={handleChange}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
              style={{ ...getInputStyle("address"), ...styles.textarea }}
              rows="3"
            />
            {errors.address && <p style={styles.error}>{errors.address}</p>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle("password")}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <button
            onClick={handleSubmit}
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.buttonDisabled : {}),
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </div>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <span style={styles.loginLink} onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#fff",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#666",
    fontWeight: "400",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "2px",
  },
  input: {
    padding: "12px 16px",
    fontSize: "15px",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    backgroundColor: "#fafafa",
  },
  inputFocus: {
    borderColor: "#667eea",
    backgroundColor: "#fff",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  textarea: {
    resize: "vertical",
    minHeight: "80px",
    lineHeight: "1.5",
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    margin: "0",
    fontWeight: "500",
  },
  button: {
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "8px",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  loginText: {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "14px",
    color: "#666",
  },
  loginLink: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "600",
    transition: "color 0.2s ease",
  },
};