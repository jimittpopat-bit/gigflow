import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";
import api from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function Applications() {
  const [myBids, setMyBids] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ tabs: open | assigned | withdrawn | all
  const [gigTab, setGigTab] = useState("open");

  // ✅ Toast
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    msg: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast({ show: false, type: "success", msg: "" }), 2200);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const [bidsRes, gigsRes] = await Promise.all([
        apiRequest("/api/bids/my"),
        apiRequest("/api/gigs/my"),
      ]);

      setMyBids(bidsRes.bids || []);
      setMyGigs(gigsRes.gigs || []);
    } catch (err) {
      showToast(err?.message || "Failed to load data ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchData();
    }
  }, [location.state]);

  const handleWithdrawGig = async (gigId) => {
    try {
      await api.patch(`/api/gigs/${gigId}/withdraw`);
      showToast("Gig withdrawn ✅");
      fetchData();
    } catch (err) {
      showToast(err?.response?.data?.message || "Withdraw failed ❌", "error");
    }
  };

  // ✅ Repost gig (creates new one)
  const handleRepostGig = async (gigId) => {
    try {
      await api.post(`/api/gigs/${gigId}/repost`);
      showToast("Gig reposted ✅");
      fetchData();
    } catch (err) {
      showToast(err?.response?.data?.message || "Repost failed ❌", "error");
    }
  };

  const Card = ({ title, children }) => (
    <div className="rounded-3xl border border-white/10 bg-dark-card/70 backdrop-blur-heavy p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-5">{title}</h3>
      {children}
    </div>
  );

  const ItemCard = ({ onClick, title, desc, amountLabel, amount, status }) => (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-white/10 bg-dark-darker/50 backdrop-blur-heavy p-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-dark-darker/70 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
    >
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>

      <p className="text-white/70 leading-relaxed mb-4 line-clamp-3">{desc}</p>

      <p className="text-white font-medium">
        {amountLabel}: <span className="text-primary font-bold">₹{amount}</span>
      </p>

      <p className="mt-2 text-sm text-white/50">
        Status: <span className="text-white/70">{status}</span>
      </p>
    </div>
  );

  const tabs = useMemo(
    () => [
      { key: "open", label: "Open" },
      { key: "assigned", label: "Assigned" },
      { key: "withdrawn", label: "Withdrawn" },
      { key: "all", label: "All" },
    ],
    [],
  );

  const filteredGigs = useMemo(() => {
    if (gigTab === "all") return myGigs;

    // ✅ PRO UX: withdrawn tab shows only "not yet reposted"
    if (gigTab === "withdrawn") {
      return myGigs.filter((g) => g.status === "withdrawn" && !g.reposted);
    }

    return myGigs.filter((g) => g.status === gigTab);
  }, [myGigs, gigTab]);

  const OwnerGigCard = ({ gig }) => {
    const isOpen = gig.status === "open";
    const isAssigned = gig.status === "assigned";
    const isWithdrawn = gig.status === "withdrawn";

    return (
      <div className="rounded-2xl border border-white/10 bg-dark-darker/50 backdrop-blur-heavy p-5 transition hover:border-primary/30 hover:bg-dark-darker/70 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/gigs/${gig._id}`)}
        >
          <h4 className="text-lg font-semibold text-white mb-2">{gig.title}</h4>

          <p className="text-white/70 leading-relaxed mb-4 line-clamp-3">
            {gig.description}
          </p>

          <p className="text-white font-medium">
            Budget:{" "}
            <span className="text-primary font-bold">₹{gig.budget}</span>
          </p>

          <p className="mt-2 text-sm text-white/50">
            Status: <span className="text-white/70">{gig.status}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {/* ✅ Always allow Manage/View */}
          <button
            onClick={() => navigate(`/gigs/${gig._id}`)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Manage / Hire
          </button>

          {/* ✅ Withdraw only when OPEN */}
          {isOpen && (
            <button
              onClick={() => handleWithdrawGig(gig._id)}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              Withdraw Gig
            </button>
          )}

          {/* ✅ Repost only when WITHDRAWN + not already reposted */}
          {isWithdrawn && !gig.reposted && (
            <button
              onClick={() => handleRepostGig(gig._id)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
            >
              Repost
            </button>
          )}

          {/* ✅ if already reposted, show badge instead */}
          {isWithdrawn && gig.reposted && (
            <span className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200">
              Reposted ✅
            </span>
          )}

          {/* ✅ Assigned = no withdraw */}
          {isAssigned && (
            <span className="px-4 py-2 rounded-xl bg-green-600/20 border border-green-500/30 text-green-200">
              Assigned ✅
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* ✅ TOAST */}
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

      <h2 className="text-3xl font-bold text-white">Applications</h2>

      {loading ? (
        <p className="text-white/70">Loading...</p>
      ) : (
        <>
          {/* ✅ Freelancer section */}
          <Card title="My Applications (Bids)">
            {myBids.length === 0 ? (
              <p className="text-white/60 mt-6">No applications yet.</p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4">
                {myBids.map((bid) => (
                  <ItemCard
                    key={bid._id}
                    onClick={() =>
                      bid.gigId?._id && navigate(`/gigs/${bid.gigId._id}`)
                    }
                    title={bid.gigId?.title || "Gig"}
                    desc={bid.message}
                    amountLabel="Amount"
                    amount={bid.amount}
                    status={bid.status}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* ✅ Employer section */}
          <Card title="My Posted Jobs (Gigs)">
            {/* ✅ Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setGigTab(t.key)}
                  className={`px-4 py-2 rounded-xl border transition ${
                    gigTab === t.key
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-black/20 border-white/10 text-white/70 hover:bg-white/5"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {filteredGigs.length === 0 ? (
              <p className="text-white/60 mt-6">No gigs in this section.</p>
            ) : (
              <div className="mt-2 grid grid-cols-1 gap-4">
                {filteredGigs.map((gig) => (
                  <OwnerGigCard key={gig._id} gig={gig} />
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
