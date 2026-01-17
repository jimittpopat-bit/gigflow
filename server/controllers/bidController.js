const { getIO } = require("../socket");
const mongoose = require("mongoose");
const Bid = require("../models/Bid");
const Gig = require("../models/Gig");

// POST /api/bids/:gigId
exports.placeBid = async (req, res) => {
  try {
    // ✅ FIX: gigId comes from URL params, not body
    const { gigId } = req.params;
    // ✅ FIX: changed 'message' to 'proposal' to match validator
    const { amount, proposal } = req.body;
    
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    
    if (gig.status !== "open") {
      return res.status(400).json({ message: "Gig is not open for bidding" });
    }
    
    // user cannot bid on own gig
    if (gig.owner.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot bid on your own gig" });
    }
    
    // prevent duplicate bid
    const existing = await Bid.findOne({
      gigId,
      freelancerId: req.user._id,
    });
    
    if (existing) {
      return res.status(400).json({ message: "You already placed a bid" });
    }
    
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      amount,
      message: proposal, // ✅ Store proposal as message in DB
      status: "pending",
    });

    // ✅ SOCKET NOTIFICATION (to gig owner)
    try {
      const io = getIO();
      io.to(gig.owner.toString()).emit("notification", {
        type: "NEW_BID",
        message: `New bid placed on your gig: ${gig.title}`,
        gigId: gig._id,
      });
    } catch (e) {
      console.log("Socket not ready, skipping notification");
    }

    return res.status(201).json({ message: "Bid placed", bid });
  } catch (err) {
    console.log("PLACE BID ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/bids/:gigId  (OWNER ONLY)
exports.getBidsByGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // ✅ OWNER CHECK
    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.json({ bids });
  } catch (err) {
    console.log("GET BIDS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/bids/:bidId/hire  (BONUS 1: TRANSACTION SAFE)
exports.hireBid = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { bidId } = req.params;
    let hiredBid = null;

    await session.withTransaction(async () => {
      const bid = await Bid.findById(bidId).session(session);
      if (!bid) {
        const err = new Error("Bid not found");
        err.statusCode = 404;
        throw err;
      }

      const gig = await Gig.findById(bid.gigId).session(session);
      if (!gig) {
        const err = new Error("Gig not found");
        err.statusCode = 404;
        throw err;
      }

      // only owner can hire
      if (gig.owner.toString() !== req.user._id.toString()) {
        const err = new Error("Not allowed to hire for this gig");
        err.statusCode = 403;
        throw err;
      }

      // ✅ atomic lock (prevents race conditions)
      const lockedGig = await Gig.findOneAndUpdate(
        { _id: gig._id, status: "open" },
        { $set: { status: "assigned" } },
        { new: true, session }
      );

      if (!lockedGig) {
        const err = new Error("Gig already assigned (race condition)");
        err.statusCode = 400;
        throw err;
      }

      // hire selected bid
      hiredBid = await Bid.findOneAndUpdate(
        { _id: bid._id, status: "pending" },
        { $set: { status: "hired" } },
        { new: true, session }
      );

      if (!hiredBid) {
        const err = new Error("This bid is not pending anymore");
        err.statusCode = 400;
        throw err;
      }

      // reject other bids
      await Bid.updateMany(
        { gigId: bid.gigId, _id: { $ne: bid._id }, status: "pending" },
        { $set: { status: "rejected" } },
        { session }
      );
    });

    return res.status(200).json({
      message: "Freelancer hired successfully",
      hiredBid,
    });
  } catch (err) {
    console.log("HIRE ERROR:", err);
    return res.status(err.statusCode || 500).json({
      message: err.message || "Server error",
    });
  } finally {
    session.endSession();
  }
};

// GET /api/bids/my
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate("gigId", "title budget status owner")
      .sort({ createdAt: -1 });

    res.status(200).json({ bids });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.withdrawBid = async (req, res) => {
  try {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    // ✅ only bidder can withdraw
    if (bid.freelancerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ can't withdraw after hired
    if (bid.status === "hired") {
      return res.status(400).json({ message: "Cannot withdraw hired bid" });
    }

    await Bid.findByIdAndDelete(bidId);

    return res.status(200).json({ message: "Bid withdrawn ✅" });
  } catch (err) {
    console.log("withdrawBid error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};