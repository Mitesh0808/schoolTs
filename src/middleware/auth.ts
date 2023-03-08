// authMiddleware, AccessTokenGenerate
import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Request from "../interface";
import { setAccessTokenCookie, generateAccessToken } from "../utils/token";
import { SuperAdminToken, AdminToken } from "../model";
interface DecodedToken {
  email: string;
  role: string;
  Id: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken: string | undefined =
    req.headers.authorization || req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({
      message:
        "Access token missing please login again/or generate access token again",
    });
  }
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN as string
    ) as DecodedToken;
    req.decoded = decoded;
    //superAdmin !=superAdmin(false)&& undefiend != schoolAdmin(on superadmin login always true)
    if (decoded.role != "superAdmin" && decoded.role != "schoolAdmin") {
      return res.status(401).json({ message: "Unauthorized 1" });
    }
    //check for vaild token here
    if (decoded.role === "superAdmin") {
      const superAdminToken = await SuperAdminToken.findOne({ accessToken });
      if (!superAdminToken) {
        console.log("access token of SuperAdmin is not present in Db");
        throw new Error("access token of SuperAdmin is not present in Db");
      }
    } else {
      const adminToken = await AdminToken.findOne({ accessToken });
      if (!adminToken) {
        console.log("access token of Admin is not present in Db");
        throw new Error("access token of Admin is not present in Db");
      }
    }
    req.needAccessToken = false;
    next();
  } catch (error) {
    req.needAccessToken = true;
    next();
  }
};
export const accessTokenGenerate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.needAccessToken) {
    const refreshToken = req.headers.authorization || req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message:
          "Access token missing please login again/or generate access token again",
      });
    }
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN as string
      ) as DecodedToken;
      if (decoded.role !== "superAdmin" && decoded.role !== "schoolAdmin") {
        return res.status(401).json({ message: "isSuperAdmin Unauthorized" });
      }
      if (decoded.role === "superAdmin") {
        const superAdminToken = await SuperAdminToken.findOne({ refreshToken });
        if (!superAdminToken) {
          console.log("superAdminToken not found in db");
          throw new Error("access token of SuperAdmin is not present in Db");
        }
        const accessToken = generateAccessToken({
          email: decoded.email,
          role: "superAdmin",
          Id: superAdminToken.Id.toString(),
        });
        const updatedToken = await SuperAdminToken.findOneAndUpdate(
          { refreshToken },
          { accessToken: accessToken }
        );
        setAccessTokenCookie(res, accessToken);
      } else {
        const adminToken = await AdminToken.findOne({
          refreshToken: refreshToken,
        });
        if (!adminToken) {
          console.log("adminToken not found in db");
          throw new Error("access token of Admin is not present in Db");
        }
        const accessToken = generateAccessToken({
          email: decoded.email,
          role: "schoolAdmin",
          Id: adminToken.Id.toString(),
        });
        const updatedToken = await AdminToken.findOneAndUpdate(
          { refreshToken },
          { accessToken: accessToken }
        );
        setAccessTokenCookie(res, accessToken);
      }
      req.decoded = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "AccessTokenGenerate middleware error",
      });
    }
  } else {
    next();
  }
};

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
