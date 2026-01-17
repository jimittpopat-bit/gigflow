const express = require("express");
const auth = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");

const {
  createGig,
  getGigs,
  getGigById,
  getMyGigs,
  updateGig,
  withdrawGig,
  repostGig,
} = require("../controllers/gigController");

const { createGigSchema, updateGigSchema } = require("../validators/gig.validators");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gigs
 *   description: Gig management endpoints
 */

/**
 * @swagger
 * /api/gigs:
 *   get:
 *     summary: Get all gigs (public feed)
 *     tags: [Gigs]
 *     responses:
 *       200:
 *         description: List of gigs
 */
router.get("/", getGigs);

/**
 * @swagger
 * /api/gigs:
 *   post:
 *     summary: Create a new gig
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, budget]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Build a landing page
 *               description:
 *                 type: string
 *                 example: Need a responsive landing page with React
 *               budget:
 *                 type: number
 *                 example: 5000
 *               category:
 *                 type: string
 *                 example: Web Development
 *               deadline:
 *                 type: string
 *                 example: 2026-01-31T00:00:00.000Z
 *     responses:
 *       201:
 *         description: Gig created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, validate(createGigSchema), createGig);

/**
 * @swagger
 * /api/gigs/my:
 *   get:
 *     summary: Get gigs created by logged-in user
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's gigs
 *       401:
 *         description: Unauthorized
 */
router.get("/my", auth, getMyGigs);

/**
 * @swagger
 * /api/gigs/{id}:
 *   get:
 *     summary: Get gig by ID
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f2e77b9a3b2d0012abc123
 *     responses:
 *       200:
 *         description: Gig details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gig not found
 */
router.get("/:id", auth, getGigById);

/**
 * @swagger
 * /api/gigs/{id}:
 *   patch:
 *     summary: Update gig by ID
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: Update gig title
 *               description:
 *                 type: string
 *                 example: Updated gig description
 *               budget:
 *                 type: number
 *                 example: 8000
 *               category:
 *                 type: string
 *                 example: UI/UX
 *               deadline:
 *                 type: string
 *                 example: 2026-02-15T00:00:00.000Z
 *     responses:
 *       200:
 *         description: Gig updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gig not found
 */
router.patch("/:id", auth, validate(updateGigSchema), updateGig);

/**
 * @swagger
 * /api/gigs/{id}/withdraw:
 *   patch:
 *     summary: Withdraw a gig (disable hiring + show withdrawn status)
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f2e77b9a3b2d0012abc123
 *     responses:
 *       200:
 *         description: Gig withdrawn successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gig not found
 */
router.patch("/:id/withdraw", auth, withdrawGig);

/**
 * @swagger
 * /api/gigs/{id}/repost:
 *   post:
 *     summary: Repost a gig (creates a new gig copy)
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65f2e77b9a3b2d0012abc123
 *     responses:
 *       201:
 *         description: Gig reposted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gig not found
 */
router.post("/:id/repost", auth, repostGig);

module.exports = router;
