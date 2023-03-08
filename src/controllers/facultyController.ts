import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { Admin, Faculty } from "../model/";
import { idValidator, loginValidator } from "../validation";
import { comparePassword } from "../utils/checkPassword";
import {
  facultyCreateValidator,
  facultyUpdateValidator,
} from "../validation/facultyValidator";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token";
import { Types } from "mongoose";
import Request from "../interface";
import { client } from "../utils/redis";
const facultyKey = "facultys";

//tested
export const getAllFaculty = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const cachedFaculty = await client.get(facultyKey);
      // console.log(cachedCourses);
      if (cachedFaculty !== null) {
        res.status(200).send(JSON.parse(cachedFaculty));
        return;
      }
      const faculty = await Faculty.aggregate([
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
            fullName: 1,
            email: 1,
            phoneNo: 1,
            school: {
              _id: 1,
              schoolName: 1,
            },
          },
        },
      ]);
      await client.set(facultyKey, JSON.stringify(faculty), "EX", 3600);

      res.status(StatusCodes.OK).send(faculty);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching all Faculty");
    }
  }
);
//tested

export const createFaculty = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = facultyCreateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const admin = (await Admin.findOne({
        email: req.decoded?.email,
      }).select({
        school: 1,
        _id: 0,
      })) as { school: Types.ObjectId };
      if (!admin.school) {
        res.status(StatusCodes.NOT_FOUND).send("School not found");
        return;
      }
      // console.log(school);

      value.school = admin.school.toString();
      // console.log(value);

      const faculty = await Faculty.create(value);
      await client.del(facultyKey);
      res.status(StatusCodes.OK).json(faculty);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while creating faculty");
      return;
    }
  }
);
//tested

export const getFaculty = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const faculty = await Faculty.findById(id);
      res.status(StatusCodes.OK).send(faculty);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching  faculty");
    }
  }
);
//tested

export const updateFaculty = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    {
      const { error, value } = idValidator({ id });
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
        return;
      }
    }
    const { error, value } = facultyUpdateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }

    try {
      const updatedFaculty = await Faculty.findOneAndUpdate(
        { _id: id },
        value,
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(facultyKey);

      res.status(StatusCodes.OK).json(updatedFaculty);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while updating faculty ");
    }
  }
);

export const deleteFaculty = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }

    try {
      const faculty = await Faculty.findByIdAndDelete(id);
      if (!faculty) {
        res.status(StatusCodes.NOT_FOUND).send("Faculty not found");
        return;
      }
      await client.del(facultyKey);
      res.status(StatusCodes.OK).send("Faculty deleted successfully");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while deleting Faculty");
    }
  }
);
//tested

export const disableFaculty = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const faculty = await Faculty.findOneAndUpdate(
        { _id: id },
        { isActive: false },
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(facultyKey);
      res.status(StatusCodes.OK).send("Faculty is disabled");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error ocuured while Faculty is disabled");
    }
  }
);
//tested

export const authUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = loginValidator(req.body);
    if (error) {
      res.status(400).send(error);
      return;
    }
    const { email, password } = req.body;
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      res.status(401).send("Invalid email or password");
      return;
    }
    const isMatch = await comparePassword(password, faculty.password);
    if (isMatch) {
      const accessToken = generateAccessToken({
        email: faculty.email,
        role: "faculty",
        Id: faculty._id,
      }) as string;
      const refreshToken = generateRefreshToken({
        email: faculty.email,
        role: "faculty",
        Id: faculty._id,
      });
      setRefreshTokenCookie(res, refreshToken);
      setAccessTokenCookie(res, accessToken);
      res.status(StatusCodes.OK).send({ message: "Login successful" });
    } else {
      res.status(401).send("Invalid email or password");
    }
  }
);
//tested

export const getFacultyBySchoolId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const faculty = await Faculty.find({
        isActive: true,
        school: id,
      });
      res.status(StatusCodes.OK).json(faculty);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error ocuured while creating fetching faculty with schoolid");
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

//   getAllFaculty,
//   createFaculty,
//   getFaculty,
//   updateFaculty,
//   deleteFaculty,
//   disableFaculty,
//   authUser,
//   getFacultyBySchoolId,
//   logout,
