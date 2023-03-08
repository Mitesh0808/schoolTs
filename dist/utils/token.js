"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.setRefreshTokenCookie = exports.setAccessTokenCookie = exports.generateRefreshToken = void 0;
// generateRefreshToken,generateAccessToken,setRefreshTokenCookie,setAccessTokenCookie
// const { sign } = require("jsonwebtoken");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateRefreshToken = (payload) => {
    const secret = process.env.REFRESH_TOKEN;
    const token = (0, jsonwebtoken_1.sign)(payload, secret, { expiresIn: "30d" });
    return token;
};
exports.generateRefreshToken = generateRefreshToken;
const setAccessTokenCookie = (res, token) => {
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
    });
};
exports.setAccessTokenCookie = setAccessTokenCookie;
const setRefreshTokenCookie = (res, token) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: true,
    });
};
exports.setRefreshTokenCookie = setRefreshTokenCookie;
const generateAccessToken = (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, process.env.ACCESS_TOKEN, {
        expiresIn: "5m",
    });
};
exports.generateAccessToken = generateAccessToken;
