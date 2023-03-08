// generateRefreshToken,generateAccessToken,setRefreshTokenCookie,setAccessTokenCookie
// const { sign } = require("jsonwebtoken");
import { sign } from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
dotenv.config();
interface Itoken {
  email: string;
  role: string;
  Id: string;
}

export const generateRefreshToken = (payload: Itoken) => {
  const secret = process.env.REFRESH_TOKEN as string;
  const token = sign(payload, secret, { expiresIn: "30d" });
  return token;
};
export const setAccessTokenCookie = (res: Response, token: string) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: true,
  });
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
  });
};
export const generateAccessToken = (payload: Itoken) => {
  return sign(payload, process.env.ACCESS_TOKEN as string, {
    expiresIn: "5m",
  });
};
