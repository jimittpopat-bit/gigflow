const Gig = require("../models/Gig");
const Bid = require("../models/Bid");

// POST /api/gigs
exports.createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      owner: req.user._id,
      status: "open",
    });

    res.status(201).json({ message: "Gig created ✅", gig });
  } catch (err) {
    console.log("CREATE GIG ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/gigs?search=
exports.getGigs = async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = {
      status: "open",
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    const gigs = await Gig.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(gigs);
  } catch (err) {
    console.log("GET GIGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/gigs/:id  (✅ includes bids)
exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const bidsRaw = await Bid.find({ gigId: req.params.id })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    const bids = bidsRaw.map((b) => ({
      _id: b._id,
      amount: b.amount,
      message: b.message,
      status: b.status,
      createdAt: b.createdAt,
      bidder: b.freelancerId, // frontend expects bidder
    }));

    return res.status(200).json({
      gig: {
        ...gig.toObject(),
        bids,
      },
    });
  } catch (err) {
    console.log("GET GIG BY ID ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/gigs/my
exports.getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ gigs });
  } catch (err) {
    console.log("GET MY GIGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/gigs/:id
exports.updateGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (gig.status !== "open") {
      return res
        .status(400)
        .json({ message: `Cannot edit gig (${gig.status})` });
    }

    if (title) gig.title = title;
    if (description) gig.description = description;
    if (budget !== undefined) gig.budget = budget;

    await gig.save();

    return res.status(200).json({ message: "Gig updated ✅", gig });
  } catch (err) {
    console.log("UPDATE GIG ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/gigs/:id/withdraw
exports.withdrawGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (gig.status === "assigned") {
      return res
        .status(400)
        .json({ message: "Cannot withdraw an assigned gig" });
    }

    gig.status = "withdrawn";
    await gig.save();

    return res.status(200).json({ message: "Gig withdrawn ✅", gig });
  } catch (err) {
    console.log("WITHDRAW GIG ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/gigs/:id/repost
exports.repostGig = async (req, res) => {
  try {
    const oldGig = await Gig.findById(req.params.id);

    if (!oldGig) return res.status(404).json({ message: "Gig not found" });

    if (oldGig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (oldGig.status === "assigned") {
      return res.status(400).json({ message: "Cannot repost an assigned gig" });
    }

    if (oldGig.status !== "withdrawn") {
      return res.status(400).json({
        message: `Only withdrawn gigs can be reposted (current: ${oldGig.status})`,
      });
    }

    // ✅ prevent repost duplicates
    if (oldGig.reposted && oldGig.repostedTo) {
      return res.status(400).json({
        message: "This gig was already reposted ✅",
        repostedTo: oldGig.repostedTo,
      });
    }

    const newGig = await Gig.create({
      title: oldGig.title,
      description: oldGig.description,
      budget: oldGig.budget,
      owner: oldGig.owner,
      status: "open",
    });

    oldGig.reposted = true;
    oldGig.repostedTo = newGig._id;
    await oldGig.save();

    return res.status(201).json({
      message: "Gig reposted ✅",
      gig: newGig,
      oldGig,
    });
  } catch (err) {
    console.log("REPOST GIG ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
