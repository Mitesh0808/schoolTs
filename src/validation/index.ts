import * as Joi from "joi";

import { Types } from "mongoose";

// idValidator
interface Iid {
  id: string;
}
let idVali = Joi.object<Iid>({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
export const idValidator = (payload: Iid) =>
  idVali.validate(payload, { abortEarly: false });
//loginvalidator
interface Ilogin {
  email: string;
  password: string;
}

let loginVali = Joi.object<Ilogin>({
  email: Joi.string().email().required().messages({}),
  password: Joi.string().required().messages({}),
});
export const loginValidator = (payload: Ilogin) =>
  loginVali.validate(payload, { abortEarly: false });

interface Iemail {
  email: string;
}
let emailVali = Joi.object<Iemail>({
  email: Joi.string().email().required().messages({}),
});
export const emailValidator = (payload: Iemail) =>
  emailVali.validate(payload, { abortEarly: false });
