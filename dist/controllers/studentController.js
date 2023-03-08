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
exports.logout = exports.getStudentByFacultyId = exports.disableStudent = exports.authUser = exports.deleteStudent = exports.updateStudent = exports.getStudent = exports.createStudent = exports.getAllStudent = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const studentValidator_1 = require("../validation/studentValidator");
const model_1 = require("../model/");
const validation_1 = require("../validation");
const checkPassword_1 = require("../utils/checkPassword");
const token_1 = require("../utils/token");
const redis_1 = require("../utils/redis");
const studentKey = "students";
exports.getAllStudent = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedStudnet = yield redis_1.client.get(studentKey);
        if (cachedStudnet !== null) {
            res.status(200).send(JSON.parse(cachedStudnet));
            return;
        }
        const students = yield model_1.Student.aggregate([
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
        yield redis_1.client.set(studentKey, JSON.stringify(students), "EX", 3600);
        res.status(http_status_codes_1.StatusCodes.OK).send(students);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching all courses");
    }
}));
exports.createStudent = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error, value } = (0, studentValidator_1.studentCreateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const admin = (yield model_1.Admin.findOne({
            email: (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.email,
        }).select({
            school: 1,
            _id: 0,
        }));
        if (!admin.school) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("School not found");
            return;
        }
        value.school = admin.school.toString();
        const student = yield model_1.Student.create(value);
        yield redis_1.client.del(studentKey);
        res.status(http_status_codes_1.StatusCodes.CREATED).send(student);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while creating seminar");
    }
}));
exports.getStudent = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const student = yield model_1.Student.findById(id);
        res.status(http_status_codes_1.StatusCodes.OK).send(student);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching  school");
    }
}));
exports.updateStudent = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    {
        const { error, value } = (0, validation_1.idValidator)({ id });
        if (error) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
            return;
        }
    }
    const { error, value } = (0, studentValidator_1.studentUpdateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const student = yield model_1.Student.findOneAndUpdate({ _id: id }, value, {
            new: true,
            runValidators: true,
        });
        yield redis_1.client.del(studentKey);
        res.status(http_status_codes_1.StatusCodes.OK).send(student);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while updating seminar");
    }
}));
exports.deleteStudent = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const student = yield model_1.Student.findByIdAndDelete(id);
        if (!student) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("student not found");
            return;
        }
        yield redis_1.client.del(studentKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("student deleted successfully");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while deleting student");
    }
}));
exports.authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, validation_1.loginValidator)(req.body);
    if (error) {
        res.status(400).send(error);
        return;
    }
    const { email, password } = req.body;
    const student = yield model_1.Student.findOne({ email });
    if (!student) {
        res.status(401).send("Invalid email or password");
        return;
    }
    const isMatch = yield (0, checkPassword_1.comparePassword)(password, student.password);
    if (isMatch) {
        const accessToken = (0, token_1.generateAccessToken)({
            email: student.email,
            role: "student",
            Id: student._id,
        });
        const refreshToken = (0, token_1.generateRefreshToken)({
            email: student.email,
            role: "student",
            Id: student._id,
        });
        (0, token_1.setRefreshTokenCookie)(res, refreshToken);
        (0, token_1.setAccessTokenCookie)(res, accessToken);
        res.status(http_status_codes_1.StatusCodes.OK).send({ message: "Login successful" });
    }
    else {
        res.status(401).send("Invalid email or password");
    }
}));
exports.disableStudent = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const student = yield model_1.Student.findOneAndUpdate({ _id: id }, { isActive: false }, {
            new: true,
            runValidators: true,
        });
        yield redis_1.client.del(studentKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("student is disabled");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error ocuured while student is disabled");
    }
}));
exports.getStudentByFacultyId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        console.log("check", id);
        const student = yield model_1.Student.find({
            faculty: id,
        });
        res.status(http_status_codes_1.StatusCodes.OK).json(student);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error ocuured while creating fetching student with facultyID");
    }
}));
exports.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
}));
//  // const adminToken = await AdminToken.deleteMany({ Id: req.decoded.Id });
