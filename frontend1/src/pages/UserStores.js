import { useEffect, useState } from "react";

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedRating, setSelectedRating] = useState({});

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        // Simulating API call - replace with: await api.get(`/user/stores?search=${search}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockStores = [
          { id: 1, name: "The Coffee Corner", address: "123 Main St, Downtown", averageRating: 4.5, userRating: 5 },
          { id: 2, name: "BookWorm Paradise", address: "456 Oak Ave, Uptown", averageRating: 4.2, userRating: null },
          { id: 3, name: "Fresh Mart Grocery", address: "789 Pine Rd, Suburb", averageRating: 3.8, userRating: 4 },
          { id: 4, name: "Tech Haven", address: "321 Elm St, Tech District", averageRating: 4.7, userRating: null },
          { id: 5, name: "Cozy Bakery", address: "654 Maple Dr, Old Town", averageRating: 4.9, userRating: 5 },
        ];
        
        const filtered = search 
          ? mockStores.filter(s => 
              s.name.toLowerCase().includes(search.toLowerCase()) || 
              s.address.toLowerCase().includes(search.toLowerCase())
            )
          : mockStores;
          
        setStores(filtered);
        setIsLoading(false);
      } catch (err) {
        console.log("Error fetching stores");
        setIsLoading(false);
      }
    }
    load();
  }, [search, refresh]);

  async function submitRating(storeId, value) {
    if (!value) return;
    try {
      // await api.post(`/stores/${storeId}/rating`, { value });
      await new Promise(resolve => setTimeout(resolve, 500));
      alert("Rating submitted successfully! 🎉");
      setRefresh(!refresh);
    } catch (err) {
      alert("Error submitting rating");
    }
  }

  async function updateRating(storeId, value) {
    if (!value) return;
    try {
      // await api.put(`/stores/${storeId}/rating`, { value });
      await new Promise(resolve => setTimeout(resolve, 500));
      alert("Rating updated successfully! ✨");
      setRefresh(!refresh);
    } catch (err) {
      alert("Error updating rating");
    }
  }

  const getRatingColor = (rating) => {
    if (!rating) return "#94a3b8";
    if (rating >= 4.5) return "#10b981";
    if (rating >= 3.5) return "#f59e0b";
    return "#ef4444";
  };

  const getStars = (rating) => {
    if (!rating) return "No ratings yet";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return "⭐".repeat(fullStars) + (hasHalfStar ? "✨" : "");
  };

  const StarRating = ({ storeId, currentRating, hasRated }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const displayRating = hoverRating || selectedRating[storeId] || currentRating || 0;

    return (
      <div style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              ...styles.star,
              color: star <= displayRating ? "#fbbf24" : "#d1d5db",
              transform: star <= displayRating ? "scale(1.1)" : "scale(1)",
            }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => {
              setSelectedRating({ ...selectedRating, [storeId]: star });
              hasRated ? updateRating(storeId, star) : submitRating(storeId, star);
            }}
          >
            {star <= displayRating ? "⭐" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading stores...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Discover Stores</h1>
            <p style={styles.subtitle}>Browse and rate your favorite stores</p>
          </div>
          <div style={styles.headerBadge}>
            <span style={styles.badgeText}>{stores.length} Stores</span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            placeholder="Search stores by name or address..."
            style={styles.searchInput}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          {search && (
            <span 
              style={styles.clearButton}
              onClick={() => setSearch("")}
            >
              ✕
            </span>
          )}
        </div>

        {/* Stores Table */}
        {stores.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🏪</span>
            <p style={styles.emptyText}>No stores found</p>
            <p style={styles.emptySubtext}>Try adjusting your search</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Store Name</th>
                    <th style={styles.tableHeader}>Location</th>
                    <th style={styles.tableHeader}>Average Rating</th>
                    <th style={styles.tableHeader}>Your Rating</th>
                    <th style={styles.tableHeader}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store, index) => (
                    <tr
                      key={store.id}
                      style={{
                        ...styles.tableRow,
                        backgroundColor: hoveredRow === store.id ? "#f8f9fa" : "#fff",
                        animation: `fadeInUp 0.3s ease ${index * 0.05}s both`,
                      }}
                      onMouseEnter={() => setHoveredRow(store.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.tableCell}>
                        <div style={styles.storeNameCell}>
                          <div style={styles.storeIcon}>🏪</div>
                          <span style={styles.storeName}>{store.name}</span>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.addressCell}>
                          <span style={styles.addressIcon}>📍</span>
                          <span style={styles.addressText}>{store.address}</span>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.ratingCell}>
                          <span
                            style={{
                              ...styles.avgRating,
                              color: getRatingColor(store.averageRating),
                            }}
                          >
                            {store.averageRating || "—"}
                          </span>
                          <span style={styles.stars}>
                            {getStars(store.averageRating)}
                          </span>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <StarRating
                          storeId={store.id}
                          currentRating={store.userRating}
                          hasRated={!!store.userRating}
                        />
                      </td>
                      <td style={styles.tableCell}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            background: store.userRating ? "#d1fae5" : "#fef3c7",
                            color: store.userRating ? "#065f46" : "#92400e",
                          }}
                        >
                          {store.userRating ? "✓ Rated" : "Rate Now"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderTop: "4px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "16px",
    color: "#fff",
    fontWeight: "500",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "42px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "8px",
    letterSpacing: "-1px",
  },
  subtitle: {
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "400",
  },
  headerBadge: {
    padding: "12px 24px",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    borderRadius: "50px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
  },
  searchContainer: {
    position: "relative",
    marginBottom: "32px",
  },
  searchIcon: {
    position: "absolute",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "20px",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "18px 60px 18px 56px",
    fontSize: "16px",
    border: "none",
    borderRadius: "16px",
    outline: "none",
    fontFamily: "inherit",
    background: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  },
  clearButton: {
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "20px",
    color: "#6c757d",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "50%",
    transition: "all 0.2s ease",
  },
  emptyState: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "24px",
    padding: "80px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "80px",
    marginBottom: "16px",
    display: "block",
  },
  emptyText: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  emptySubtext: {
    fontSize: "16px",
    color: "#6c757d",
  },
  tableWrapper: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
  },
  tableHeaderRow: {
    background: "#f8f9fa",
  },
  tableHeader: {
    padding: "20px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
    color: "#495057",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "2px solid #dee2e6",
    whiteSpace: "nowrap",
  },
  tableRow: {
    transition: "all 0.2s ease",
    cursor: "pointer",
    borderBottom: "1px solid #f1f3f5",
  },
  tableCell: {
    padding: "24px 20px",
    fontSize: "15px",
    color: "#495057",
  },
  storeNameCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  storeIcon: {
    fontSize: "28px",
  },
  storeName: {
    fontWeight: "600",
    color: "#212529",
    fontSize: "16px",
  },
  addressCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  addressIcon: {
    fontSize: "16px",
  },
  addressText: {
    color: "#6c757d",
    fontSize: "14px",
  },
  ratingCell: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  avgRating: {
    fontSize: "24px",
    fontWeight: "700",
  },
  stars: {
    fontSize: "14px",
  },
  starContainer: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
  star: {
    fontSize: "24px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    userSelect: "none",
  },
  statusBadge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
};