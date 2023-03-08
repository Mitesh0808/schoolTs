import mongoose, { Schema, Document, Types } from "mongoose";
import { generate } from "generate-password";
import fs from "fs";
import path from "path";
const bcrypt = require("bcryptjs");
// // Admin :- [isActive: Boolean,
// //     email: String,
// //     password: String,
// //     school: ID from school table]
import { sendEmail } from "../utils/mailer";
export interface IAdmin extends Document {
  email: string;
  password: string;
  isActive: boolean;
  school: Types.ObjectId;
}
const AdminSchema: Schema = new mongoose.Schema<IAdmin>({
  isActive: {
    type: Boolean,
    default: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  password: { type: "String" },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
});
AdminSchema.pre<IAdmin>("save", async function (this: IAdmin, next) {
  const password = generate({
    length: 8,
    uppercase: false,
  });
  console.log(password);
  this.password = password;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  const logsDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }
  const logFile = path.join(logsDir, "Admin.log");
  const writeStream = fs.createWriteStream(logFile, { flags: "a" });
  writeStream.write(`email: ${this.email}, password: ${password}\n`);
  writeStream.end();
  this.$locals = {
    plainPassword: password,
  };
  next();
});

AdminSchema.post("save", async function (doc, next) {
  sendEmail(this.email, doc.$locals.plainPassword as string, "schoolAdmin");
  next();
});
export default mongoose.model<IAdmin>("Admin", AdminSchema);
