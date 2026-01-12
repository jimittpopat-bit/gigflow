const Gig = require("../models/Gig");

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
      owner: req.user.id,
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

    const gigs = await Gig.find(query).sort({ createdAt: -1 });

    res.status(200).json(gigs);
  } catch (err) {
    console.log("GET GIGS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.status(200).json({ gig });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ gigs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/gigs/:id/withdraw
exports.withdrawGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // ✅ only owner can withdraw
    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // ✅ already assigned? don't allow withdrawing
    if (gig.status === "assigned") {
      return res
        .status(400)
        .json({ message: "Cannot withdraw an assigned gig" });
    }

    gig.status = "withdrawn";
    await gig.save();

    return res.status(200).json({ message: "Gig withdrawn ✅", gig });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
