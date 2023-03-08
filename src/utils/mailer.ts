// const nodemailer = require("nodemailer");
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
export async function sendEmail(
  email: string,
  password: string,
  role: string
): Promise<void> {
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILID as string,
      pass: process.env.MAILPASSWORD as string,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  let info = await transporter.sendMail({
    from: process.env.MAILID as string,
    to: email,
    subject: "Info",
    text: `Your Info are: Email: ${email}, Password: ${password} ,Role : ${role}`,
  });

  console.log("Message sent:", info.response);
}
