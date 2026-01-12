// ==================== Gigs.jsx ====================
import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Gigs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const filtered = gigs.filter((g) =>
    g.title?.toLowerCase().includes(search.toLowerCase())
  );

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/gigs");
      setGigs(data.gigs || data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-[900px] mx-auto px-4">
      {/* Hero Greeting Section */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent border border-primary/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-white/60 text-sm font-medium mb-2">
            {getGreeting()}
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Welcome back,{" "}
            <span className="bg-gradient-text bg-clip-text text-transparent">
              {user?.name || "User"}
            </span>
          </h1>

          <p className="text-white/50 text-sm">
            Ready to find your next opportunity?
          </p>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Browse Gigs
      </h2>

      <input
        className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-black/25 border border-white/12 rounded-xl text-white text-sm md:text-base outline-none transition-all placeholder:text-white/55 focus:border-primary/60 focus:bg-black/40"
        placeholder="Search gigs by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="mt-6 text-white/70">Loading...</p>
      ) : gigs.length === 0 ? (
        <p className="mt-6 text-white/70">No gigs found.</p>
      ) : (
        <div className="grid gap-3 mt-6">
          {filtered.map((gig) => (
            <div
              key={gig._id}
              className="border border-white/12 px-4 py-4 rounded-xl cursor-pointer transition-all hover:bg-white/5 hover:-translate-y-0.5"
              onClick={() => navigate(`/gigs/${gig._id}`)}
            >
              <h3 className="text-lg md:text-xl font-semibold text-white m-0">
                {gig.title}
              </h3>
              <p className="my-2 text-white/80 text-sm">{gig.description}</p>
              <p className="m-0 font-semibold text-white text-sm md:text-base">
                Budget: ₹{gig.budget}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
