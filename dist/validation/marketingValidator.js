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
exports.marketingUpdateValidator = exports.marketingCreateValidator = void 0;
const Joi = __importStar(require("joi"));
let marketingCreateSchema = Joi.object({
    school: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({}),
    isActive: Joi.boolean().default(true).messages({}),
    email: Joi.string().email().required().messages({}),
});
const marketingCreateValidator = (payload) => marketingCreateSchema.validate(payload, { abortEarly: false });
exports.marketingCreateValidator = marketingCreateValidator;
let marketingUpdateSchema = Joi.object({
    school: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({}),
    isActive: Joi.boolean().messages({}),
    email: Joi.string().email().messages({}),
});
const marketingUpdateValidator = (payload) => marketingUpdateSchema.validate(payload, { abortEarly: false });
exports.marketingUpdateValidator = marketingUpdateValidator;
// let marketingCreateValidator = Joi.object({
//   isActive: Joi.boolean().default(true).messages(),
//   school: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .messages(),
//   email: Joi.string().email().required().messages(),
// });
// const validator = (schema) => (payload) =>
//   schema.validate(payload, { abortEarly: false });
// marketingCreateValidator = validator(marketingCreateValidator);
// let marketingUpdateValidator = Joi.object({
//   isActive: Joi.boolean().default(true).messages(),
//   school: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .messages(),
//   email: Joi.string().email().messages(),
// });
// marketingUpdateValidator = validator(marketingUpdateValidator);
// module.exports = {
//   marketingCreateValidator,
//   marketingUpdateValidator,
// };
