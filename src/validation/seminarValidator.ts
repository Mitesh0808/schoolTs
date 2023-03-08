import * as Joi from "joi";
//isActive,presenter,description,link,dateTime
interface Icreateseminar {
  presenter: string;
  isActive: boolean;
  description: string;
  link: string;
  dateTime: string;
}
let seminarCreateSchema = Joi.object<Icreateseminar>({
  isActive: Joi.boolean().default(true).messages({}),
  presenter: Joi.string().max(50).required().messages({}),
  description: Joi.string().max(255).required().messages({}),
  dateTime: Joi.string().max(50).required().messages({}),
  link: Joi.string().max(255).required().messages({}),
});
export const seminarCreateValidator = (payload: Icreateseminar) =>
  seminarCreateSchema.validate(payload, { abortEarly: false });
interface Iupdateseminar {
  presenter?: string;
  isActive?: boolean;
  description?: string;
  link?: string;
  dateTime?: string;
}

let seminarUpdateSchema = Joi.object<Iupdateseminar>({
  isActive: Joi.boolean().default(true).messages({}),
  presenter: Joi.string().max(50).messages({}),
  description: Joi.string().max(255).messages({}),
  dateTime: Joi.string().max(50).messages({}),
  link: Joi.string().max(255).messages({}),
});
export const seminarUpdateValidator = (payload: Iupdateseminar) =>
  seminarUpdateSchema.validate(payload, { abortEarly: false });
