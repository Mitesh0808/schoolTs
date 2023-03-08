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
exports.disableSeminar = exports.deleteSeminar = exports.updateSeminar = exports.getSeminar = exports.createSeminar = exports.getAllSeminar = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const seminarValidator_1 = require("../validation/seminarValidator");
const model_1 = require("../model/");
const validation_1 = require("../validation");
const redis_1 = require("../utils/redis");
const seminarKey = "seminar";
exports.getAllSeminar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedSeminar = yield redis_1.client.get(seminarKey);
        if (cachedSeminar !== null) {
            res.status(200).send(JSON.parse(cachedSeminar));
            return;
        }
        const seminars = yield model_1.Seminar.find({});
        yield redis_1.client.set(seminarKey, JSON.stringify(seminars), "EX", 3600);
        res.status(http_status_codes_1.StatusCodes.OK).send(seminars);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching all courses");
    }
}));
exports.createSeminar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, seminarValidator_1.seminarCreateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const seminar = yield model_1.Seminar.create(value);
        yield redis_1.client.del(seminarKey);
        res.status(http_status_codes_1.StatusCodes.CREATED).send(seminar);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while creating seminar");
    }
}));
exports.getSeminar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(400).send(error);
        return;
    }
    try {
        const seminar = yield model_1.Seminar.findById(id);
        res.status(http_status_codes_1.StatusCodes.OK).send(seminar);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error occoured while fetching  seminar");
    }
}));
exports.updateSeminar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    {
        const { error, value } = (0, validation_1.idValidator)({ id });
        if (error) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
            return;
        }
    }
    const { error, value } = (0, seminarValidator_1.seminarUpdateValidator)(req.body);
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const updatedSeminar = yield model_1.Seminar.findOneAndUpdate({ _id: id }, value, {
            new: true,
            runValidators: true,
        });
        yield redis_1.client.del(seminarKey);
        res.status(http_status_codes_1.StatusCodes.OK).send(updatedSeminar);
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while updating seminar");
    }
}));
exports.deleteSeminar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const seminar = yield model_1.Seminar.findByIdAndDelete(id);
        if (!seminar) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Seminar not found");
            return;
        }
        yield redis_1.client.del(seminarKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("Seminar deleted successfully");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("Error occurred while deleting seminar");
    }
}));
exports.disableSeminar = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error, value } = (0, validation_1.idValidator)({ id });
    if (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send(error);
        return;
    }
    try {
        const faculty = yield model_1.Seminar.findOneAndUpdate({ _id: id }, { isActive: false }, {
            new: true,
            runValidators: true,
        });
        yield redis_1.client.del(seminarKey);
        res.status(http_status_codes_1.StatusCodes.OK).send("Faculty is disabled");
    }
    catch (error) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send("error ocuured while Faculty is disabled");
    }
}));
