import * as Joi from "joi";
// //isActive,email,schoolName,phoneNo
interface Icreateschool {
  schoolName: string;
  isActive: boolean;
  email: string;
  phoneNo: string;
}
let schoolCreateSchema = Joi.object<Icreateschool>({
  isActive: Joi.boolean().default(true).messages({}),
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .required()
    .messages({}),
  schoolName: Joi.string().trim().max(255).required().messages({}),
  phoneNo: Joi.string()
    .trim()
    .pattern(
      /^(\+\d{1,2}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/
    )
    .required()
    .messages({}),
});
export const schoolCreateValidator = (payload: Icreateschool) =>
  schoolCreateSchema.validate(payload, { abortEarly: false });
interface Iupdateschool {
  schoolName?: string;
  isActive?: boolean;
  email?: string;
  phoneNo?: string;
}

let schoolUpdateSchema = Joi.object<Iupdateschool>({
  isActive: Joi.boolean().default(true).messages({}),
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .messages({}),
  schoolName: Joi.string().trim().max(255).messages({}),
  phoneNo: Joi.string()
    .trim()
    .pattern(
      /^(\+\d{1,2}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/
    )
    .messages({}),
});
export const schoolUpdateValidator = (payload: Iupdateschool) =>
  schoolUpdateSchema.validate(payload, { abortEarly: false });
