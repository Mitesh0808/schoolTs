import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import {
  studentCreateValidator,
  studentUpdateValidator,
} from "../validation/studentValidator";
import Request from "../interface";

import { Admin, Student } from "../model/";
import { idValidator, loginValidator } from "../validation";
import { comparePassword } from "../utils/checkPassword";
import {
  generateAccessToken,
  generateRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/token";
import { client } from "../utils/redis";
import { Types } from "mongoose";

const studentKey = "students";

export const getAllStudent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const cachedStudnet = await client.get(studentKey);
      if (cachedStudnet !== null) {
        res.status(200).send(JSON.parse(cachedStudnet));
        return;
      }
      const students = await Student.aggregate([
        {
          $lookup: {
            from: "schools",
            localField: "school",
            foreignField: "_id",
            as: "school",
          },
        },
        {
          $lookup: {
            from: "faculties",
            localField: "faculty",
            foreignField: "_id",
            as: "faculty",
          },
        },
        {
          $project: {
            isActive: 1,
            firstName: 1,
            middleName: 1,
            lastName: 1,
            email: 1,
            age: 1,
            gender: 1,
            school: {
              _id: 1,
              schoolName: 1,
            },
            faculty: {
              _id: 1,
              fullName: 1,
            },
          },
        },
      ]);
      await client.set(studentKey, JSON.stringify(students), "EX", 3600);
      res.status(StatusCodes.OK).send(students);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching all courses");
    }
  }
);
export const createStudent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = studentCreateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const admin = (await Admin.findOne({
        email: req.decoded?.email as string,
      }).select({
        school: 1,
        _id: 0,
      })) as { school: Types.ObjectId };
      if (!admin.school) {
        res.status(StatusCodes.NOT_FOUND).send("School not found");
        return;
      }
      value.school = admin.school.toString();
      const student = await Student.create(value);
      await client.del(studentKey);
      res.status(StatusCodes.CREATED).send(student);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while creating seminar");
    }
  }
);
export const getStudent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const student = await Student.findById(id);
      res.status(StatusCodes.OK).send(student);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching  school");
    }
  }
);
export const updateStudent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    {
      const { error, value } = idValidator({ id });
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
        return;
      }
    }
    const { error, value } = studentUpdateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const student = await Student.findOneAndUpdate({ _id: id }, value, {
        new: true,
        runValidators: true,
      });
      await client.del(studentKey);
      res.status(StatusCodes.OK).send(student);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while updating seminar");
    }
  }
);
export const deleteStudent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const student = await Student.findByIdAndDelete(id);
      if (!student) {
        res.status(StatusCodes.NOT_FOUND).send("student not found");
        return;
      }
      await client.del(studentKey);
      res.status(StatusCodes.OK).send("student deleted successfully");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while deleting student");
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
    const student = await Student.findOne({ email });
    if (!student) {
      res.status(401).send("Invalid email or password");
      return;
    }
    const isMatch = await comparePassword(password, student.password);
    if (isMatch) {
      const accessToken = generateAccessToken({
        email: student.email,
        role: "student",
        Id: student._id,
      });
      const refreshToken = generateRefreshToken({
        email: student.email,
        role: "student",
        Id: student._id,
      });
      setRefreshTokenCookie(res, refreshToken);
      setAccessTokenCookie(res, accessToken);
      res.status(StatusCodes.OK).send({ message: "Login successful" });
    } else {
      res.status(401).send("Invalid email or password");
    }
  }
);
export const disableStudent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const student = await Student.findOneAndUpdate(
        { _id: id },
        { isActive: false },
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(studentKey);
      res.status(StatusCodes.OK).send("student is disabled");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error ocuured while student is disabled");
    }
  }
);
export const getStudentByFacultyId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      console.log("check", id);

      const student = await Student.find({
        faculty: id,
      });
      res.status(StatusCodes.OK).json(student);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error ocuured while creating fetching student with facultyID");
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

//  // const adminToken = await AdminToken.deleteMany({ Id: req.decoded.Id });
