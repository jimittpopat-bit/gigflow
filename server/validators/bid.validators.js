const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const placeBidSchema = z.object({
  body: z.object({
    amount: z.number().positive().max(100000000),
    proposal: z.string().min(10).max(2000),
  }),
});

const withdrawBidSchema = z.object({
  body: z.object({
    reason: z.string().min(3).max(200).optional(),
  }),
});

const hireBidSchema = z.object({
  body: z.object({}), // no body needed, but keep consistent structure
});

module.exports = { placeBidSchema, withdrawBidSchema, hireBidSchema, objectId };