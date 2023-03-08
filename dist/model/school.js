"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require("mongoose");
const mongoose_1 = __importDefault(require("mongoose"));
const SchoolSchema = new mongoose_1.default.Schema({
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
    schoolName: {
        type: String,
        trim: true,
        maxLength: [255, "coursename should be less than 50 characters"],
        required: [true, "please provide coursename"],
    },
    phoneNo: {
        type: String,
        trim: true,
        match: [
            /^(\+\d{1,2}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/,
            "Please enter a valid phone number",
        ],
        required: [true, "must provide PhoneNo"],
    },
});
exports.default = mongoose_1.default.model("School", SchoolSchema);
// const SchoolSchema = new mongoose.Schema({
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
//   schoolName: {
//     type: String,
//     trim: true,
//     maxLength: [255, "coursename should be less than 50 characters"],
//     required: [true, "please provide coursename"],
//   },
//   phoneNo: {
//     type: String,
//     trim: true,
//     match: [
//       /^(\+\d{1,2}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/,
//       "Please enter a valid phone number",
//     ],
//     required: [true, "must provide PhoneNo"],
//   },
// });
// module.exports = mongoose.model("School", SchoolSchema);
