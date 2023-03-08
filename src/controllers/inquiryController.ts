import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { Inquiry } from "../model/";
import {
  inquiryCreateValidator,
  inquiryUpdateValidator,
} from "../validation/inquiryValidator";
import { idValidator, loginValidator } from "../validation";
import Request from "../interface";
import { client } from "../utils/redis";
const inquiryKey = "inquiry";
export const getAllInquiry = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const cachedInquiry = await client.get(inquiryKey);
    if (cachedInquiry !== null) {
      res.status(200).send(JSON.parse(cachedInquiry));
      return;
    }
    try {
      const inquirys = await Inquiry.aggregate([
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
            firstName: 1,
            lastName: 1,
            email: 1,
            subject: 1,
            message: 1,
            school: {
              _id: 1,
              schoolName: 1,
            },
          },
        },
      ]);
      await client.set(inquiryKey, JSON.stringify(inquirys), "EX", 3600);

      res.status(StatusCodes.OK).send(inquirys);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching all Inquiry");
    }
  }
);
export const createInquiry = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { error, value } = inquiryCreateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
    } else {
      try {
        const inquiry = await Inquiry.create(value);
        await client.del(inquiryKey);

        res.status(StatusCodes.CREATED).json(inquiry);
      } catch (error) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send("error occoured while creating inquiry");
      }
    }
  }
);
export const getInquiry = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const inquiry = await Inquiry.findById(id);
      res.status(StatusCodes.OK).send(inquiry);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error occoured while fetching  inquiry");
    }
  }
);
export const updateInquiry = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    {
      const { error, value } = idValidator({ id });
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
        return;
      }
    }
    const { error, value } = inquiryUpdateValidator(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
    }

    try {
      const updatedInquiry = await Inquiry.findOneAndUpdate(
        { _id: id },
        value,
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(inquiryKey);
      res.status(StatusCodes.OK).send(updatedInquiry);
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while updating inquiry");
    }
  }
);
export const deleteInquiry = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(400).send(error);
      return;
    }
    try {
      const inquiry = await Inquiry.findByIdAndDelete(id);
      if (!inquiry) {
        res.status(StatusCodes.NOT_FOUND).send("Inquiry not found");
        return;
      }
      await client.del(inquiryKey);
      res.status(StatusCodes.OK).send("Inquiry deleted successfully");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("Error occurred while deleting Inquiry");
    }
  }
);
export const disableInquiry = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { error, value } = idValidator({ id });
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).send(error);
      return;
    }
    try {
      const faculty = await Inquiry.findOneAndUpdate(
        { _id: id },
        { isActive: false },
        {
          new: true,
          runValidators: true,
        }
      );
      await client.del(inquiryKey);
      res.status(StatusCodes.OK).send("Faculty is disabled");
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send("error ocuured while Faculty is disabled");
    }
  }
);
