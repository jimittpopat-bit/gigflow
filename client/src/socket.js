import { io } from "socket.io-client";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export const socket = io(BASE, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});