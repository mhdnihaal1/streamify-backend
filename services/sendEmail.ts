import { transporter } from "./mailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"Kodds App" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};
