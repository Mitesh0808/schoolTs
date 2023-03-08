"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiryRouter = void 0;
const express = require("express");
const inquiryRouter = express.Router();
exports.inquiryRouter = inquiryRouter;
const inquiryController_1 = require("../controllers/inquiryController");
inquiryRouter.route("/").get(inquiryController_1.getAllInquiry).post(inquiryController_1.createInquiry);
inquiryRouter
    .route("/:id")
    .get(inquiryController_1.getInquiry)
    .patch(inquiryController_1.updateInquiry)
    .delete(inquiryController_1.deleteInquiry);
inquiryRouter.put("/disable/:id", inquiryController_1.disableInquiry);
