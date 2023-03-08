"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [( superadminID/adminID): ID from perticular table,
// accessToken: String,
// refreshToken: String,
// isValid: Boolean, default: true]
const mongoose_1 = __importDefault(require("mongoose"));
const SuperAdminToken = new mongoose_1.default.Schema({
    isValid: {
        type: Boolean,
        default: true,
    },
    Id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "SuperAdmin",
    },
    refreshToken: { type: String, required: true },
    accessToken: { type: String, required: true },
});
exports.default = mongoose_1.default.model("SuperAdminToken", SuperAdminToken);
