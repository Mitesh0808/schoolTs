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
exports.facultyUpdateValidator = exports.facultyCreateValidator = void 0;
const Joi = __importStar(require("joi"));
let facultyCreateSchema = Joi.object({
    school: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({}),
    isActive: Joi.boolean().default(true).messages({}),
    fullName: Joi.string().max(100).required().messages({}),
    email: Joi.string().email().required().messages({}),
    phoneNo: Joi.string()
        .pattern(new RegExp(/^(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/))
        .required()
        .messages({}),
});
const facultyCreateValidator = (payload) => facultyCreateSchema.validate(payload, { abortEarly: false });
exports.facultyCreateValidator = facultyCreateValidator;
let facultyUpdateSchema = Joi.object({
    school: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({}),
    isActive: Joi.boolean().default(true).messages({}),
    fullName: Joi.string().max(100).messages({}),
    email: Joi.string().email().messages({}),
    phoneNo: Joi.string()
        .pattern(new RegExp(/^(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/))
        .messages({}),
});
const facultyUpdateValidator = (payload) => facultyUpdateSchema.validate(payload, { abortEarly: false });
exports.facultyUpdateValidator = facultyUpdateValidator;
