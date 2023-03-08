import mongoose, { Schema, Document, Types } from "mongoose";
import { generate } from "generate-password";
import fs from "fs";
import path from "path";
const bcrypt = require("bcryptjs");
import { sendEmail } from "../utils/mailer";
// //isActive,email,school

export interface IFinance extends Document {
  isActive: boolean;
  email: string;
  password: string;
  school: Types.ObjectId;
}
const FinanceSchema: Schema = new mongoose.Schema<IFinance>({
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

FinanceSchema.pre<IFinance>("save", async function (this: IFinance, next) {
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
  const logFile = path.join(logsDir, "finance.log");
  const writeStream = fs.createWriteStream(logFile, { flags: "a" });
  writeStream.write(`email: ${this.email}, password: ${password}\n`);
  writeStream.end();
  sendEmail(this.email, password, "faculty");
  next();
});
export default mongoose.model<IFinance>("Finance", FinanceSchema);

// // 3. Finance :- [isActive: Boolean,-
// //     email:  String,-
// //     school: ID from school table]-

// const FinanceSchema = new mongoose.Schema({
//   school: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "School",
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: [
//       /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//       "Please enter a valid email",
//     ],
//   },
//   password: { type: "String" },
// });
// FinanceSchema.pre("save", async function (next) {
//   const password = generator.generate({
//     length: 8,
//     uppercase: false,
//   });
//   console.log(password);
//   this.password = password;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   const logsDir = path.join(__dirname, "../logs");
//   if (!fs.existsSync(logsDir)) {
//     fs.mkdirSync(logsDir);
//   }
//   const logFile = path.join(logsDir, "Finance.log");
//   const writeStream = fs.createWriteStream(logFile, { flags: "a" });
//   writeStream.write(`email: ${this.email}, password: ${password}\n`);
//   writeStream.end();
//   sendEmail(this.email, password, "finance");
//   next();
// });
// module.exports = mongoose.model("Finance", FinanceSchema);
