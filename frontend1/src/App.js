import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import UserSignup from "./pages/UserSignup";
import OwnerSignup from "./pages/OwnerSignup";
import UserStores from "./pages/UserStores";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/owner/signup" element={<OwnerSignup />} />
        <Route path="/user/dashboard" element={<ProtectedRoute role="USER"><UserStores /></ProtectedRoute>} />
        <Route path="/owner/dashboard" element={<ProtectedRoute role="OWNER"><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/stores" element={<ProtectedRoute role="ADMIN"><AdminStores /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
