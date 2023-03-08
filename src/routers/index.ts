import express, { Router } from "express";

const router: Router = express.Router();

import { courseRouter } from "./courseRouter";
import { facultyRouter } from "./facultyRouter";
import { financeRouter } from "./financeRouter";
import { inquiryRouter } from "./inquiryRouter";
import { marketingRouter } from "./marketingRouter";
import { schoolRouter } from "./schoolRouter";
import { seminarRouter } from "./seminarRouter";
import { studentRouter } from "./studentRouter";
import { superAdminRouter } from "./superAdminRouter";
router.use("/course", courseRouter);
router.use("/faculty", facultyRouter);
router.use("/finance", financeRouter);
router.use("/inquiry", inquiryRouter);
router.use("/marketing", marketingRouter);
router.use("/school", schoolRouter);
router.use("/seminar", seminarRouter);
router.use("/student", studentRouter);
router.use("/superadmin", superAdminRouter);

export default router;
