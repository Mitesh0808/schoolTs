"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logSchema = new mongoose_1.default.Schema({
    superAdminID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "SuperAdmin" },
    adminID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Admin" },
    facultyID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Faculty" },
    financeID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Finance" },
    marketingID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Marketing" },
    studentID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Student" },
    property: { type: String },
    userAgent: { type: String },
    os: { type: String },
    browser: { type: String },
    device: { type: String },
    os_version: { type: String },
    browser_version: { type: String },
    deviceType: { type: String },
    orientation: { type: String },
    isDesktop: { type: Boolean },
    isMobile: { type: Boolean },
    isTablet: { type: Boolean },
    ip: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.default.model("LogHistory", logSchema);
