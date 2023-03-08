import * as Joi from "joi";
// //isActive,email,school

interface Icreatemarketing {
  school: string;
  isActive: boolean;
  email: string;
}
let marketingCreateSchema = Joi.object<Icreatemarketing>({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({}),
  isActive: Joi.boolean().default(true).messages({}),
  email: Joi.string().email().required().messages({}),
});
export const marketingCreateValidator = (payload: Icreatemarketing) =>
  marketingCreateSchema.validate(payload, { abortEarly: false });
interface Iupdatemarketing {
  school?: string;
  isActive?: boolean;
  email?: string;
}

let marketingUpdateSchema = Joi.object<Iupdatemarketing>({
  school: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({}),
  isActive: Joi.boolean().messages({}),
  email: Joi.string().email().messages({}),
});
export const marketingUpdateValidator = (payload: Iupdatemarketing) =>
  marketingUpdateSchema.validate(payload, { abortEarly: false });

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
