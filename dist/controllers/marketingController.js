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
exports.logout = exports.disableMarketing = exports.authUser = exports.deleteMarketing = exports.updateMarketing = exports.getMarketing = exports.createMarketing = exports.getAllMarketing = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const marketingValidator_1 = require("../validation/marketingValidator");
const redis_1 = require("../utils/redis");
const marketingKey = "marketing";
const token_1 = require("../utils/token");
const validation_1 = require("../validation");
const checkPassword_1 = require("../utils/checkPassword");
const model_1 = require("../model/");
exports.getAllMarketing = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedMarketing = yield redis_1.client.get(marketingKey);
        if (cachedMarketing !== null) {
            res.status(200).send(JSON.parse(cachedMarketing));
            return;
        }
        const marketings = yield model_1.Marketing.aggregate([
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
                    email: 1,
                    school: {
                        _id: 1,
                        schoolName: 1,
                    },
                },
            },
        ]);
        yield redis_1.client.set(marketingKey, JSON.stringify(marketings), "EX", 3600);
        res.status(http_status_codes_1.StatusCodes.OK).send(marketings);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching all Marketing");
    }
}));
exports.createMarketing = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error, value } = (0, marketingValidator_1.marketingCreateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const admin = (yield model_1.Admin.findOne({ email: (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.email }).select({
            school: 1,
            _id: 0,
        }));
        if (!admin.school) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("School not found");
            return;
        }
        value.school = admin.school.toString();
        const marketing = yield model_1.Marketing.create(value);
        yield redis_1.client.del(marketingKey);
        res.status(http_status_codes_1.StatusCodes.CREATED).json(marketing);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while creating marketing");
    }
}));
exports.getMarketing = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const marketing = yield model_1.Marketing.findById(id);
        res.status(http_status_codes_1.StatusCodes.OK).send(marketing);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching  marketing");
    }
}));
exports.updateMarketing = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    {
        const { error, value } = (0, validation_1.idValidator)({ id });
        if (error) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
            return;
        }
    }
    const { error, value } = (0, marketingValidator_1.marketingUpdateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const updatedMarketing = yield model_1.Marketing.findOneAndUpdate({ _id: id }, value, {
            new: true,
            runValidators: true,
        });
        yield redis_1.client.del(marketingKey);
        res.status(http_status_codes_1.StatusCodes.OK).send(updatedMarketing);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while updating marketing");
    }
}));
exports.deleteMarketing = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const marketing = yield model_1.Marketing.findByIdAndDelete(id);
        if (!marketing) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Marketing not found");
            return;
        }
        yield redis_1.client.del(marketingKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("Marketing deleted successfully");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while deleting Marketing");
    }
}));
exports.authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, validation_1.loginValidator)(req.body);
    if (error) {
        res.status(400).send(error);
        return;
    }
    const { email, password } = req.body;
    const marketing = yield model_1.Marketing.findOne({ email });
    if (!marketing) {
        res.status(401).send("Invalid email or password");
        return;
    }
    const isMatch = yield (0, checkPassword_1.comparePassword)(password, marketing.password);
    if (isMatch) {
        const accessToken = (0, token_1.generateAccessToken)({
            email: marketing.email,
            role: "marketing",
            Id: marketing._id,
        });
        const refreshToken = (0, token_1.generateRefreshToken)({
            email: marketing.email,
            role: "marketing",
            Id: marketing._id,
        });
        (0, token_1.setRefreshTokenCookie)(res, refreshToken);
        (0, token_1.setAccessTokenCookie)(res, accessToken);
        res.status(http_status_codes_1.StatusCodes.OK).send({ message: "Login successful" });
    }
    else {
        res.status(401).send("Invalid email or password");
    }
}));
exports.disableMarketing = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const marketing = yield model_1.Marketing.findOneAndUpdate({ _id: id }, { isActive: false }, {
            new: true,
            runValidators: true,
        });
        yield redis_1.client.del(marketingKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("marketing is disabled");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error ocuured while marketing is disabled");
    }
}));
exports.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
}));
