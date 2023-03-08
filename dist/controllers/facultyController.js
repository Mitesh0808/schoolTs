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
exports.logout = exports.getFacultyBySchoolId = exports.authUser = exports.disableFaculty = exports.deleteFaculty = exports.updateFaculty = exports.getFaculty = exports.createFaculty = exports.getAllFaculty = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const model_1 = require("../model/");
const validation_1 = require("../validation");
const checkPassword_1 = require("../utils/checkPassword");
const facultyValidator_1 = require("../validation/facultyValidator");
const token_1 = require("../utils/token");
//tested
exports.getAllFaculty = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const cachedFaculty = await client.get(facultyKey);
        // // console.log(cachedCourses);
        // if (cachedFaculty !== null) {
        //   res.status(200).send(JSON.parse(cachedFaculty));
        //   return;
        // }
        const faculty = yield model_1.Faculty.aggregate([
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
        // await client.set(facultyKey, JSON.stringify(faculty), "EX", 3600);
        res.status(http_status_codes_1.StatusCodes.OK).send(faculty);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching all Faculty");
    }
}));
//tested
exports.createFaculty = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, facultyValidator_1.facultyCreateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        //   const { school } = await Admin.findOne({
        //     email: req.decoded.email,
        //   }).select({
        //     school: 1,
        //     _id: 0,
        //   });
        //   value.school = school;
        const faculty = yield model_1.Faculty.create(value);
        //   await client.del(facultyKey);
        res.status(http_status_codes_1.StatusCodes.OK).json(faculty);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while creating faculty");
        return;
    }
}));
//tested
exports.getFaculty = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const faculty = yield model_1.Faculty.findById(id);
        res.status(http_status_codes_1.StatusCodes.OK).send(faculty);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching  faculty");
    }
}));
//tested
exports.updateFaculty = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, facultyValidator_1.facultyUpdateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    const { id } = req.params;
    try {
        const updatedFaculty = yield model_1.Faculty.findOneAndUpdate({ _id: id }, value, {
            new: true,
            runValidators: true,
        });
        // await client.del(facultyKey);
        res.status(http_status_codes_1.StatusCodes.OK).json(updatedFaculty);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while updating faculty ");
    }
}));
exports.deleteFaculty = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const faculty = yield model_1.Faculty.findByIdAndDelete(id);
        if (!faculty) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Faculty not found");
            return;
        }
        //   await client.del(facultyKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("Faculty deleted successfully");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while deleting Faculty");
    }
}));
//tested
exports.disableFaculty = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const faculty = yield model_1.Faculty.findOneAndUpdate({ _id: id }, { isActive: false }, {
            new: true,
            runValidators: true,
        });
        // await client.del(facultyKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("Faculty is disabled");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error ocuured while Faculty is disabled");
    }
}));
//tested
exports.authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, validation_1.loginValidator)(req.body);
    if (error) {
        res.status(400).send(error);
        return;
    }
    const { email, password } = req.body;
    const faculty = yield model_1.Faculty.findOne({ email });
    if (!faculty) {
        res.status(401).send("Invalid email or password");
        return;
    }
    const isMatch = yield (0, checkPassword_1.comparePassword)(password, faculty.password);
    if (isMatch) {
        const accessToken = (0, token_1.generateAccessToken)({
            email: faculty.email,
            role: "faculty",
            id: faculty._id,
        });
        const refreshToken = (0, token_1.generateRefreshToken)({
            email: faculty.email,
            role: "faculty",
            id: faculty._id,
        });
        (0, token_1.setRefreshTokenCookie)(res, refreshToken);
        (0, token_1.setAccessTokenCookie)(res, accessToken);
        res.status(http_status_codes_1.StatusCodes.OK).send({ message: "Login successful" });
    }
    else {
        res.status(401).send("Invalid email or password");
    }
}));
//tested
exports.getFacultyBySchoolId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const faculty = yield model_1.Faculty.find({
            isActive: true,
            school: id,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(faculty);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error ocuured while creating fetching faculty with schoolid");
    }
}));
exports.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
}));
//   getAllFaculty,
//   createFaculty,
//   getFaculty,
//   updateFaculty,
//   deleteFaculty,
//   disableFaculty,
//   authUser,
//   getFacultyBySchoolId,
//   logout,
