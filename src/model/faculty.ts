import mongoose, { Schema, Document, Types } from "mongoose";
import { generate } from "generate-password";
import fs from "fs";
import path from "path";
const bcrypt = require("bcryptjs");
import { sendEmail } from "../utils/mailer";

// 1. course :- [isActive: Boolean,-
//     school: ID from school table,-
//     courseName: String,-
//     description:  String,-
//     fees:  String,-
//     duration:  String]-
//isActive,school,courseName,description,fees,duration
export interface IFaculty extends Document {
  isActive: boolean;
  fullName: string;
  email: string;
  password: string;
  phoneNo: string;
  school: Types.ObjectId;
}
const FacultySchema: Schema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  fullName: {
    type: String,
    trim: true,
    maxLength: [255, "coursename should be less than 50 characters"],
    required: [true, "please provide coursename"],
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
  phoneNo: {
    type: String,
    trim: true,
    match: [
      /^(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/,
      "Please enter a valid phone number",
    ],
    required: [true, "must provide PhoneNo"],
  },
});

FacultySchema.pre<IFaculty>("save", async function (this: IFaculty, next) {
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
  const logFile = path.join(logsDir, "faculty.log");
  const writeStream = fs.createWriteStream(logFile, { flags: "a" });
  writeStream.write(`email: ${this.email}, password: ${password}\n`);
  writeStream.end();
  sendEmail(this.email, password, "faculty");
  next();
});
export default mongoose.model<IFaculty>("Faculty", FacultySchema);
