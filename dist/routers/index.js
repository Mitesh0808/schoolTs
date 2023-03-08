"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const courseRouter_1 = require("./courseRouter");
const facultyRouter_1 = require("./facultyRouter");
const financeRouter_1 = require("./financeRouter");
const inquiryRouter_1 = require("./inquiryRouter");
const marketingRouter_1 = require("./marketingRouter");
router.use("/course", courseRouter_1.courseRouter);
router.use("/faculty", facultyRouter_1.facultyRouter);
router.use("/finance", financeRouter_1.financeRouter);
router.use("/inquiry", inquiryRouter_1.inquiryRouter);
router.use("/marketing", marketingRouter_1.marketingRouter);
exports.default = router;
