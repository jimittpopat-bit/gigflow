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
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());


if (process.env.NODE_ENV === "production") {
  app.use(xss());
}

const allowedOrigins = [
  "http://localhost:5173", 
  process.env.CLIENT_URL,
  "https://gigflow-beta.vercel.app",  // ✅ Add this
].filter(Boolean);
```

**Also update your environment variables on Render:**

Go to your Render dashboard → Your service → Environment → Add:
```
CLIENT_URL=https://gigflow-beta.vercel.app

const allowedOriginRegex = [/^https:\/\/gigflow-[a-z0-9-]+\.vercel\.app$/];

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30, // 30 requests per window per IP
  message: { message: "Too many requests. Try again later." },
});

// ✅ DEV: allow all origins (avoid CORS headache)
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
} else {
  // ✅ PROD: strict allowlist
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) return callback(null, true);

        if (allowedOriginRegex.some((rx) => rx.test(origin))) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS: " + origin));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
}

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