import { Router } from "express";
import {
  login,
  register,
  sendOtp,
  verifyOtp,
  users,
  orgUser,
  addUser,
  userById
} from "./auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/addUser", addUser);
router.post("/login", login);
// router.post("/login", login);
router.post("/userById",userById) 

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);

router.get("/users", users);
router.post("/orgUser", orgUser);

router.post("/logout", (req, res) => {
  // Clear the cookie
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0), // Expire immediately
    path: "/",
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

router.get("/me", protect, (req, res) => {
  const user = req?.user;

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export default router;
