const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const createGigSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(80),
    description: z.string().min(10).max(2000),
    budget: z.number().positive().max(100000000),
    category: z.string().min(2).max(40).optional(),
    deadline: z.string().datetime().optional(),
  }),
});

const updateGigSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(80).optional(),
    description: z.string().min(10).max(2000).optional(),
    budget: z.number().positive().max(100000000).optional(),
    category: z.string().min(2).max(40).optional(),
    deadline: z.string().datetime().optional(),
  }),
});

module.exports = { createGigSchema, updateGigSchema, objectId };