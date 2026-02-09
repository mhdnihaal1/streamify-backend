"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgUser = exports.users = exports.login = exports.addUser = exports.userById = exports.register = void 0;
const client_1 = require("../prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../services/sendEmail");
const register = async (req, res) => {
    try {
        const { fullName, email, password, orgId, role } = req.body;
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: "Please fill required fields" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const userExist = await client_1.prisma.user.findUnique({
            where: { email },
        });
        if (userExist) {
            return res.status(401).json({ message: "User already exists" });
        }
        const user = await client_1.prisma.user.create({
            data: {
                name: fullName,
                email,
                password: hashedPassword,
                orgId,
                role,
            },
        });
        res.json(user);
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.register = register;
const userById = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await client_1.prisma.user.findFirst({
            where: { id: userId },
            include: {
                org: true,
                ownedGroups: true,
                memberships: true,
                messages: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.userById = userById;
const addUser = async (req, res) => {
    try {
        const { fullName, email, password, orgId, group, role } = req.body.addData;
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: "Please fill required fields" });
        }
        // return
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const userExist = await client_1.prisma.user.findUnique({
            where: { email },
        });
        if (userExist) {
            return res.status(401).json({ message: "User already exists" });
        }
        const user = await client_1.prisma.user.create({
            data: {
                name: fullName,
                email,
                password: hashedPassword,
                orgId,
                role,
            },
        });
        //  if(role !== 'ADMIN'){
        const GrpMember = await client_1.prisma.groupMember.createMany({
            data: group.map((groupId) => ({
                userId: user.id,
                groupId: groupId, // or directly groupId
            })),
            skipDuplicates: true,
        });
        //  }
        await (0, sendEmail_1.sendEmail)(email, "Welcome to Kodds 🚀", `
  <h2>Hello ${fullName}</h2>
  <p>Your account has been created successfully.</p>
  <p>Role: ${role}</p>
  <p>Organization ID: ${orgId}</p>
  <p>You can now log in to your account and start using Kodds Link ${process.env.FRONTEND_URL}!</p>
  <p>Email: ${email}</p>
  <p>Password: ${password}</p>
  `);
        res.json(user);
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.addUser = addUser;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        const user = await client_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("token", token, {
            httpOnly: true, // cannot be accessed via JS
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "lax", // prevent CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            path: "/", // cookie path
        });
        return res.status(200).json({
            Success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                orgId: user.orgId,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
const users = async (req, res) => {
    try {
        const users = await client_1.prisma.user.findMany({
            include: {
                org: true,
                memberships: true,
                messages: true,
            },
        });
        if (!users) {
            return res.status(401).json({ message: "No users found" });
        }
        return res.status(200).json({
            Success: true,
            message: "Users fetched successfully",
            users,
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.users = users;
const orgUser = async (req, res) => {
    try {
        const { orgId } = req.body;
        // return
        if (!orgId) {
            return res.status(400).json({ message: "Organization ID is required" });
        }
        const org = await client_1.prisma.organization.findMany({
            where: { id: orgId },
            include: {
                users: true,
                groups: true,
            },
        });
        if (!org) {
            return res.status(401).json({ message: "No org found" });
        }
        return res.status(200).json({
            Success: true,
            message: "User fetched successfully",
            org,
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.orgUser = orgUser;
