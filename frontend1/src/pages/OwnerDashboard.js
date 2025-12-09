import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 1) Fetch Store Info
        const storeRes = await api.get("/owner/store");
        setStore(storeRes.data);

        // 2) Fetch Store Ratings
        const ratingRes = await api.get("/owner/store/ratings");
        setRatings(ratingRes.data);

      } catch (err) {
        console.log("Error loading owner dashboard", err);
      }
      setIsLoading(false);
    }

    load();
  }, []);

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "#10b981";
    if (rating >= 3.5) return "#f59e0b";
    return "#ef4444";
  };

  const getStarRating = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = "⭐".repeat(full);
    if (half) stars += "✨";
    return stars;
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your dashboard...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Store not found or not assigned to your account.</p>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Store Owner Dashboard</h1>
            <p style={styles.subtitle}>Manage your store and view customer feedback</p>
          </div>
          <div style={styles.badge}>🏪</div>
        </div>

        {/* Store Info */}
        <div style={styles.storeCard}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Your Store</h2>
            <div style={styles.statusBadge}>Active</div>
          </div>

          <div style={styles.storeGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Store Name</span>
              <span style={styles.infoValue}>{store.name}</span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Address</span>
              <span style={styles.infoValue}>{store.address}</span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>{store.email}</span>
            </div>
          </div>

          {/* Average Rating */}
          <div style={styles.ratingContainer}>
            <div style={styles.ratingBox}>
              <span style={styles.ratingLabel}>Average Rating</span>
              <div style={styles.ratingDisplay}>
                <span
                  style={{
                    ...styles.ratingNumber,
                    color: getRatingColor(store.averageRating || 0),
                  }}
                >
                  {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
                </span>
                <span style={styles.ratingStars}>
                  {store.averageRating ? getStarRating(store.averageRating) : "No ratings yet"}
                </span>
              </div>
              <span style={styles.ratingCount}>{ratings.length} total ratings</span>
            </div>
          </div>
        </div>

        {/* Ratings Table */}
        <div style={styles.ratingsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Customer Ratings</h2>
            <span style={styles.ratingsBadge}>{ratings.length} reviews</span>
          </div>

          {ratings.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>📊</span>
              <p style={styles.emptyText}>No ratings yet</p>
              <p style={styles.emptySubtext}>Customer reviews will appear here</p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Customer</th>
                    <th style={styles.tableHeader}>Email</th>
                    <th style={styles.tableHeader}>Rating</th>
                    <th style={styles.tableHeader}>Comment</th>
                  </tr>
                </thead>

                <tbody>
                  {ratings.map((r, index) => (
                    <tr
                      key={r.id}
                      style={{
                        ...styles.tableRow,
                        animation: `fadeIn 0.3s ease ${index * 0.1}s both`,
                      }}
                    >
                      <td style={styles.tableCell}>
                        <div style={styles.userCell}>
                          <div style={styles.avatar}>
                            {r.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={styles.userName}>{r.user?.name}</span>
                        </div>
                      </td>

                      <td style={styles.tableCell}>{r.user?.email}</td>

                      <td style={styles.tableCell}>
                        <div style={styles.ratingBadge}>
                          <span style={styles.ratingValue}>{r.value}</span>
                          <span style={styles.ratingStar}>⭐</span>
                        </div>
                      </td>

                      <td style={styles.tableCell}>{r.comment || "No comment"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
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
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  errorText: {
    fontSize: "18px",
    color: "#fff",
    background: "rgba(239, 68, 68, 0.9)",
    padding: "20px 30px",
    borderRadius: "12px",
    fontWeight: "600",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    flexWrap: "wrap",
    gap: "20px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    margin: "0",
    fontWeight: "500",
  },
  badge: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
  },
  storeCard: {
    background: "#fff",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    marginBottom: "30px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e5e7eb",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0",
  },
  statusBadge: {
    padding: "8px 20px",
    background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    color: "#fff",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    boxShadow: "0 4px 10px rgba(132, 250, 176, 0.3)",
  },
  storeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginBottom: "30px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  infoLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
  },
  ratingContainer: {
    marginTop: "30px",
    paddingTop: "30px",
    borderTop: "2px solid #e5e7eb",
  },
  ratingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    padding: "30px",
    borderRadius: "16px",
  },
  ratingLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  ratingDisplay: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  ratingNumber: {
    fontSize: "48px",
    fontWeight: "800",
    lineHeight: "1",
  },
  ratingStars: {
    fontSize: "24px",
  },
  ratingCount: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },
  ratingsSection: {
    background: "#fff",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0",
  },
  ratingsBadge: {
    padding: "8px 16px",
    background: "#667eea",
    color: "#fff",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "20px",
    opacity: "0.5",
  },
  emptyText: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  },
  emptySubtext: {
    fontSize: "15px",
    color: "#6b7280",
    margin: "0",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  tableHeader: {
    padding: "16px",
    textAlign: "left",
    color: "#fff",
    fontWeight: "700",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background 0.2s ease",
  },
  tableCell: {
    padding: "16px",
    color: "#374151",
    fontSize: "14px",
  },
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
  },
  userName: {
    fontWeight: "600",
    color: "#1a1a1a",
  },
  ratingBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#fef3c7",
    padding: "6px 12px",
    borderRadius: "20px",
  },
  ratingValue: {
    fontWeight: "700",
    color: "#f59e0b",
    fontSize: "15px",
  },
  ratingStar: {
    fontSize: "16px",
  },
};