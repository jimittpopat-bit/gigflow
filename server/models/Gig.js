const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },

    status: {
      type: String,
      enum: ["open", "assigned", "withdrawn"],
      default: "open",
    },

    // ✅ NEW: prevents repost spamming + keeps history
    reposted: { type: Boolean, default: false },

    // ✅ NEW: points to the new gig created from repost
    repostedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      default: null,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gig", gigSchema);
