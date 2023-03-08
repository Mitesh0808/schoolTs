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
exports.seminarUpdateValidator = exports.seminarCreateValidator = void 0;
const Joi = __importStar(require("joi"));
let seminarCreateSchema = Joi.object({
    isActive: Joi.boolean().default(true).messages({}),
    presenter: Joi.string().max(50).required().messages({}),
    description: Joi.string().max(255).required().messages({}),
    dateTime: Joi.string().max(50).required().messages({}),
    link: Joi.string().max(255).required().messages({}),
});
const seminarCreateValidator = (payload) => seminarCreateSchema.validate(payload, { abortEarly: false });
exports.seminarCreateValidator = seminarCreateValidator;
let seminarUpdateSchema = Joi.object({
    isActive: Joi.boolean().default(true).messages({}),
    presenter: Joi.string().max(50).messages({}),
    description: Joi.string().max(255).messages({}),
    dateTime: Joi.string().max(50).messages({}),
    link: Joi.string().max(255).messages({}),
});
const seminarUpdateValidator = (payload) => seminarUpdateSchema.validate(payload, { abortEarly: false });
exports.seminarUpdateValidator = seminarUpdateValidator;
