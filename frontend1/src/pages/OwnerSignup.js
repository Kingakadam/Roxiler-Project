import { useState } from "react";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function OwnerSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    storeName: "",
    storeAddress: "",
    storeEmail: "",
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    
    // Owner validation
    if (!form.name) e.name = "Owner name is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email.";
    if (!form.address) e.address = "Address is required.";
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password)) {
      e.password = "Password must be 8-16 chars, contain 1 uppercase & 1 special character";
    }

    // Store validation
    if (!form.storeName) e.storeName = "Store name is required.";
    if (!form.storeAddress) e.storeAddress = "Store address is required.";
    if (!/\S+@\S+\.\S+/.test(form.storeEmail)) e.storeEmail = "Invalid store email.";

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
      const res = await api.post("/auth/owner/signup", form);
      alert("Owner Signup Successful!");
      localStorage.setItem("token", res.data.token);
      navigate("/owner/dashboard");
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
          <div style={styles.iconBadge}>🏪</div>
          <h2 style={styles.title}>Store Owner Signup</h2>
          <p style={styles.subtitle}>Create your account and register your store</p>
        </div>

        <div style={styles.formContainer}>
          {/* Owner Information Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>👤 Owner Information</h3>
            
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                style={getInputStyle("name")}
              />
              {errors.name && <p style={styles.error}>{errors.name}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="your.email@example.com"
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
                rows="2"
              />
              {errors.address && <p style={styles.error}>{errors.address}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                style={getInputStyle("password")}
              />
              {errors.password && <p style={styles.error}>{errors.password}</p>}
            </div>
          </div>

          {/* Store Information Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🏬 Store Information</h3>
            
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Store Name</label>
              <input
                name="storeName"
                placeholder="Enter your store name"
                value={form.storeName}
                onChange={handleChange}
                onFocus={() => setFocusedField("storeName")}
                onBlur={() => setFocusedField(null)}
                style={getInputStyle("storeName")}
              />
              {errors.storeName && <p style={styles.error}>{errors.storeName}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Store Address</label>
              <input
                name="storeAddress"
                placeholder="Enter store location"
                value={form.storeAddress}
                onChange={handleChange}
                onFocus={() => setFocusedField("storeAddress")}
                onBlur={() => setFocusedField(null)}
                style={getInputStyle("storeAddress")}
              />
              {errors.storeAddress && <p style={styles.error}>{errors.storeAddress}</p>}
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Store Email</label>
              <input
                name="storeEmail"
                type="email"
                placeholder="store@example.com"
                value={form.storeEmail}
                onChange={handleChange}
                onFocus={() => setFocusedField("storeEmail")}
                onBlur={() => setFocusedField(null)}
                style={getInputStyle("storeEmail")}
              />
              {errors.storeEmail && <p style={styles.error}>{errors.storeEmail}</p>}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              ...styles.button,
              ...(isSubmitting ? styles.buttonDisabled : {}),
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Your Account..." : "Create Store Account"}
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
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    background: "#fff",
    borderRadius: "24px",
    padding: "48px",
    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.25)",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  iconBadge: {
    fontSize: "56px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    fontWeight: "400",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "24px",
    background: "#f8f9fa",
    borderRadius: "16px",
    border: "2px solid #e9ecef",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
    backgroundColor: "#fff",
  },
  inputFocus: {
    borderColor: "#f5576c",
    backgroundColor: "#fff",
    boxShadow: "0 0 0 3px rgba(245, 87, 108, 0.1)",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  textarea: {
    resize: "vertical",
    minHeight: "60px",
    lineHeight: "1.5",
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    margin: "0",
    fontWeight: "500",
  },
  button: {
    padding: "16px 32px",
    fontSize: "17px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "8px",
    boxShadow: "0 8px 24px rgba(245, 87, 108, 0.4)",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  loginText: {
    textAlign: "center",
    marginTop: "32px",
    fontSize: "15px",
    color: "#666",
  },
  loginLink: {
    color: "#f5576c",
    cursor: "pointer",
    fontWeight: "600",
    transition: "color 0.2s ease",
  },
};