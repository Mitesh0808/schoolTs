import mongoose, { Schema, Document, Types } from "mongoose";
import { generate } from "generate-password";
import fs from "fs";
import path from "path";
const bcrypt = require("bcryptjs");
// const sendEmail = require("../utils/mailer");
// //isActive,email,school
import { sendEmail } from "../utils/mailer";

export interface IMarketing extends Document {
  isActive: boolean;
  email: string;
  password: string;
  school: Types.ObjectId;
}
const MarketingSchema: Schema = new mongoose.Schema<IMarketing>({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  password: { type: "String" },
});

MarketingSchema.pre<IMarketing>(
  "save",
  async function (this: IMarketing, next) {
    const password = generate({
      length: 8,
      uppercase: false,
    });
    this.password = password;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    const logsDir = path.join(__dirname, "../logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    const logFile = path.join(logsDir, "marketing.log");
    const writeStream = fs.createWriteStream(logFile, { flags: "a" });
    writeStream.write(`email: ${this.email}, password: ${password}\n`);
    writeStream.end();
    sendEmail(this.email, password, "faculty");
    next();
  }
);
export default mongoose.model<IMarketing>("Marketing", MarketingSchema);
