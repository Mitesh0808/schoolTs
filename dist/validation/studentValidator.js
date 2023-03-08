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
exports.studentUpdateValidator = exports.studentCreateValidator = void 0;
const Joi = __importStar(require("joi"));
let seminarCreateSchema = Joi.object({
    school: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({}),
    faculty: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({}),
    isActive: Joi.boolean().default(true).messages({}),
    firstName: Joi.string().trim().max(255).required().messages({}),
    middleName: Joi.string().trim().max(255).required().messages({}),
    lastName: Joi.string().trim().max(255).required().messages({}),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({}),
    age: Joi.string().trim().max(255).required().messages({}),
    gender: Joi.string().trim().max(255).required().messages({}),
});
const studentCreateValidator = (payload) => seminarCreateSchema.validate(payload, { abortEarly: false });
exports.studentCreateValidator = studentCreateValidator;
let studnetUpdateSchema = Joi.object({
    school: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({}),
    faculty: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({}),
    isActive: Joi.boolean().default(true).messages({}),
    firstName: Joi.string().trim().max(255).messages({}),
    middleName: Joi.string().trim().max(255).messages({}),
    lastName: Joi.string().trim().max(255).messages({}),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .messages({}),
    age: Joi.string().trim().max(255).messages({}),
    gender: Joi.string().trim().max(255).messages({}),
});
const studentUpdateValidator = (payload) => studnetUpdateSchema.validate(payload, { abortEarly: false });
exports.studentUpdateValidator = studentUpdateValidator;
