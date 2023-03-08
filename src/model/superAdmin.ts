// // 11. Super admin module & JWT token
// // • add access and refresh tokens with login.
// // • superadmin :- [email: String,
// //  password: String]
import mongoose, { Schema, Document } from "mongoose";
import { generate } from "generate-password";
import fs from "fs";
import path from "path";
const bcrypt = require("bcryptjs");
import { sendEmail } from "../utils/mailer";

export interface ISuperAdmin extends Document {
  email: string;
  password: string;
}
const SuperAdminSchema: Schema = new mongoose.Schema<ISuperAdmin>({
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
SuperAdminSchema.pre<ISuperAdmin>(
  "save",
  async function (this: ISuperAdmin, next) {
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
    const logFile = path.join(logsDir, "SuperAdmin.log");
    const writeStream = fs.createWriteStream(logFile, { flags: "a" });
    writeStream.write(`email: ${this.email}, password: ${password}\n`);
    writeStream.end();
    this.$locals = {
      plainPassword: password,
    };
    next();
  }
);

SuperAdminSchema.post("save", async function (doc, next) {
  sendEmail(this.email, doc.$locals.plainPassword as string, "superAdmin");
  next();
});
export default mongoose.model<ISuperAdmin>("SuperAdmin", SuperAdminSchema);
