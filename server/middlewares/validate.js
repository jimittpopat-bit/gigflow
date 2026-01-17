const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    req.validated = result.data;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validate };
