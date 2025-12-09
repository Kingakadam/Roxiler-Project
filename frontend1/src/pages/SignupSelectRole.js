import { useNavigate } from "react-router-dom";

export default function SignupSelectRole() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2>Select Your Role</h2>

      <div style={styles.boxContainer}>
        <button
          style={styles.box}
          onClick={() => navigate("/signup/admin")}
        >
          System Administrator
        </button>

        <button
          style={styles.box}
          onClick={() => navigate("/signup/owner")}
        >
          Store Owner
        </button>

        <button
          style={styles.box}
          onClick={() => navigate("/signup/user")}
        >
          Normal User
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { width: "400px", margin: "auto", marginTop: "40px", textAlign: "center" },
  boxContainer: { display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" },
  box: {
    padding: "15px",
    fontSize: "18px",
    background: "black",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
  },
};
