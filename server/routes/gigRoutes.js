const express = require("express");
const auth = require("../middlewares/auth");

const {
  createGig,
  getGigs,
  getGigById,
  getMyGigs,
  withdrawGig,
} = require("../controllers/gigController");

const router = express.Router();

// Public feed
router.get("/", getGigs);

// Client creates a gig (auth required)
router.post("/", auth, createGig);

router.get("/my", auth, getMyGigs);

// Gig details route
router.get("/:id", auth, getGigById);

// Withdraw gig
router.patch("/:id/withdraw", auth, withdrawGig);

module.exports = router;

