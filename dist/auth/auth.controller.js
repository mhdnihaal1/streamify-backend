"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const client_1 = require("../prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = async (req, res) => {
    const { email, password, orgId } = req.body;
    console.log(orgId);
    return;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await client_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            orgId, // ✅ REQUIRED
        },
    });
    res.json(user);
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await client_1.prisma.user.findFirst({
        where: { email, password }
    });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json(user);
};
exports.login = login;
