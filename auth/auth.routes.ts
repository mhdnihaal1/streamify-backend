import { Router } from "express";
import { login, register, orgUser, addUser, userById } from "./auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/addUser", addUser);
router.post("/userById", userById);
router.post("/orgUser", orgUser);

router.post("/logout", (req, res) => {
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
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
