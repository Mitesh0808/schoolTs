"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CourseSchema = new mongoose_1.default.Schema({
    isActive: {
        type: Boolean,
        default: true,
    },
    courseName: {
        type: String,
        trim: true,
        maxLength: [100, "coursename should be less than 50 characters"],
        required: [true, "please provide coursename"],
    },
    description: {
        type: String,
        trim: true,
        maxLength: [200, "description should be less than 200 characters"],
        required: [true, "must provide description"],
    },
    // changes are required on basis of the type
    fees: {
        type: String,
        trim: true,
        maxLength: [100, "fees should be less than 100 characters"],
        required: [true, " provide fees"],
    },
    duration: {
        type: String,
        trim: true,
        maxLength: [50, "duration should be less than 50 characters"],
        required: [true, " provide duration"],
    },
    school: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "School",
    },
});
exports.default = mongoose_1.default.model("Course", CourseSchema);
