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
exports.allLogout = exports.logout = exports.authUser = exports.disableSchool = exports.deleteSchool = exports.updateSchool = exports.getSchool = exports.createSchool = exports.getAllSchool = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const schoolValidator_1 = require("../validation/schoolValidator");
const model_1 = require("../model/");
const validation_1 = require("../validation");
const checkPassword_1 = require("../utils/checkPassword");
const token_1 = require("../utils/token");
const redis_1 = require("../utils/redis");
const schoolKey = "school";
exports.getAllSchool = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedSchool = yield redis_1.client.get(schoolKey);
        if (cachedSchool !== null) {
            res.status(200).send(JSON.parse(cachedSchool));
            return;
        }
        const schools = yield model_1.School.find({});
        yield redis_1.client.set(schoolKey, JSON.stringify(schools), "EX", 3600);
        res.status(http_status_codes_1.StatusCodes.OK).send(schools);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching all School");
    }
}));
exports.createSchool = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, schoolValidator_1.schoolCreateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const school = yield model_1.School.create(value);
        const admin = yield model_1.Admin.create({
            school: school._id,
            email: school.email,
        });
        yield redis_1.client.del(schoolKey);
        res.status(http_status_codes_1.StatusCodes.CREATED).send(school);
    }
    catch (error) {
        console.log(error);
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while creating school");
    }
}));
exports.getSchool = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const school = yield model_1.School.findById(id);
        res.status(http_status_codes_1.StatusCodes.OK).send(school);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching  school");
    }
}));
exports.updateSchool = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    {
        const { error, value } = (0, validation_1.idValidator)({ id });
        if (error) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
            return;
        }
    }
    const { error, value } = (0, schoolValidator_1.schoolUpdateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const updatedSchool = yield model_1.School.findOneAndUpdate({ _id: id }, value, {
            new: true,
            runValidators: true,
        });
        yield redis_1.client.del(schoolKey);
        res.status(http_status_codes_1.StatusCodes.OK).send(updatedSchool);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while updating school");
    }
}));
exports.deleteSchool = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const school = yield model_1.School.findByIdAndDelete(id);
        if (!school) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("School not found");
            return;
        }
        yield redis_1.client.del(schoolKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("School deleted successfully");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while deleting School");
    }
}));
exports.disableSchool = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const school = yield model_1.School.findByIdAndUpdate(id, { isActive: false }, { new: true });
        const admin = yield model_1.Admin.findOneAndUpdate({ schoolId: id }, { isActive: false }, { new: true });
        yield redis_1.client.del(schoolKey);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .send("School and associated admin disabled successfully");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while disabling school and associated admin");
    }
}));
exports.authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, validation_1.loginValidator)(req.body);
    if (error) {
        res.status(400).send(error);
        return;
    }
    const { email, password } = req.body;
    const admin = yield model_1.Admin.findOne({ email });
    if (!admin) {
        res.status(401).send("Invalid email or password");
        return;
    }
    const isMatch = yield (0, checkPassword_1.comparePassword)(password, admin.password);
    if (isMatch) {
        const accessToken = (0, token_1.generateAccessToken)({
            email: admin.email,
            role: "schoolAdmin",
            Id: admin._id,
        });
        const refreshToken = (0, token_1.generateRefreshToken)({
            email: admin.email,
            role: "schoolAdmin",
            Id: admin._id,
        });
        const adminToken = yield model_1.AdminToken.create({
            accessToken,
            refreshToken,
            Id: admin._id,
        });
        const logHistory = yield model_1.LogHistory.create({
            adminID: admin._id,
            browser: req.headers["sec-ch-ua"],
        });
        (0, token_1.setRefreshTokenCookie)(res, refreshToken);
        (0, token_1.setAccessTokenCookie)(res, accessToken);
        res.status(http_status_codes_1.StatusCodes.OK).send({ message: "Login successful" });
    }
    else {
        res.status(401).send("Invalid email or password");
    }
}));
exports.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminToken = yield model_1.AdminToken.findOneAndDelete({
        accessToken: req.cookies.accessToken,
    });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
}));
exports.allLogout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminToken = yield model_1.AdminToken.deleteMany({ Id: (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.Id });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
}));
