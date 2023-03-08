import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { LogHistory, SuperAdmin, SuperAdminToken } from "../model/";
import { emailValidator, idValidator, loginValidator } from "../validation";
import { comparePassword } from "../utils/checkPassword";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token";
import Request from "../interface";
// getAllSuperAdmin,
// createSuperAdmin,
// getSuperAdmin,
// updateSuperAdmin,
// deleteSuperAdmin,
// authUser,
// logout,
// allLogout,

export const getAllSuperAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const schools = await SuperAdmin.find({});
      res.status(StatusCodes.OK).send(schools);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching all superAdmin");
    }
  }
);
export const createSuperAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = emailValidator(req.body);
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const superAdmin = await SuperAdmin.create(value);
      res.status(StatusCodes.OK).send(superAdmin);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching  superAdmin");
    }
  }
);
export const getSuperAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const superAdmin = await SuperAdmin.findById(id);
      res.status(StatusCodes.OK).send(superAdmin);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching  superAdmin");
    }
  }
);
export const updateSuperAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { error, value } = idValidator({ id });
      if (error) {
        res.status(400).send(error);
        return;
      }
      const updatedMarketing = await SuperAdmin.findOneAndUpdate(
        { _id: id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(StatusCodes.OK).send(updatedMarketing);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while updating marketing");
    }
  }
);
export const deleteSuperAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const superAdmin = await SuperAdmin.findByIdAndDelete(id);
      if (!superAdmin) {
        res.status(StatusCodes.NOT_FOUND).send("superAdmin not found");
        return;
      }
      res.status(StatusCodes.OK).send("superAdmin deleted successfully");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while deleting superAdmin");
    }
  }
);
export const authUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = loginValidator(req.body);
    if (error) {
      res.status(400).send(error);
      return;
    }
    const { email, password } = req.body;
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      res.status(401).send("Invalid email or password");
      return;
    }
    const isMatch = await comparePassword(password, superAdmin.password);
    if (isMatch) {
      const accessToken = generateAccessToken({
        email: superAdmin.email,
        role: "superAdmin",
        Id: superAdmin._id,
      });
      const refreshToken = generateRefreshToken({
        email: superAdmin.email,
        role: "superAdmin",
        Id: superAdmin._id,
      });
      const adminToken = await SuperAdminToken.create({
        accessToken,
        refreshToken,
        Id: superAdmin._id,
      });
      const logHistory = await LogHistory.create({
        superAdminID: superAdmin._id,
        browser: req.headers["sec-ch-ua"],
      });

      setRefreshTokenCookie(res, refreshToken);
      setAccessTokenCookie(res, accessToken);
      res.status(StatusCodes.OK).send({ message: "Login successful" });
    } else {
      res.status(401).send("Invalid email or password");
    }
  }
);
export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const adminToken = await SuperAdminToken.findOneAndDelete({
      accessToken: req.cookies.accessToken,
    });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  }
);
export const allLogout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const adminToken = await SuperAdminToken.deleteMany({
      Id: req.decoded?.Id,
    });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  }
);
