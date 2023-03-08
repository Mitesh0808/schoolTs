"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableInquiry = exports.deleteInquiry = exports.updateInquiry = exports.getInquiry = exports.createInquiry = exports.getAllInquiry = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const model_1 = require("../model/");
const inquiryValidator_1 = require("../validation/inquiryValidator");
const validation_1 = require("../validation");
// getAllInquiry,
//   createInquiry,
//   getInquiry,
//   updateInquiry,
//   deleteInquiry,
//   disableInquiry,
exports.getAllInquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const cachedInquiry = await client.get(inquiryKey);
    // console.log(cachedCourses);
    //   if (cachedInquiry !== null) {
    //     res.status(200).send(JSON.parse(cachedInquiry));
    //     return;
    //   }
    try {
        const inquirys = yield model_1.Inquiry.aggregate([
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
        // await client.set(inquiryKey, JSON.stringify(inquirys), "EX", 3600);
        res.status(http_status_codes_1.StatusCodes.OK).send(inquirys);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching all Inquiry");
    }
}));
exports.createInquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, inquiryValidator_1.inquiryCreateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
    }
    else {
        try {
            const inquiry = yield model_1.Inquiry.create(value);
            //   await client.del(inquiryKey);
            res.status(http_status_codes_1.StatusCodes.CREATED).json(inquiry);
        }
        catch (error) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .send("error occoured while creating inquiry");
        }
    }
}));
exports.getInquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const inquiry = yield model_1.Inquiry.findById(id);
        res.status(http_status_codes_1.StatusCodes.OK).send(inquiry);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching  inquiry");
    }
}));
exports.updateInquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, inquiryValidator_1.inquiryUpdateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
    }
    const { id } = req.params;
    try {
        const updatedInquiry = yield model_1.Inquiry.findOneAndUpdate({ _id: id }, value, {
            new: true,
            runValidators: true,
        });
        //   await client.del(inquiryKey);
        res.status(http_status_codes_1.StatusCodes.OK).send(updatedInquiry);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while updating inquiry");
    }
}));
exports.deleteInquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const inquiry = yield model_1.Inquiry.findByIdAndDelete(id);
        if (!inquiry) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Inquiry not found");
            return;
        }
        //   await client.del(inquiryKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("Inquiry deleted successfully");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while deleting Inquiry");
    }
}));
exports.disableInquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const faculty = yield model_1.Inquiry.findOneAndUpdate({ _id: id }, { isActive: false }, {
            new: true,
            runValidators: true,
        });
        // await client.del(inquiryKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("Faculty is disabled");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error ocuured while Faculty is disabled");
    }
}));
