"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolUpdateValidator = exports.schoolCreateValidator = void 0;
const Joi = __importStar(require("joi"));
let schoolCreateSchema = Joi.object({
    isActive: Joi.boolean().default(true).messages({}),
    email: Joi.string()
        .email({ tlds: { allow: true } })
        .required()
        .messages({}),
    schoolName: Joi.string().trim().max(255).required().messages({}),
    phoneNo: Joi.string()
        .trim()
        .pattern(/^(\+\d{1,2}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/)
        .required()
        .messages({}),
});
const schoolCreateValidator = (payload) => schoolCreateSchema.validate(payload, { abortEarly: false });
exports.schoolCreateValidator = schoolCreateValidator;
let schoolUpdateSchema = Joi.object({
    isActive: Joi.boolean().default(true).messages({}),
    email: Joi.string()
        .email({ tlds: { allow: true } })
        .messages({}),
    schoolName: Joi.string().trim().max(255).messages({}),
    phoneNo: Joi.string()
        .trim()
        .pattern(/^(\+\d{1,2}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/)
        .messages({}),
});
const schoolUpdateValidator = (payload) => schoolUpdateSchema.validate(payload, { abortEarly: false });
exports.schoolUpdateValidator = schoolUpdateValidator;
