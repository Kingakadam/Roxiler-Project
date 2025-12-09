import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide navbar if user is not logged in
  if (!auth || !auth.token) {
    return null;
  }

  const getLinkStyle = (name) => ({
    ...styles.link,
    ...(hoveredLink === name ? styles.linkHover : {}),
  });

  const MenuLink = ({ to, name, children }) => (
    <a
      href={to}
      style={getLinkStyle(name)}
      onMouseEnter={() => setHoveredLink(name)}
      onMouseLeave={() => setHoveredLink(null)}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = to;
      }}
    >
      {children}
    </a>
  );

  function handleLogout() {
    logout();                    // Clear context + localStorage
    window.location.href = "/login"; // Redirect to login page
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>⭐</div>
          <h3 style={styles.logo}>Store Rating App</h3>
        </div>

        {/* Mobile Menu Button */}
        <button
          style={styles.mobileToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {/* Links */}
        <div
          style={{
            ...styles.linksDesktop,
            ...(isMenuOpen ? styles.linksMobile : {}),
          }}
        >
          {/* ADMIN */}
          {auth.role === "ADMIN" && (
            <>
              <MenuLink to="/admin/dashboard" name="admin-dashboard">
                📊 Dashboard
              </MenuLink>
              <MenuLink to="/admin/users" name="admin-users">
                👥 Users
              </MenuLink>
              <MenuLink to="/admin/stores" name="admin-stores">
                🏪 Stores
              </MenuLink>
            </>
          )}

 

          {/* Logout */}
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    padding: "0",
    position: "sticky",
    top: "0",
    zIndex: "1000",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 30px",
    position: "relative",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    fontSize: "32px",
    background: "rgba(255, 255, 255, 0.2)",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
  },
  logo: {
    color: "#fff",
    fontSize: "22px",
    fontWeight: "800",
    margin: "0",
    letterSpacing: "0.5px",
  },
  mobileToggle: {
    display: "none",
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    color: "#fff",
    fontSize: "28px",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },
  linksDesktop: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  linksMobile: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    gap: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    whiteSpace: "nowrap",
  },
  linkHover: {
    background: "rgba(255, 255, 255, 0.2)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  logoutBtn: {
    background: "rgba(239, 68, 68, 0.9)",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    marginLeft: "12px",
    whiteSpace: "nowrap",
  },
};