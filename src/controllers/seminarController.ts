import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import {
  seminarCreateValidator,
  seminarUpdateValidator,
} from "../validation/seminarValidator";
import { Seminar } from "../model/";
import { idValidator } from "../validation";
import Request from "../interface";
import { client } from "../utils/redis";
const seminarKey = "seminar";
export const getAllSeminar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const cachedSeminar = await client.get(seminarKey);
      if (cachedSeminar !== null) {
        res.status(200).send(JSON.parse(cachedSeminar));
        return;
      }
      const seminars = await Seminar.find({});
      await client.set(seminarKey, JSON.stringify(seminars), "EX", 3600);
      res.status(StatusCodes.OK).send(seminars);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching all courses");
    }
  }
);

export const createSeminar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = seminarCreateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const seminar = await Seminar.create(value);
      await client.del(seminarKey);
      res.status(StatusCodes.CREATED).send(seminar);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while creating seminar");
    }
  }
);

export const getSeminar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const seminar = await Seminar.findById(id);
      res.status(StatusCodes.OK).send(seminar);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching  seminar");
    }
  }
);

export const updateSeminar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    {
      const { error, value } = idValidator({ id });
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
        return;
      }
    }
    const { error, value } = seminarUpdateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const updatedSeminar = await Seminar.findOneAndUpdate(
        { _id: id },
        value,
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(seminarKey);
      res.status(StatusCodes.OK).send(updatedSeminar);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while updating seminar");
    }
  }
);

export const deleteSeminar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const seminar = await Seminar.findByIdAndDelete(id);
      if (!seminar) {
        res.status(StatusCodes.NOT_FOUND).send("Seminar not found");
        return;
      }
      await client.del(seminarKey);
      res.status(StatusCodes.OK).send("Seminar deleted successfully");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while deleting seminar");
    }
  }
);

export const disableSeminar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const faculty = await Seminar.findOneAndUpdate(
        { _id: id },
        { isActive: false },
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(seminarKey);
      res.status(StatusCodes.OK).send("Faculty is disabled");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error ocuured while Faculty is disabled");
    }
  }
);
