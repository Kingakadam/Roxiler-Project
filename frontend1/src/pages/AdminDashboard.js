import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [section, setSection] = useState("dashboard"); 
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  // Load dashboard stats
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.log("Error loading dashboard stats");
      }
      setIsLoading(false);
    }
    load();
  }, []);

  async function loadUsers() {
    setSection("users");
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log("Error loading users");
    }
  }

  async function loadStores() {
    setSection("stores");
    try {
      const res = await api.get("/admin/stores");
      setStores(res.data);
    } catch (err) {
      console.log("Error loading stores");
    }
  }

  const StatCard = ({ title, value, icon, color, gradient, index }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isLoading && value > 0) {
        let start = 0;
        const duration = 1200;
        const increment = value / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);

        return () => clearInterval(timer);
      }
    }, [isLoading, value]);

    return (
      <div
        style={{
          ...styles.card,
          background: hoveredCard === index ? gradient : "#fff",
          color: hoveredCard === index ? "#fff" : "#1a1a1a",
        }}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div
          style={{
            ...styles.icon,
            background: hoveredCard === index ? "rgba(255,255,255,0.2)" : `${color}20`,
            color: hoveredCard === index ? "#fff" : color,
          }}
        >
          <span style={styles.iconEmoji}>{icon}</span>
        </div>

        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={{ ...styles.cardValue, color: hoveredCard === index ? "#fff" : color }}>{count}</p>
      </div>
    );
  };

  if (isLoading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    );

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
        </div>

        {/* DASHBOARD VIEW */}
        {section === "dashboard" && (
          <>
            <div style={styles.cardContainer}>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="👥"
                color="#667eea"
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                index={0}
              />

              <StatCard
                title="Total Stores"
                value={stats.totalStores}
                icon="🏪"
                color="#f5576c"
                gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                index={1}
              />

              <StatCard
                title="Total Ratings"
                value={stats.totalRatings}
                icon="⭐"
                color="#10b981"
                gradient="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
                index={2}
              />
            </div>

            {/* Quick Actions */}
            <div style={styles.actionsSection}>
              <h2 style={styles.sectionTitle}>Quick Actions</h2>

              <div style={styles.actionsGrid}>
                <button style={styles.actionButton} onClick={loadUsers}>
                  👤 View Users
                </button>

                <button style={styles.actionButton} onClick={loadStores}>
                  🏬 View Stores
                </button>
              </div>
            </div>
          </>
        )}

        {/* USERS LIST */}
        {section === "users" && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              <h2 style={styles.sectionTitle}>All Users</h2>
              <button style={styles.backBtn} onClick={() => setSection("dashboard")}>
                ← Back
              </button>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>{u.id}</td>
                      <td style={styles.td}>{u.name}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: u.role === 'Admin' ? '#667eea' : u.role === 'Moderator' ? '#f5576c' : '#10b981'
                        }}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STORES LIST */}
        {section === "stores" && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              <h2 style={styles.sectionTitle}>All Stores</h2>
              <button style={styles.backBtn} onClick={() => setSection("dashboard")}>
                ← Back
              </button>
            </div>

            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Address</th>
                    <th style={styles.th}>Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((s) => (
                    <tr key={s.id} style={styles.tr}>
                      <td style={styles.td}>{s.id}</td>
                      <td style={styles.td}>{s.name}</td>
                      <td style={styles.td}>{s.address}</td>
                      <td style={styles.td}>
                        {s.averageRating ? (
                          <span style={styles.rating}>⭐ {s.averageRating}</span>
                        ) : (
                          <span style={styles.noRating}>No Ratings</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "50px",
  },
  title: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#fff",
    margin: "0",
    textShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid rgba(255,255,255,0.3)",
    borderTop: "6px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#fff",
    fontWeight: "600",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    marginBottom: "50px",
  },
  card: {
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  icon: {
    width: "70px",
    height: "70px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    transition: "all 0.4s ease",
  },
  iconEmoji: {
    fontSize: "36px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "10px",
    opacity: "0.9",
  },
  cardValue: {
    fontSize: "42px",
    fontWeight: "800",
    margin: "0",
    transition: "color 0.4s ease",
  },
  actionsSection: {
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  sectionTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "25px",
    margin: "0 0 25px 0",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  actionButton: {
    padding: "20px",
    fontSize: "18px",
    fontWeight: "600",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  tableWrapper: {
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },
  backBtn: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    border: "2px solid #667eea",
    borderRadius: "10px",
    background: "#fff",
    color: "#667eea",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
  },
  th: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: "16px",
    textAlign: "left",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: "13px",
    letterSpacing: "1px",
  },
  tr: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background 0.2s ease",
  },
  td: {
    padding: "16px",
    color: "#374151",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#fff",
    display: "inline-block",
  },
  rating: {
    color: "#f59e0b",
    fontWeight: "600",
  },
  noRating: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
};