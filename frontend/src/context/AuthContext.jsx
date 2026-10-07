import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if token exists and fetch profile
  useEffect(() => {
    const token = localStorage.getItem("cropcare_token");
    if (token) {
      API.get("/auth/profile")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem("cropcare_token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, role) => {
    const res = await API.post("/auth/login", { email, password, role });
    localStorage.setItem("cropcare_token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, location) => {
    const res = await API.post("/auth/register", { name, email, password, location });
    localStorage.setItem("cropcare_token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("cropcare_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
