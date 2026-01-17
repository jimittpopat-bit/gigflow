// server/docs/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GigFlow API",
      version: "1.0.0",
      description: "API documentation for GigFlow backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token", // ✅ replace with your real cookie name if different
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./routes/*.js"], // reads swagger comments from routes
};

module.exports = swaggerJSDoc(options);
