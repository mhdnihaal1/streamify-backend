"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.register);
router.post("/addUser", auth_controller_1.addUser);
router.post("/login", auth_controller_1.login);
// router.post("/login", login);
router.post("/userById", auth_controller_1.userById);
router.get("/users", auth_controller_1.users);
router.post("/orgUser", auth_controller_1.orgUser);
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
router.get("/me", auth_middleware_1.protect, (req, res) => {
    const user = req?.user;
    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.status(200).json({
        success: true,
        user,
    });
});
exports.default = router;
