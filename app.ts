import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./auth/auth.routes";
import userRoutes from "./users/users.routes";
import groupRoutes from "./groups/groups.routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

/* ---------------- MIDDLEWARES ---------------- */
app.use(cookieParser());

// Parse JSON body
app.use(express.json());

// Parse form data (optional but useful)
app.use(express.urlencoded({ extended: true }));

 app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);

/* ---------------- HEALTH CHECK ---------------- */

app.get("/", (req, res) => {
  res.json({ message: "Server running ✅" });
});

export default app;
