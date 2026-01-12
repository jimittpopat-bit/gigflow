const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { setSocketServerInstance } = require("./socket");
require("dotenv").config({ quiet: true });

const http = require("http");

const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const bidRoutes = require("./routes/bidRoutes");

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, 
].filter(Boolean);

const allowedOriginRegex = [
  /^https:\/\/gigflow-.*\.vercel\.app$/, // all preview URLs
  /^https:\/\/gigflow-beta\.vercel\.app$/, // production domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server
      if (!origin) return callback(null, true);

      // exact match
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // regex match
      if (allowedOriginRegex.some((rx) => rx.test(origin))) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

app.get("/", (req, res) => {
  res.send("GigFlow backend running ✅");
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
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ✅`);
    });
  } catch (err) {
    console.log("MongoDB connection error ❌", err);
    process.exit(1);
  }
};

startServer();
