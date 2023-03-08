import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { Course } from "../model/";
import { client } from "../utils/redis";
import { idValidator } from "../validation";
import {
  validateCourseCreate,
  validateCourseUpdate,
} from "../validation/courseValidator";
import Request from "../interface";

const coursesKey = "cources";
export const getAllCourses = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const cachedCourses = await client.get(coursesKey);
      if (cachedCourses !== null) {
        res.status(200).send(JSON.parse(cachedCourses));
        return;
      }
      const cources = await Course.aggregate([
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
            courseName: 1,
            description: 1,
            fees: 1,
            duration: 1,
            school: {
              _id: 1,
              schoolName: 1,
            },
          },
        },
      ]);
      await client.set(coursesKey, JSON.stringify(cources), "EX", 3600);
      console.log("checkpoint");
      res.status(200).send(cources);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching all courses");
    }
  }
);
export const createCourse = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = validateCourseCreate(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const course = await Course.create(value);
      await client.del(coursesKey);
      res.status(StatusCodes.CREATED).json(course);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while creating courses");
    }
  }
);
export const getCourse = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const cources = await Course.findById(id);
      res.status(StatusCodes.OK).send(cources);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching courses");
    }
  }
);
export const updateCourse = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    {
      const { error, value } = idValidator({ id });
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
        return;
      }
    }
    const { error, value } = validateCourseUpdate(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const updatedCourse = await Course.findOneAndUpdate({ _id: id }, value, {
        new: true,
        runValidators: true,
      });
      await client.del(coursesKey);
      res.status(StatusCodes.OK).send(updatedCourse);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching courses");
    }
  }
);
export const deleteCourse = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const cources = await Course.findByIdAndDelete(id);
      if (!cources) {
        res.status(StatusCodes.NOT_FOUND).send("course not found");
        return;
      }
      await client.del(coursesKey);
      res.status(StatusCodes.OK).send("course deleted successfully");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while deleting course");
    }
  }
);
export const disableCourse = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const course = await Course.findOneAndUpdate(
        { _id: id },
        { isActive: false },
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(coursesKey);
      res.status(StatusCodes.OK).send("course is disabled");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error ocuured while course is disabled");
    }
  }
);
