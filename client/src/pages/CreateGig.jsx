import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function CreateGig() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleCreateGig = async (e) => {
    e.preventDefault();
    setSuccess("");

    try {
      setLoading(true);

      await apiRequest("/api/gigs", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          budget: Number(budget),
        }),
      });

      setSuccess("Gig created successfully ✅");

      setTitle("");
      setDescription("");
      setBudget("");

      setTimeout(() => navigate("/applications"), 1000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-3xl border border-white/10 bg-dark-card/70 backdrop-blur-heavy p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <h2 className="text-3xl font-bold text-white">Create Gig</h2>

        {success && (
          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-200">
            {success}
          </div>
        )}

        <form onSubmit={handleCreateGig} className="mt-8 flex flex-col gap-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-dark-darker/60 backdrop-blur-heavy px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            placeholder="Gig Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full rounded-xl border border-white/10 bg-dark-darker/60 backdrop-blur-heavy px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder="Gig Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
          />

          <input
            className="w-full rounded-xl border border-white/10 bg-dark-darker/60 backdrop-blur-heavy px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            placeholder="Budget (₹)"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />

          <button
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-white transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Gig"}
          </button>
        </form>
      </div>
    </div>
  );
}
