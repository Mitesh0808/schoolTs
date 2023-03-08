import * as Joi from "joi";
// //school,faculty,isActive,firstName,middleName,lastName,email,age,gender
interface Icreatestudent {
  school: string;
  isActive: boolean;
  faculty: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  age: string;
  gender: string;
}
let seminarCreateSchema = Joi.object<Icreatestudent>({
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
export const studentCreateValidator = (payload: Icreatestudent) =>
  seminarCreateSchema.validate(payload, { abortEarly: false });

interface Iupdatestudent {
  school?: string;
  isActive?: boolean;
  faculty?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  age?: string;
  gender?: string;
}

let studnetUpdateSchema = Joi.object<Iupdatestudent>({
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
export const studentUpdateValidator = (payload: Iupdatestudent) =>
  studnetUpdateSchema.validate(payload, { abortEarly: false });
