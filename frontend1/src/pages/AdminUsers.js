import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, sortField, sortOrder]);

  async function loadUsers() {
    try {
      const res = await api.get(
        `/admin/users?search=${search}&role=${roleFilter}&sortBy=${sortField}&order=${sortOrder}`
      );
      setUsers(res.data);
    } catch (err) {
      console.log("Failed to load users");
    }
  }

  function handleSort(field) {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  }

  return (
    <div style={styles.container}>
      <h2>All Users</h2>

      <div style={styles.filters}>
        <input
          placeholder="Search by name/email/address..."
          style={styles.input}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.input}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="OWNER">Store Owner</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("email")}>Email</th>
            <th>Address</th>
            <th onClick={() => handleSort("role")}>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { width: "85%", margin: "20px auto" },
  filters: { display: "flex", gap: "20px", marginBottom: "20px" },
  input: { padding: "8px", border: "1px solid #ccc", borderRadius: "5px" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
};