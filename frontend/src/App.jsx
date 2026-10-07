import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CropRecommendation from "./pages/CropRecommendation";
import DiseaseDetection from "./pages/DiseaseDetection";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

// Admin route wrapper
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><div className="spinner"></div></div>;
  if (!user || user.role !== "Admin") return <Navigate to="/dashboard" />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crop-recommendation" element={
            <ProtectedRoute><CropRecommendation /></ProtectedRoute>
          } />
          <Route path="/disease-detection" element={
            <ProtectedRoute><DiseaseDetection /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute><Admin /></AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#1a2e1a",
              border: "1px solid #dce6dc",
              borderRadius: "10px",
              fontSize: "0.88rem",
              boxShadow: "0 4px 16px rgba(20, 60, 35, 0.08)",
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
