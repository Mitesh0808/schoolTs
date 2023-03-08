import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import {
  financeCreateValidator,
  financeUpdateValidator,
} from "../validation/financeValidator";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token";
import { idValidator, loginValidator } from "../validation";
import { comparePassword } from "../utils/checkPassword";
import { Admin, Finance } from "../model/";
import Request from "../interface";
import { client } from "../utils/redis";
import { Types } from "mongoose";
const financeKey = "finance";

export const getAllFinance = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const cachedFinance = await client.get(financeKey);
      // console.log(cachedCourses);
      if (cachedFinance !== null) {
        res.status(200).send(JSON.parse(cachedFinance));
        return;
      }
      const finances = await Finance.aggregate([
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
      await client.set(financeKey, JSON.stringify(finances), "EX", 3600);

      res.status(StatusCodes.OK).send(finances);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching all Finnace");
    }
  }
);
export const createFinance = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = financeCreateValidator(req.body);
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
      const finance = await Finance.create(value);
      await client.del(financeKey);

      res.status(StatusCodes.CREATED).json(finance);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while creating finance");
    }
  }
);
export const getFinance = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const finance = await Finance.findById(id);
      res.status(StatusCodes.OK).send(finance);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching  faculty");
    }
  }
);
export const updateFinance = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    {
      const { error, value } = idValidator({ id });
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
        return;
      }
    }
    const { error, value } = financeUpdateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const updatedFinance = await Finance.findOneAndUpdate(
        { _id: id },
        value,
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(financeKey);

      res.status(StatusCodes.OK).send(updatedFinance);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while updating finance");
    }
  }
);
export const deleteFinance = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const finance = await Finance.findByIdAndDelete(id);
      if (!finance) {
        res.status(StatusCodes.NOT_FOUND).send("Finnace not found");
        return;
      }
      await client.del(financeKey);
      res.status(StatusCodes.OK).send("Finnace deleted successfully");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while deleting Finnace");
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
    const finance = await Finance.findOne({ email });
    if (!finance) {
      res.status(401).send("Invalid email or password");
      return;
    }
    const isMatch = await comparePassword(password, finance.password);
    if (isMatch) {
      const accessToken = generateAccessToken({
        email: finance.email,
        role: "finance",
        Id: finance._id,
      });
      const refreshToken = generateRefreshToken({
        email: finance.email,
        role: "finance",
        Id: finance._id,
      });
      setRefreshTokenCookie(res, refreshToken);
      setAccessTokenCookie(res, accessToken);
      res.status(StatusCodes.OK).send({ message: "Login successful" });
    } else {
      res.status(401).send("Invalid email or password");
    }
  }
);
export const disableFinance = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const faculty = await Finance.findOneAndUpdate(
        { _id: id },
        { isActive: false },
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(financeKey);
      res.status(StatusCodes.OK).send("Faculty is disabled");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error ocuured while Faculty is disabled");
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
