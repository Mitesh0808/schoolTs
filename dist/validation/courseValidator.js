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
exports.validateCourseUpdate = exports.validateCourseCreate = void 0;
const Joi = __importStar(require("joi"));
let courseCreateValidator = Joi.object({
    isActive: Joi.boolean().default(true),
    courseName: Joi.string().trim().max(255).required().messages({}),
    description: Joi.string().trim().max(255).required().messages({}),
    fees: Joi.string().trim().max(100).required().messages({}),
    duration: Joi.string().trim().max(50).required().messages({}),
    school: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({}),
});
const validateCourseCreate = (payload) => courseCreateValidator.validate(payload, { abortEarly: false });
exports.validateCourseCreate = validateCourseCreate;
let courseUpdateValidator = Joi.object({
    isActive: Joi.boolean().default(true).messages({}),
    courseName: Joi.string().trim().max(255).messages({}),
    description: Joi.string().trim().max(255).messages({}),
    fees: Joi.string().trim().max(100).messages({}),
    duration: Joi.string().trim().max(50).messages({}),
    school: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({}),
});
const validateCourseUpdate = (payload) => courseUpdateValidator.validate(payload, { abortEarly: false });
exports.validateCourseUpdate = validateCourseUpdate;
//joi.extractType<typeof user>
//school,isActive,fullName,email,phoneNo
// interface IFacultyCreate {
//   school: string;
//   isActive?: boolean;
//   fullName: string;
//   email: string;
//   phoneNo: string;
// }
// const facultyCreateSchema = Joi.object<IFacultyCreate>({
//   school: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .messages(),
//   isActive: Joi.boolean().default(true).messages(),
//   fullName: Joi.string().max(100).required().messages(),
//   email: Joi.string().email().required().messages(),
//   phoneNo: Joi.string()
//     .pattern(
//       new RegExp(
//         /^(\d{3}[-\s]?\d{3}[-\s]?\d{4}|(\d{3})\s\d{3}[-\s]?\d{4}|\d{10})$/
//       )
//     )
//     .required()
//     .messages(),
// });
// const validateFacultyCreate = (payload: IFacultyCreate) =>
//   facultyCreateSchema.validate(payload, { abortEarly: false });
