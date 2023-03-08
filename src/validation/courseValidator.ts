import * as Joi from "joi";

import { Types } from "mongoose";

//isActive,school,courseName,description,fees,duration
interface Icreatecourse {
  school: string;
  isActive: boolean;
  courseName: string;
  description: string;
  fees: string;
  duration: string;
}
let courseCreateValidator = Joi.object<Icreatecourse>({
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
export const validateCourseCreate = (payload: Icreatecourse) =>
  courseCreateValidator.validate(payload, { abortEarly: false });
interface Iupdatecourse {
  school?: Types.ObjectId;
  isActive?: boolean;
  courseName?: string;
  description?: string;
  fees?: string;
  duration?: string;
}

let courseUpdateValidator = Joi.object<Iupdatecourse>({
  isActive: Joi.boolean().default(true).messages({}),
  courseName: Joi.string().trim().max(255).messages({}),
  description: Joi.string().trim().max(255).messages({}),
  fees: Joi.string().trim().max(100).messages({}),
  duration: Joi.string().trim().max(50).messages({}),
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({}),
});
export const validateCourseUpdate = (payload: Iupdatecourse) =>
  courseUpdateValidator.validate(payload, { abortEarly: false });

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
