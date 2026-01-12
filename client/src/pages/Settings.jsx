import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-3xl border border-white/10 bg-dark-card/70 backdrop-blur-heavy p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <h2 className="text-3xl font-bold text-white">Settings</h2>

        <p className="mt-2 text-white/60">
          Logged in as: <span className="font-semibold text-white">{user?.email}</span>
        </p>

        <div className="mt-8">
          <button
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-white transition hover:opacity-95 active:scale-[0.98]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
