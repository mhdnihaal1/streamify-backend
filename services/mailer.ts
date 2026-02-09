import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
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
