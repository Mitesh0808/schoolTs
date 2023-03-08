// inquiryCreateValidator
//school,//firstName,lastName,email,subject,message
import * as Joi from "joi";

interface Icreateinquiry {
  school: string;
  message: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
}
let inquiryCreateSchema = Joi.object<Icreateinquiry>({
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
export const inquiryCreateValidator = (payload: Icreateinquiry) =>
  inquiryCreateSchema.validate(payload, { abortEarly: false });
interface Iupdateinquiry {
  school?: string;
  message?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
}

let inquiryUpdateSchema = Joi.object<Iupdateinquiry>({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({}),
  firstName: Joi.string().max(255).trim().messages({}),
  lastName: Joi.string().max(255).trim().messages({}),
  email: Joi.string().email().messages({}),
  subject: Joi.string().max(255).trim().messages({}),
  message: Joi.string().max(255).trim().messages({}),
});
export const inquiryUpdateValidator = (payload: Iupdateinquiry) =>
  inquiryUpdateSchema.validate(payload, { abortEarly: false });
