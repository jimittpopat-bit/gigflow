import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Applications() {
  const [myBids, setMyBids] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      alert(err.message);
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

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
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
            {myGigs.length === 0 ? (
              <p className="text-white/60 mt-6">No gigs posted yet.</p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4">
                {myGigs.map((gig) => (
                  <ItemCard
                    key={gig._id}
                    onClick={() => navigate(`/gigs/${gig._id}`)}
                    title={gig.title}
                    desc={gig.description}
                    amountLabel="Budget"
                    amount={gig.budget}
                    status={gig.status}
                  />
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
