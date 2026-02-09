"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.MAIL_USER, // your email
        pass: process.env.MAIL_PASS, // app password
    },
    tls: {
        rejectUnauthorized: false, // 👈 FIX
    },
});
