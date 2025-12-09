import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RoleSelection() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const roles = [
    {
      value: "user",
      label: "User",
      description: "Browse, review and rate stores",
      path: "/user/signup",
      icon: "👤"
    },
    {
      value: "owner",
      label: "Store Owner",
      description: "Create and manage your store",
      path: "/owner/signup",
      icon: "🏪"
    },
  ];

  const getCardStyle = (roleValue) => ({
    ...styles.card,
    ...(hoveredCard === roleValue ? styles.cardHover : {}),
  });

  const getButtonStyle = (roleValue) => ({
    ...styles.cardButton,
    ...(hoveredCard === roleValue ? styles.cardButtonHover : {}),
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose Your Role</h1>
      <p style={styles.subtitle}>Select how you want to use the platform</p>

      <div style={styles.cardContainer}>
        {roles.map((role) => (
          <div
            key={role.value}
            style={getCardStyle(role.value)}
            onMouseEnter={() => setHoveredCard(role.value)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => navigate(role.path)}
          >
            <div style={styles.iconWrapper}>{role.icon}</div>
            <h2 style={styles.cardTitle}>{role.label}</h2>
            <p style={styles.cardDescription}>{role.description}</p>
            <button
              style={getButtonStyle(role.value)}
              onClick={(e) => {
                e.stopPropagation();
                navigate(role.path);
              }}
            >
              Sign Up as {role.label}
            </button>
          </div>
        ))}
      </div>

      <p style={styles.loginText}>
        Already have an account?{" "}
        <span
          style={styles.loginLink}
          onClick={() => navigate("/login")}
        >
          Login here
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "900px",
    margin: "auto",
    marginTop: "60px",
    padding: "20px",
    textAlign: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  title: {
    fontSize: "36px",
    marginBottom: "12px",
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    fontSize: "17px",
    color: "#666",
    marginBottom: "50px",
    fontWeight: "400"
  },
  cardContainer: {
    display: "flex",
    gap: "30px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    width: "280px",
    padding: "40px 30px",
    border: "2px solid #e8e8e8",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },
  cardHover: {
    transform: "translateY(-8px)",
    borderColor: "#000",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.12)",
  },
  iconWrapper: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "24px",
    marginBottom: "12px",
    fontWeight: "700",
    color: "#1a1a1a"
  },
  cardDescription: {
    fontSize: "15px",
    color: "#666",
    marginBottom: "28px",
    lineHeight: "1.5"
  },
  cardButton: {
    padding: "14px 28px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    width: "100%",
    fontWeight: "600",
    transition: "all 0.2s ease",
    letterSpacing: "0.2px"
  },
  cardButtonHover: {
    background: "#333",
    transform: "scale(1.02)"
  },
  loginText: {
    marginTop: "50px",
    fontSize: "15px",
    color: "#666"
  },
  loginLink: {
    color: "#0066ff",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s ease",
  },
};