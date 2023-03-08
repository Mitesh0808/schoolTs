"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const InquirySchema = new mongoose_1.default.Schema({
    school: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "School",
    },
    firstName: {
        type: String,
        trim: true,
        maxLength: [255, "firstName should be less than 50 characters"],
        required: [true, "must provide fullName"],
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: [255, "lastName should be less than 50 characters"],
        required: [true, "must provide fullName"],
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
    subject: {
        type: String,
        trim: true,
        maxLength: [255, "subject should be less than 50 characters"],
        required: [true, "must provide fullName"],
    },
    message: {
        type: String,
        trim: true,
        maxLength: [255, "subject should be less than 50 characters"],
        required: [true, "must provide fullName"],
    },
});
exports.default = mongoose_1.default.model("Inquiry", InquirySchema);
