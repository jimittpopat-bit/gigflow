const express = require("express");
const auth = require("../middlewares/auth");
const bidController = require("../controllers/bidController");
const { validate } = require("../middlewares/validate");

const { placeBidSchema } = require("../validators/bid.validators");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bids
 *   description: Bid endpoints
 */

/**
 * @swagger
 * /api/bids/{gigId}:
 *   post:
 *     summary: Place a bid on a gig
 *     tags: [Bids]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: gigId
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f2e77b9a3b2d0012abc123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, proposal]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 3500
 *               proposal:
 *                 type: string
 *                 example: I can deliver this in 3 days with clean UI
 *     responses:
 *       201:
 *         description: Bid placed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gig not found
 */
router.post("/:gigId", auth, validate(placeBidSchema), bidController.placeBid);

/**
 * @swagger
 * /api/bids/my:
 *   get:
 *     summary: Get bids placed by the logged-in user
 *     tags: [Bids]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's bids
 *       401:
 *         description: Unauthorized
 */
router.get("/my", auth, bidController.getMyBids);

/**
 * @swagger
 * /api/bids/{gigId}:
 *   get:
 *     summary: Get bids for a gig
 *     tags: [Bids]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: gigId
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f2e77b9a3b2d0012abc123
 *     responses:
 *       200:
 *         description: List of bids
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gig not found
 */
router.get("/:gigId", auth, bidController.getBidsByGig);

/**
 * @swagger
 * /api/bids/{bidId}/hire:
 *   patch:
 *     summary: Hire a bid (assign freelancer)
 *     tags: [Bids]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bidId
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f2e77b9a3b2d0012abc999
 *     responses:
 *       200:
 *         description: Bid hired successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bid not found
 */
router.patch("/:bidId/hire", auth, bidController.hireBid);

/**
 * @swagger
 * /api/bids/{bidId}/hire:
 *   post:
 *     summary: Hire a bid (POST variant)
 *     tags: [Bids]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bidId
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f2e77b9a3b2d0012abc999
 *     responses:
 *       200:
 *         description: Bid hired successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bid not found
 */
router.post("/:bidId/hire", auth, bidController.hireBid);

/**
 * @swagger
 * /api/bids/{bidId}:
 *   delete:
 *     summary: Withdraw a bid
 *     tags: [Bids]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bidId
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f2e77b9a3b2d0012abc999
 *     responses:
 *       200:
 *         description: Bid withdrawn successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bid not found
 */
router.delete("/:bidId", auth, bidController.withdrawBid);

module.exports = router;
