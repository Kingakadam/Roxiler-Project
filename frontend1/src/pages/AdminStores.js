import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    loadStores();
  }, [search, sortField, sortOrder]);

  async function loadStores() {
    try {
      const res = await api.get(
        `/admin/stores?search=${search}&sortBy=${sortField}&order=${sortOrder}`
      );
      setStores(res.data);
    } catch (err) {
      console.log("Failed to load stores");
    }
  }

  function handleSort(field) {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  }

  return (
    <div style={styles.container}>
      <h2>Stores List</h2>

      <input
        placeholder="Search by name or address..."
        style={styles.input}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Store Name</th>
            <th>Email</th>
            <th onClick={() => handleSort("address")}>Address</th>
            <th onClick={() => handleSort("averageRating")}>Rating</th>
          </tr>
        </thead>

        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.averageRating || "No Ratings"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { width: "85%", margin: "20px auto" },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};