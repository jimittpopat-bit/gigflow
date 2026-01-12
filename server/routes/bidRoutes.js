const express = require("express");
const auth = require("../middlewares/auth");
const { placeBid, getBidsByGig, hireBid } = require("../controllers/bidController");
const bidController = require("../controllers/bidController");

const router = express.Router();

router.post("/", auth, placeBid);
router.get("/my", auth, bidController.getMyBids);
router.get("/:gigId", auth, getBidsByGig);
router.patch("/:bidId/hire", auth, hireBid);

module.exports = router;
