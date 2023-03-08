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
exports.allLogout = exports.logout = exports.authUser = exports.deleteSuperAdmin = exports.updateSuperAdmin = exports.getSuperAdmin = exports.createSuperAdmin = exports.getAllSuperAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const model_1 = require("../model/");
const validation_1 = require("../validation");
const checkPassword_1 = require("../utils/checkPassword");
const token_1 = require("../utils/token");
// getAllSuperAdmin,
// createSuperAdmin,
// getSuperAdmin,
// updateSuperAdmin,
// deleteSuperAdmin,
// authUser,
// logout,
// allLogout,
exports.getAllSuperAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schools = yield model_1.SuperAdmin.find({});
        res.status(http_status_codes_1.StatusCodes.OK).send(schools);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching all superAdmin");
    }
}));
exports.createSuperAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, validation_1.emailValidator)(req.body);
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const superAdmin = yield model_1.SuperAdmin.create(value);
        res.status(http_status_codes_1.StatusCodes.OK).send(superAdmin);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching  superAdmin");
    }
}));
exports.getSuperAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const superAdmin = yield model_1.SuperAdmin.findById(id);
        res.status(http_status_codes_1.StatusCodes.OK).send(superAdmin);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching  superAdmin");
    }
}));
exports.updateSuperAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error, value } = (0, validation_1.idValidator)({ id });
        if (error) {
            res.status(400).send(error);
            return;
        }
        const updatedMarketing = yield model_1.SuperAdmin.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(http_status_codes_1.StatusCodes.OK).send(updatedMarketing);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while updating marketing");
    }
}));
exports.deleteSuperAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const superAdmin = yield model_1.SuperAdmin.findByIdAndDelete(id);
        if (!superAdmin) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("superAdmin not found");
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).send("superAdmin deleted successfully");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while deleting superAdmin");
    }
}));
exports.authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, validation_1.loginValidator)(req.body);
    if (error) {
        res.status(400).send(error);
        return;
    }
    const { email, password } = req.body;
    const superAdmin = yield model_1.SuperAdmin.findOne({ email });
    if (!superAdmin) {
        res.status(401).send("Invalid email or password");
        return;
    }
    const isMatch = yield (0, checkPassword_1.comparePassword)(password, superAdmin.password);
    if (isMatch) {
        const accessToken = (0, token_1.generateAccessToken)({
            email: superAdmin.email,
            role: "superAdmin",
            Id: superAdmin._id,
        });
        const refreshToken = (0, token_1.generateRefreshToken)({
            email: superAdmin.email,
            role: "superAdmin",
            Id: superAdmin._id,
        });
        const adminToken = yield model_1.SuperAdminToken.create({
            accessToken,
            refreshToken,
            Id: superAdmin._id,
        });
        const logHistory = yield model_1.LogHistory.create({
            superAdminID: superAdmin._id,
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
    const adminToken = yield model_1.SuperAdminToken.findOneAndDelete({
        accessToken: req.cookies.accessToken,
    });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
}));
exports.allLogout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminToken = yield model_1.SuperAdminToken.deleteMany({
        Id: (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.Id,
    });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
}));
