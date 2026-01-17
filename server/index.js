const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { setSocketServerInstance } = require("./socket");
require("dotenv").config({ quiet: true });
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const http = require("http");

const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const bidRoutes = require("./routes/bidRoutes");
const app = express();

console.log("Express version:", require("express/package.json").version);
console.log("NODE_ENV:", process.env.NODE_ENV);


const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// ✅ CORS CONFIGURATION - MUST BE BEFORE OTHER MIDDLEWARE
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000", 
  "https://gigflow-beta.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

const allowedOriginRegex = [/^https:\/\/gigflow-[a-z0-9-]+\.vercel\.app$/];

// ✅ Apply CORS first - before any other middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (allowedOriginRegex.some((rx) => rx.test(origin))) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

if (process.env.NODE_ENV === "production") {
  app.use(xss());
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30, // 30 requests per window per IP
  message: { message: "Too many requests. Try again later." },
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("GigFlow backend running ✅");
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ message: err.message || "Server error" });
});

// ✅ create server AFTER app is created
const server = http.createServer(app);

// ✅ socket setup
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      if (allowedOriginRegex.some((rx) => rx.test(origin))) {
        return callback(null, true);
      }

      return callback(new Error("Socket.IO CORS blocked: " + origin));
    },
    credentials: true,
  },
});

setSocketServerInstance(io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ✅ FIXED: Don't connect to MongoDB in test environment
    // Tests use MongoDB Memory Server via setup.js
    if (process.env.NODE_ENV === "test") {
      console.log("Test environment - skipping MongoDB connection");
      return;
    }

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected ✅");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ✅`);
      console.log("Allowed origins:", allowedOrigins);
    });
  } catch (err) {
    console.log("MongoDB connection error ❌", err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;