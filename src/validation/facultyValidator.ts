import * as Joi from "joi";

import { Types } from "mongoose";

//isActive,school,courseName,description,fees,duration
interface Icreatefaculty {
  school: string;
  isActive: boolean;
  phoneNo: string;
  description: string;
  fullName: string;
  email: string;
}
let facultyCreateSchema = Joi.object<Icreatefaculty>({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({}),
  isActive: Joi.boolean().default(true).messages({}),
  fullName: Joi.string().max(100).required().messages({}),
  email: Joi.string().email().required().messages({}),
  phoneNo: Joi.string()
    .pattern(
      new RegExp(
        /^(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/
      )
    )
    .required()
    .messages({}),
});
export const facultyCreateValidator = (payload: Icreatefaculty) =>
  facultyCreateSchema.validate(payload, { abortEarly: false });
interface Iupdatefaculty {
  school?: string;
  isActive?: boolean;
  phoneNo?: string;
  description?: string;
  fullName?: string;
  email?: string;
}

let facultyUpdateSchema = Joi.object<Iupdatefaculty>({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({}),
  isActive: Joi.boolean().default(true).messages({}),
  fullName: Joi.string().max(100).messages({}),
  email: Joi.string().email().messages({}),
  phoneNo: Joi.string()
    .pattern(
      new RegExp(
        /^(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/
      )
    )
    .messages({}),
});
export const facultyUpdateValidator = (payload: Iupdatefaculty) =>
  facultyUpdateSchema.validate(payload, { abortEarly: false });
