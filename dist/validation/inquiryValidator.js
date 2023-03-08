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
exports.inquiryUpdateValidator = exports.inquiryCreateValidator = void 0;
// inquiryCreateValidator
//school,//firstName,lastName,email,subject,message
const Joi = __importStar(require("joi"));
let inquiryCreateSchema = Joi.object({
    school: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({}),
    firstName: Joi.string().max(255).trim().required().messages({}),
    lastName: Joi.string().max(255).trim().required().messages({}),
    email: Joi.string().email().required().messages({}),
    subject: Joi.string().max(255).trim().required().messages({}),
    message: Joi.string().max(255).trim().required().messages({}),
});
const inquiryCreateValidator = (payload) => inquiryCreateSchema.validate(payload, { abortEarly: false });
exports.inquiryCreateValidator = inquiryCreateValidator;
let inquiryUpdateSchema = Joi.object({
    school: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({}),
    firstName: Joi.string().max(255).trim().messages({}),
    lastName: Joi.string().max(255).trim().messages({}),
    email: Joi.string().email().messages({}),
    subject: Joi.string().max(255).trim().messages({}),
    message: Joi.string().max(255).trim().messages({}),
});
const inquiryUpdateValidator = (payload) => inquiryUpdateSchema.validate(payload, { abortEarly: false });
exports.inquiryUpdateValidator = inquiryUpdateValidator;
