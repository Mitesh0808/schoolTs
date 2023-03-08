import * as Joi from "joi";

// //isActive,email,school
interface Icreatefinance {
  school: string;
  isActive: boolean;
  email: string;
}
let financeCreateSchema = Joi.object<Icreatefinance>({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({}),
  isActive: Joi.boolean().default(true).messages({}),
  email: Joi.string().email().required().messages({}),
});
export const financeCreateValidator = (payload: Icreatefinance) =>
  financeCreateSchema.validate(payload, { abortEarly: false });
interface Iupdatefinance {
  school?: string;
  isActive?: boolean;
  email?: string;
}

let financeUpdateSchema = Joi.object<Iupdatefinance>({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({}),
  isActive: Joi.boolean().default(true).messages({}),
  email: Joi.string().email().messages({}),
});
export const financeUpdateValidator = (payload: Iupdatefinance) =>
  financeUpdateSchema.validate(payload, { abortEarly: false });
