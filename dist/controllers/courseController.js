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
exports.disableCourse = exports.deleteCourse = exports.updateCourse = exports.getCourse = exports.createCourse = exports.getAllCourses = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const model_1 = require("../model/");
const redis_1 = require("../utils/redis");
const validation_1 = require("../validation");
const courseValidator_1 = require("../validation/courseValidator");
const coursesKey = "cources";
exports.getAllCourses = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedCourses = yield redis_1.client.get(coursesKey);
        if (cachedCourses !== null) {
            res.status(200).send(JSON.parse(cachedCourses));
            return;
        }
        const cources = yield model_1.Course.aggregate([
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
        yield redis_1.client.set(coursesKey, JSON.stringify(cources), "EX", 3600);
        console.log("checkpoint");
        res.status(200).send(cources);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching all courses");
    }
}));
exports.createCourse = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, courseValidator_1.validateCourseCreate)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const course = yield model_1.Course.create(value);
        yield redis_1.client.del(coursesKey);
        res.status(http_status_codes_1.StatusCodes.CREATED).json(course);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while creating courses");
    }
}));
exports.getCourse = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const cources = yield model_1.Course.findById(id);
        res.status(http_status_codes_1.StatusCodes.OK).send(cources);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching courses");
    }
}));
exports.updateCourse = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    {
        const { error, value } = (0, validation_1.idValidator)({ id });
        if (error) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
            return;
        }
    }
    const { error, value } = (0, courseValidator_1.validateCourseUpdate)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const updatedCourse = yield model_1.Course.findOneAndUpdate({ _id: id }, value, {
            new: true,
            runValidators: true,
        });
        yield redis_1.client.del(coursesKey);
        res.status(http_status_codes_1.StatusCodes.OK).send(updatedCourse);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching courses");
    }
}));
exports.deleteCourse = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const cources = yield model_1.Course.findByIdAndDelete(id);
        if (!cources) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("course not found");
            return;
        }
        yield redis_1.client.del(coursesKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("course deleted successfully");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while deleting course");
    }
}));
exports.disableCourse = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const course = yield model_1.Course.findOneAndUpdate({ _id: id }, { isActive: false }, {
            new: true,
            runValidators: true,
        });
        yield redis_1.client.del(coursesKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("course is disabled");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error ocuured while course is disabled");
    }
}));
