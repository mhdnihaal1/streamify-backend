"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const mailer_1 = require("./mailer");
const sendEmail = async (to, subject, html) => {
    await mailer_1.transporter.sendMail({
        from: `"Kodds App" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
    });
};
exports.sendEmail = sendEmail;
