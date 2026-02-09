"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const users_routes_1 = __importDefault(require("./users/users.routes"));
const groups_routes_1 = __importDefault(require("./groups/groups.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
/* ---------------- MIDDLEWARES ---------------- */
// Parse JSON body
app.use(express_1.default.json());
// Parse form data (optional but useful)
app.use(express_1.default.urlencoded({ extended: true }));
// CORS (IMPORTANT: credentials + exact origin)
app.use((0, cors_1.default)({
    origin: "*"
}));
/* ---------------- ROUTES ---------------- */
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/groups", groups_routes_1.default);
/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
    res.json({ message: "Server running ✅" });
});
exports.default = app;
