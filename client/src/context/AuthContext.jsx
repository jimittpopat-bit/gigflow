import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { socket } from "../socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Toast state (same pattern as Login/Register/GigDetails)
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await apiRequest("/api/auth/me");
        setUser(data.user || data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // ✅ FIX: toast instead of alert
    socket.on("notification", (data) => {
      if (data?.message) showToast("success", data.message);
    });

    return () => socket.off("notification");
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (err) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}

      {/* ✅ Toast UI */}
      {toast.message && (
        <div
          className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-white text-sm ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
