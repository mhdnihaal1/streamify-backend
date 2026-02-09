"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const isAuthenticated = (req, res, next) => {
    const user = req.headers["user-id"];
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};
exports.isAuthenticated = isAuthenticated;
