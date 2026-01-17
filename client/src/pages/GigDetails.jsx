import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function GigDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const userId = user?._id || user?.id || null;

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidLoading, setBidLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    budget: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    type: "success",
    msg: "",
  });
  const showToast = (msg, type = "success") => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast({ show: false, type: "success", msg: "" }), 2200);
  };

  const fetchGig = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/gigs/${id}`);
      const gigData = res.data?.gig || res.data;

      setGig(gigData);
      setBids(gigData?.bids || []);

      setEditForm({
        title: gigData?.title || "",
        description: gigData?.description || "",
        budget: gigData?.budget || "",
      });
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to load gig ❌",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGig();
    // eslint-disable-next-line
  }, [id]);

  const ownerId = useMemo(() => {
    if (!gig?.owner) return null;
    if (typeof gig.owner === "string") return gig.owner;
    return gig.owner?._id || gig.owner?.id || null;
  }, [gig]);

  const isOwner = useMemo(() => {
    if (!ownerId || !userId) return false;
    return String(ownerId) === String(userId);
  }, [ownerId, userId]);

  const myBid = useMemo(() => {
    if (!userId) return null;
    return (bids || []).find((b) => {
      const bidderId = b?.bidder?._id || b?.bidder?.id || b?.bidder;
      return String(bidderId) === String(userId);
    });
  }, [bids, userId]);

  const canHire = gig?.status === "open"; // ✅ disable after withdrawn/assigned

  const handlePlaceBid = async (e) => {
    e.preventDefault();

    if (!bidAmount) return showToast("Enter bid amount", "error");

    try {
      setBidLoading(true);

      await api.post(`/api/bids/${id}`, {
        amount: Number(bidAmount),
        proposal: bidMessage,
      });

      showToast("Bid placed ✅");
      setBidAmount("");
      setBidMessage("");
      await fetchGig();
    } catch (err) {
      showToast(err?.response?.data?.message || "Bid failed ❌", "error");
    } finally {
      setBidLoading(false);
    }
  };

  const handleWithdrawBid = async (bidId) => {
    try {
      setBidLoading(true);
      await api.delete(`/api/bids/${bidId}`);
      showToast("Bid withdrawn ✅");
      await fetchGig();
    } catch (err) {
      showToast(err?.response?.data?.message || "Withdraw failed ❌", "error");
    } finally {
      setBidLoading(false);
    }
  };

  const handleHireBid = async (bidId) => {
    try {
      setBidLoading(true);
      await api.post(`/api/bids/${bidId}/hire`);
      showToast("Hired ✅");
      await fetchGig();
    } catch (err) {
      showToast(err?.response?.data?.message || "Hire failed ❌", "error");
    } finally {
      setBidLoading(false);
    }
  };

  const handleWithdrawGig = async () => {
    try {
      await api.patch(`/api/gigs/${id}/withdraw`);
      showToast("Gig withdrawn ✅");
      await fetchGig();
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Withdraw gig failed ❌",
        "error",
      );
    }
  };

  const handleUpdateGig = async (e) => {
    e.preventDefault();

    try {
      setEditLoading(true);

      await api.patch(`/api/gigs/${id}`, {
        title: editForm.title,
        description: editForm.description,
        budget: Number(editForm.budget),
      });

      showToast("Gig updated ✅");
      setShowEditModal(false);
      await fetchGig();
    } catch (err) {
      showToast(err?.response?.data?.message || "Update failed ❌", "error");
    } finally {
      setEditLoading(false);
    }
  };

  if (authLoading || loading)
    return <div className="p-6 text-white/80">Loading...</div>;
  if (!gig) return <div className="p-6 text-white/80">Gig not found</div>;

  return (
    <div className="p-6 text-white">
      {toast.show && (
        <div className="fixed top-6 right-6 z-[9999]">
          <div
            className={`px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md ${
              toast.type === "error"
                ? "bg-red-500/20 border-red-400/30 text-red-200"
                : "bg-green-500/20 border-green-400/30 text-green-200"
            }`}
          >
            {toast.msg}
          </div>
        </div>
      )}

      <div className="max-w-5xl">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{gig.title}</h1>
              <p className="text-white/60 mt-2 leading-relaxed">
                {gig.description}
              </p>
              <p className="mt-5 font-semibold text-lg">₹ {gig.budget}</p>

              {/* ✅ Status display */}
              <p className="mt-2 text-sm text-white/50">
                Status: <span className="text-white/70">{gig.status}</span>
              </p>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-5 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  ✏️ Edit Gig
                </button>

                <button
                  onClick={handleWithdrawGig}
                  className="px-5 py-3 rounded-2xl bg-red-600 text-white hover:bg-red-700"
                >
                  Withdraw Gig
                </button>
              </div>
            )}
          </div>
        </div>

        {!isOwner && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Apply / Place Bid</h2>

            {!userId ? (
              <p className="text-white/60">Login to place a bid.</p>
            ) : myBid ? (
              <div className="text-white/70">
                <p className="mb-3">
                  ✅ You already placed a bid:{" "}
                  <span className="font-semibold">₹ {myBid.amount}</span>
                </p>

                <button
                  onClick={() => handleWithdrawBid(myBid._id)}
                  disabled={bidLoading}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                >
                  {bidLoading ? "..." : "Withdraw Bid"}
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceBid} className="space-y-3">
                <textarea
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  placeholder="Write a short proposal..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-400 min-h-[110px]"
                />

                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter amount (₹)"
                    className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-400"
                  />

                  <button
                    type="submit"
                    disabled={bidLoading}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    {bidLoading ? "..." : "Place Bid"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Bids</h2>

          {!bids?.length ? (
            <p className="text-white/50">No bids yet.</p>
          ) : (
            <div className="space-y-3">
              {bids.map((b) => {
                const bidderId = b?.bidder?._id || b?.bidder?.id || b?.bidder;
                const isMyBidRow =
                  userId && String(bidderId) === String(userId);

                return (
                  <div
                    key={b._id}
                    className="border border-white/10 rounded-2xl p-4 flex items-center justify-between bg-black/20"
                  >
                    <div>
                      <p className="font-semibold text-lg">₹ {b.amount}</p>
                      <p className="text-sm text-white/50">
                        Bidder: {b?.bidder?.name || bidderId || "Unknown"}
                      </p>
                      {b?.message && (
                        <p className="text-sm text-white/70 mt-2">
                          {b.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {isMyBidRow && (
                        <button
                          onClick={() => handleWithdrawBid(b._id)}
                          disabled={bidLoading}
                          className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                        >
                          {bidLoading ? "..." : "Withdraw"}
                        </button>
                      )}

                      {isOwner && (
                        <button
                          onClick={() => handleHireBid(b._id)}
                          disabled={bidLoading || !canHire}
                          className={`px-4 py-2 rounded-xl text-white ${
                            !canHire
                              ? "bg-green-600/30 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                          title={
                            !canHire ? "Gig is not open" : "Hire freelancer"
                          }
                        >
                          {bidLoading
                            ? "..."
                            : canHire
                              ? "Hire"
                              : "Hire Disabled"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-[#0B0F19] text-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-4">Edit Gig</h2>

              <form onSubmit={handleUpdateGig} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/80">
                    Title
                  </label>
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, title: e.target.value }))
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 mt-1 outline-none focus:border-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/80">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 mt-1 min-h-[110px] outline-none focus:border-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/80">
                    Budget
                  </label>
                  <input
                    type="number"
                    value={editForm.budget}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, budget: e.target.value }))
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 mt-1 outline-none focus:border-purple-400"
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5"
                    disabled={editLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                    disabled={editLoading}
                  >
                    {editLoading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => navigate("/gigs")}
            className="text-white/60 hover:text-white underline"
          >
            ← Back to gigs
          </button>
        </div>
      </div>
    </div>
  );
}
