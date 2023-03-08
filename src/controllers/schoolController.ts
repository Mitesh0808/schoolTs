import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import {
  schoolCreateValidator,
  schoolUpdateValidator,
} from "../validation/schoolValidator";
import Request from "../interface";

import { School, Admin, AdminToken, LogHistory } from "../model/";
import { idValidator, loginValidator } from "../validation";
import { comparePassword } from "../utils/checkPassword";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token";
import { client } from "../utils/redis";
const schoolKey = "school";

export const getAllSchool = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const cachedSchool = await client.get(schoolKey);
      if (cachedSchool !== null) {
        res.status(200).send(JSON.parse(cachedSchool));
        return;
      }
      const schools = await School.find({});
      await client.set(schoolKey, JSON.stringify(schools), "EX", 3600);

      res.status(StatusCodes.OK).send(schools);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching all School");
    }
  }
);
export const createSchool = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = schoolCreateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const school = await School.create(value);
      const admin = await Admin.create({
        school: school._id,
        email: school.email,
      });
      await client.del(schoolKey);
      res.status(StatusCodes.CREATED).send(school);
    } catch (error) {
      console.log(error);
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while creating school");
    }
  }
);
export const getSchool = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const school = await School.findById(id);
      res.status(StatusCodes.OK).send(school);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching  school");
    }
  }
);
export const updateSchool = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    {
      const { error, value } = idValidator({ id });
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
        return;
      }
    }
    const { error, value } = schoolUpdateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }

    try {
      const updatedSchool = await School.findOneAndUpdate({ _id: id }, value, {
        new: true,
        runValidators: true,
      });
      await client.del(schoolKey);
      res.status(StatusCodes.OK).send(updatedSchool);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while updating school");
    }
  }
);

export const deleteSchool = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const school = await School.findByIdAndDelete(id);
      if (!school) {
        res.status(StatusCodes.NOT_FOUND).send("School not found");
        return;
      }
      await client.del(schoolKey);
      res.status(StatusCodes.OK).send("School deleted successfully");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while deleting School");
    }
  }
);
export const disableSchool = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const school = await School.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      const admin = await Admin.findOneAndUpdate(
        { schoolId: id },
        { isActive: false },
        { new: true }
      );
      await client.del(schoolKey);
      res
        .status(StatusCodes.OK)
        .send("School and associated admin disabled successfully");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while disabling school and associated admin");
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
    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(401).send("Invalid email or password");
      return;
    }
    const isMatch = await comparePassword(password, admin.password);
    if (isMatch) {
      const accessToken = generateAccessToken({
        email: admin.email,
        role: "schoolAdmin",
        Id: admin._id,
      });
      const refreshToken = generateRefreshToken({
        email: admin.email,
        role: "schoolAdmin",
        Id: admin._id,
      });
      const adminToken = await AdminToken.create({
        accessToken,
        refreshToken,
        Id: admin._id,
      });
      const logHistory = await LogHistory.create({
        adminID: admin._id,
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
    const adminToken = await AdminToken.findOneAndDelete({
      accessToken: req.cookies.accessToken,
    });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  }
);

export const allLogout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const adminToken = await AdminToken.deleteMany({ Id: req.decoded?.Id });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  }
);
