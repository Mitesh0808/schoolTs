import express, { Router } from "express";
const studentRouter = express.Router();
import {
  getAllStudent,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  authUser,
  disableStudent,
  logout,
  getStudentByFacultyId,
} from "../controllers/studentController";
import { authMiddleware, accessTokenGenerate } from "../middleware/auth";

studentRouter
  .route("/")
  .get(authMiddleware, accessTokenGenerate, getAllStudent)
  .post(authMiddleware, accessTokenGenerate, createStudent);
studentRouter
  .route("/:id")
  .get(authMiddleware, accessTokenGenerate, getStudent)
  .patch(authMiddleware, accessTokenGenerate, updateStudent)
  .delete(authMiddleware, accessTokenGenerate, deleteStudent);
studentRouter.put(
  "/disable/:id",
  authMiddleware,
  accessTokenGenerate,
  disableStudent
);
studentRouter.post("/login", authUser);
studentRouter.post("/logout", logout);
studentRouter.get(
  "/facultyId/:id",
  authMiddleware,
  accessTokenGenerate,
  getStudentByFacultyId
);
export { studentRouter };
