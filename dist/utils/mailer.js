"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
// const nodemailer = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(email, password, role) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer_1.default.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAILID,
                pass: process.env.MAILPASSWORD,
            },
            tls: {
                ciphers: "SSLv3",
            },
        });
        let info = yield transporter.sendMail({
            from: process.env.MAILID,
            to: email,
            subject: "Info",
            text: `Your Info are: Email: ${email}, Password: ${password} ,Role : ${role}`,
        });
        console.log("Message sent:", info.response);
    });
}
exports.sendEmail = sendEmail;
