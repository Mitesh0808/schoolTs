"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenGenerate = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("../utils/token");
const model_1 = require("../model");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers.authorization || req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({
            message: "Access token missing please login again/or generate access token again",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN);
        req.decoded = decoded;
        //superAdmin !=superAdmin(false)&& undefiend != schoolAdmin(on superadmin login always true)
        if (decoded.role != "superAdmin" && decoded.role != "schoolAdmin") {
            return res.status(401).json({ message: "Unauthorized 1" });
        }
        //check for vaild token here
        if (decoded.role === "superAdmin") {
            const superAdminToken = yield model_1.SuperAdminToken.findOne({ accessToken });
            if (!superAdminToken) {
                console.log("access token of SuperAdmin is not present in Db");
                throw new Error("access token of SuperAdmin is not present in Db");
            }
        }
        else {
            const adminToken = yield model_1.AdminToken.findOne({ accessToken });
            if (!adminToken) {
                console.log("access token of Admin is not present in Db");
                throw new Error("access token of Admin is not present in Db");
            }
        }
        req.needAccessToken = false;
        next();
    }
    catch (error) {
        req.needAccessToken = true;
        next();
    }
});
exports.authMiddleware = authMiddleware;
const accessTokenGenerate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.needAccessToken) {
        const refreshToken = req.headers.authorization || req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Access token missing please login again/or generate access token again",
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN);
            if (decoded.role !== "superAdmin" && decoded.role !== "schoolAdmin") {
                return res.status(401).json({ message: "isSuperAdmin Unauthorized" });
            }
            if (decoded.role === "superAdmin") {
                const superAdminToken = yield model_1.SuperAdminToken.findOne({ refreshToken });
                if (!superAdminToken) {
                    console.log("superAdminToken not found in db");
                    throw new Error("access token of SuperAdmin is not present in Db");
                }
                const accessToken = (0, token_1.generateAccessToken)({
                    email: decoded.email,
                    role: "superAdmin",
                    Id: superAdminToken.Id.toString(),
                });
                const updatedToken = yield model_1.SuperAdminToken.findOneAndUpdate({ refreshToken }, { accessToken: accessToken });
                (0, token_1.setAccessTokenCookie)(res, accessToken);
            }
            else {
                const adminToken = yield model_1.AdminToken.findOne({
                    refreshToken: refreshToken,
                });
                if (!adminToken) {
                    console.log("adminToken not found in db");
                    throw new Error("access token of Admin is not present in Db");
                }
                const accessToken = (0, token_1.generateAccessToken)({
                    email: decoded.email,
                    role: "schoolAdmin",
                    Id: adminToken.Id.toString(),
                });
                const updatedToken = yield model_1.AdminToken.findOneAndUpdate({ refreshToken }, { accessToken: accessToken });
                (0, token_1.setAccessTokenCookie)(res, accessToken);
            }
            req.decoded = decoded;
            next();
        }
        catch (error) {
            return res.status(401).json({
                message: "AccessTokenGenerate middleware error",
            });
        }
    }
    else {
        next();
    }
});
exports.accessTokenGenerate = accessTokenGenerate;
// const AccessTokenGenerate = async (req, res, next) => {
//   if (req.needAccessToken) {
//     const refreshToken = req.headers.authorization || req.cookies.refreshToken;
//     if (!refreshToken) {
//       return res.status(401).json({
//         message:
//           "Access token missing please login again/or generate access token again",
//       });
//     }
//     try {
//       const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
//       if (decoded.role !== "superAdmin" && decoded.role !== "schoolAdmin") {
//         return res.status(401).json({ message: "isSuperAdmin Unauthorized" });
//       }
//       // console.log(decoded);
//       if (decoded.role === "superAdmin") {
//         const superAdminToken = await SuperAdminToken.findOne({ refreshToken });
//         // console.log("Check point ");
//         if (superAdminToken.length < 1) {
//           console.log("superAdminToken not found in db");
//           throw new Error("access token of SuperAdmin is not present in Db");
//         }
//         const accessToken = generateAccessToken({
//           email: decoded.email,
//           role: "superAdmin",
//           Id: decoded._id,
//         });
//         // console.log("Check point 2");
//         const updatedToken = await SuperAdminToken.findOneAndUpdate(
//           { refreshToken },
//           { accessToken: accessToken }
//         );
//         // console.log("Check point 3");
//         setAccessTokenCookie(res, accessToken);
//       } else {
//         // console.log(refreshToken);
//         const adminToken = await AdminToken.findOne({
//           refreshToken: refreshToken,
//         });
//         if (adminToken.length < 1) {
//           console.log("adminToken not found in db");
//           throw new Error("access token of Admin is not present in Db");
//         }
//         const accessToken = generateAccessToken({
//           email: decoded.email,
//           role: "schoolAdmin",
//           Id: decoded._id,
//         });
//         const updatedToken = await AdminToken.findOneAndUpdate(
//           { refreshToken },
//           { accessToken: accessToken }
//         );
//         setAccessTokenCookie(res, accessToken);
//       }
//       req.decoded = decoded;
//       next();
//     } catch (error) {
//       return res.status(401).json({
//         message: "AccessTokenGenerate middleware error",
//       });
//     }
//   } else {
//     next();
//   }
// };
