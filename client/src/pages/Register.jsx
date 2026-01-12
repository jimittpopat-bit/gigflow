import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      console.log("REGISTER SUCCESS:", data);

      showToast("success", "Account created. Please login now.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      console.log(err.message);
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      {/* ✅ Toast */}
      {toast.message && (
        <div className="fixed top-6 right-6 z-[999]">
          <div
            className={`rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-heavy min-w-[260px]
              ${
                toast.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                  : "bg-red-500/10 border-red-500/30 text-red-200"
              }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none">
                {toast.type === "success" ? "✅" : "⚠️"}
              </span>

              <p className="text-sm font-medium">{toast.message}</p>

              <button
                onClick={() => setToast({ type: "", message: "" })}
                className="ml-auto text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:flex flex-col justify-center items-center px-14 py-14 bg-black relative overflow-hidden text-center">
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary shadow-primary shadow-primary-lg flex items-center justify-center overflow-visible logo-shine">
              <svg viewBox="0 0 100 100" className="w-10 h-10">
                <text
                  x="50"
                  y="75"
                  fontSize="70"
                  fontWeight="900"
                  textAnchor="middle"
                  fill="white"
                >
                  G
                </text>
              </svg>
            </div>

            <h1 className="text-6xl font-extrabold bg-gradient-text bg-clip-text text-transparent tracking-tight inline-block leading-tight pb-1">
              GigFlow
            </h1>
          </div>

          <p className="text-white/60 text-lg">
            Create your account and start posting / applying to gigs.
          </p>
        </div>
      </div>

      {/* ✅ Right panel - WITH GRADIENT BACKGROUND */}
      <div className="flex items-center justify-center px-5 py-10 md:px-10 bg-black relative overflow-hidden">
        {/* ✅ Static gradient background - NO ANIMATION */}
        <div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none blur-[60px]"
          style={{
            background: `radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.20) 0%, transparent 35%), radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.18) 0%, transparent 35%), radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 40%)`,
          }}
        />

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-dark-card p-7 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          {/* Mobile brand */}
          <div className="md:hidden flex items-center gap-3 mb-6">
            <div>
              <span className="text-2xl font-black text-white">G</span>
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-text bg-clip-text text-transparent">
              GigFlow
            </h1>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Register</h2>
          <p className="text-white/60 mb-6">Create your account</p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-dark-darker/60 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-dark-darker/60 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-dark-darker/60 px-4 py-3 pr-20 text-white placeholder:text-white/40 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-semibold text-white/70 transition hover:text-white hover:bg-white/10"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-dark-darker/60 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-white transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-sm text-white/60 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
