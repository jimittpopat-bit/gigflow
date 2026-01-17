
const { z } = require("zod");
const { objectId } = require("./gig.validators");

const placeBidSchema = z.object({
  amount: z.number().positive().max(100000000),
  proposal: z.string().min(10).max(2000),
});

const withdrawBidSchema = z.object({
  reason: z.string().min(3).max(200).optional(),
});

const hireBidSchema = z.object({
  // no body needed, but we keep schema to enforce clean validation pattern
});

module.exports = { placeBidSchema, withdrawBidSchema, hireBidSchema, objectId };
