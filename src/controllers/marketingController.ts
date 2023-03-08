import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import {
  marketingCreateValidator,
  marketingUpdateValidator,
} from "../validation/marketingValidator";
import Request from "../interface";
import { client } from "../utils/redis";
const marketingKey = "marketing";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token";
import { idValidator, loginValidator } from "../validation";
import { comparePassword } from "../utils/checkPassword";
import { Admin, Marketing } from "../model/";
import { Types } from "mongoose";
export const getAllMarketing = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const cachedMarketing = await client.get(marketingKey);
      if (cachedMarketing !== null) {
        res.status(200).send(JSON.parse(cachedMarketing));
        return;
      }
      const marketings = await Marketing.aggregate([
        {
          $lookup: {
            from: "schools",
            localField: "school",
            foreignField: "_id",
            as: "school",
          },
        },
        {
          $project: {
            isActive: 1,
            email: 1,
            school: {
              _id: 1,
              schoolName: 1,
            },
          },
        },
      ]);
      await client.set(marketingKey, JSON.stringify(marketings), "EX", 3600);
      res.status(StatusCodes.OK).send(marketings);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching all Marketing");
    }
  }
);
export const createMarketing = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = marketingCreateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const admin = (await Admin.findOne({ email: req.decoded?.email }).select({
        school: 1,
        _id: 0,
      })) as { school: Types.ObjectId };
      if (!admin.school) {
        res.status(StatusCodes.NOT_FOUND).send("School not found");
        return;
      }
      value.school = admin.school.toString();
      const marketing = await Marketing.create(value);
      await client.del(marketingKey);
      res.status(StatusCodes.CREATED).json(marketing);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while creating marketing");
    }
  }
);
export const getMarketing = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const marketing = await Marketing.findById(id);
      res.status(StatusCodes.OK).send(marketing);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching  marketing");
    }
  }
);
export const updateMarketing = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    {
      const { error, value } = idValidator({ id });
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
        return;
      }
    }
    const { error, value } = marketingUpdateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const updatedMarketing = await Marketing.findOneAndUpdate(
        { _id: id },
        value,
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(marketingKey);
      res.status(StatusCodes.OK).send(updatedMarketing);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while updating marketing");
    }
  }
);
export const deleteMarketing = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const marketing = await Marketing.findByIdAndDelete(id);
      if (!marketing) {
        res.status(StatusCodes.NOT_FOUND).send("Marketing not found");
        return;
      }
      await client.del(marketingKey);
      res.status(StatusCodes.OK).send("Marketing deleted successfully");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while deleting Marketing");
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
    const marketing = await Marketing.findOne({ email });
    if (!marketing) {
      res.status(401).send("Invalid email or password");
      return;
    }
    const isMatch = await comparePassword(password, marketing.password);
    if (isMatch) {
      const accessToken = generateAccessToken({
        email: marketing.email,
        role: "marketing",
        Id: marketing._id,
      });
      const refreshToken = generateRefreshToken({
        email: marketing.email,
        role: "marketing",
        Id: marketing._id,
      });
      setRefreshTokenCookie(res, refreshToken);
      setAccessTokenCookie(res, accessToken);
      res.status(StatusCodes.OK).send({ message: "Login successful" });
    } else {
      res.status(401).send("Invalid email or password");
    }
  }
);
export const disableMarketing = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const marketing = await Marketing.findOneAndUpdate(
        { _id: id },
        { isActive: false },
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(marketingKey);
      res.status(StatusCodes.OK).send("marketing is disabled");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error ocuured while marketing is disabled");
    }
  }
);
export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  }
);
