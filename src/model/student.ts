// 8. student :- [school: ID from school table,
//     faculty:  ID from faculty table,
//     isActive: Boolean,-
//     firstName: String,-
//     middleName: String,-
//     lastName: String,-
//     email:  String,-
//     age: String,-
//     gender: String]-
//school,faculty,isActive,firstName,middleName,lastName,email,age,gender
import mongoose, { Schema, Document, Types } from "mongoose";
import { generate } from "generate-password";
import fs from "fs";
import path from "path";
const bcrypt = require("bcryptjs");
import { sendEmail } from "../utils/mailer";

export interface IStudnet extends Document {
  isActive: boolean;
  school: Types.ObjectId;
  faculty: Types.ObjectId;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  age: string;
  gender: string;
  password: string;
}

const StudentSchema: Schema = new mongoose.Schema<IStudnet>({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  firstName: {
    type: String,
    trim: true,
    maxLength: [255, "firstName should be less than 50 characters"],
    required: [true, "please provide coursename"],
  },
  middleName: {
    type: String,
    trim: true,
    maxLength: [255, "middleName should be less than 50 characters"],
    required: [true, "must provide description"],
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: [255, "middleName should be less than 50 characters"],
    required: [true, "must provide description"],
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
  age: {
    type: String,
    trim: true,
    maxLength: [255, "age should be less than 50 characters"],
    required: [true, "must provide description"],
  },
  gender: {
    type: String,
    trim: true,
    maxLength: [255, "gender should be less than 50 characters"],
    required: [true, "must provide description"],
  },
  password: { type: "String" },
});
StudentSchema.pre<IStudnet>("save", async function (this: IStudnet, next) {
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
  const logFile = path.join(logsDir, "school.log");
  const writeStream = fs.createWriteStream(logFile, { flags: "a" });
  writeStream.write(`email: ${this.email}, password: ${password}\n`);
  writeStream.end();
  sendEmail(this.email, password, "faculty");
  next();
});

export default mongoose.model<IStudnet>("Student", StudentSchema);
