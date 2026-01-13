import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function GigDetails() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(false);

  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);

  const [bidMessage, setBidMessage] = useState("");
  const [bidPrice, setBidPrice] = useState("");
  const [bidLoading, setBidLoading] = useState(false);

  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  // ✅ Toast state
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast({ type: "", message: "" });
    }, 3000);
  };

  const fetchBids = async () => {
    try {
      setBidsLoading(true);
      const data = await apiRequest(`/api/bids/${id}`);
      setBids(data.bids || data);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setBidsLoading(false);
    }
  };

  const fetchGig = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`/api/gigs/${id}`);
      const gigData = data.gig || data;

      setGig(gigData);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGig();
  }, [id]);

  useEffect(() => {
    const ownerId =
      typeof gig?.owner === "object" ? gig.owner?._id : gig?.owner;

    if (
      gig &&
      user?._id &&
      ownerId &&
      user._id.toString() === ownerId.toString()
    ) {
      fetchBids();
    }
  }, [gig, user]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    // ✅ extra safety (front-end guard)
    if (gig?.status !== "open") {
      showToast("error", "Gig is not open for bidding");
      return;
    }

    try {
      setBidLoading(true);

      await apiRequest("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId: id,
          amount: Number(bidPrice),
          message: bidMessage,
        }),
      });

      showToast("success", "Bid submitted");
      setBidMessage("");
      setBidPrice("");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setBidLoading(false);
    }
  };

  const handleHire = async (bidId) => {
    try {
      await apiRequest(`/api/bids/${bidId}/hire`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      showToast("success", "Freelancer hired");
      fetchGig();
      fetchBids();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  // ✅ Withdraw gig
  const handleWithdraw = async () => {
    try {
      await apiRequest(`/api/gigs/${id}/withdraw`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      showToast("success", "Gig withdrawn ✅");
      setGig((prev) => ({ ...prev, status: "withdrawn" }));
      navigate("/applications", { state: { refresh: true } });
    } catch (err) {
      showToast("error", err.message);
    }
  };

  if (loading)
    return <p className="mt-16 text-white/70 text-center">Loading...</p>;

  if (!gig)
    return <p className="mt-16 text-white/70 text-center">Gig not found</p>;

  const ownerId = typeof gig?.owner === "object" ? gig.owner?._id : gig?.owner;

  const isOwner = user?._id?.toString() === ownerId?.toString();

  const isOpen = gig.status === "open";

  return (
    <div className="w-full max-w-5xl mx-auto relative">
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

      {/* ✅ Withdraw confirm toast */}
      {showWithdrawConfirm && (
        <div className="fixed top-6 right-6 z-[999]">
          <div className="rounded-2xl border border-white/10 bg-dark-card/90 backdrop-blur-heavy px-4 py-4 shadow-lg min-w-[320px]">
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none">⚠️</span>

              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Withdraw this gig?
                </p>
                <p className="text-xs text-white/60 mt-1">
                  This will stop receiving new bids for this listing.
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={async () => {
                      setShowWithdrawConfirm(false);
                      await handleWithdraw();
                    }}
                    className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95 active:scale-[0.98]"
                  >
                    Yes, Withdraw
                  </button>

                  <button
                    onClick={() => setShowWithdrawConfirm(false)}
                    className="rounded-xl border border-white/15 bg-black/20 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/5 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowWithdrawConfirm(false)}
                className="ml-auto text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gig Info */}
      <div className="rounded-3xl border border-white/10 bg-dark-card/70 backdrop-blur-heavy p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {gig.title}
        </h2>

        <p className="text-white/65 leading-relaxed">{gig.description}</p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <p className="text-white font-medium">
            Budget:{" "}
            <span className="text-primary font-bold">₹{gig.budget}</span>
          </p>

          <p className="text-white/70">
            Status:{" "}
            <span
              className={`font-semibold ${
                gig.status === "open"
                  ? "text-emerald-300"
                  : gig.status === "withdrawn"
                  ? "text-red-300"
                  : "text-yellow-300"
              }`}
            >
              {gig.status}
            </span>
          </p>
        </div>

        {/* ✅ Withdraw Button */}
        {isOwner && isOpen && (
          <div className="mt-6">
            <button
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white transition active:scale-[0.98]
              bg-red-500/15 border border-red-500/30 hover:bg-red-500/25"
              onClick={() => setShowWithdrawConfirm(true)}
            >
              Withdraw Gig
            </button>
          </div>
        )}
      </div>

      {/* OWNER VIEW: Bids */}
      {isOwner && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-dark-card/70 backdrop-blur-heavy p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <h3 className="text-2xl font-bold text-white mb-5">Bids</h3>

          {bidsLoading ? (
            <p className="text-white/70 mt-6">Loading bids...</p>
          ) : bids.length === 0 ? (
            <p className="text-white/60 mt-6">No bids yet.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4">
              {bids.map((bid) => (
                <div
                  key={bid._id}
                  className="rounded-2xl border border-white/10 bg-dark-darker/50 backdrop-blur-heavy p-5 transition hover:border-primary/30 hover:bg-dark-darker/70"
                >
                  <div className="flex flex-col gap-3">
                    <p className="text-white/70 leading-relaxed">
                      {bid.message}
                    </p>

                    <p className="text-white font-medium">
                      Amount:{" "}
                      <span className="text-primary font-bold">
                        ₹{bid.amount}
                      </span>
                    </p>

                    {isOpen && (
                      <button
                        className="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-white transition hover:opacity-95 active:scale-[0.98]"
                        onClick={() => handleHire(bid._id)}
                      >
                        Hire
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FREELANCER VIEW */}
      {!isOwner && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-dark-card/70 backdrop-blur-heavy p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <h3 className="text-2xl font-bold text-white mb-5">Place a Bid</h3>

          {!isOpen ? (
            <p className="text-white/60">This gig is not open for bidding.</p>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleBidSubmit}>
              <textarea
                className="w-full rounded-xl border border-white/10 bg-dark-darker/60 backdrop-blur-heavy px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Write your bid message..."
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                required
                rows={4}
              />

              <input
                className="w-full rounded-xl border border-white/10 bg-dark-darker/60 backdrop-blur-heavy px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                type="number"
                placeholder="Your price (₹)"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                required
              />

              <button
                className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-white transition hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={bidLoading}
              >
                {bidLoading ? "Submitting..." : "Submit Bid"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
