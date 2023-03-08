import express, { Router } from "express";
import { authMiddleware, accessTokenGenerate } from "../middleware/auth";
const facultyRouter: Router = express.Router();
import {
  getAllFaculty,
  createFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  disableFaculty,
  authUser,
  getFacultyBySchoolId,
  logout,
} from "../controllers/facultyController";

facultyRouter
  .route("/")
  .get(authMiddleware, accessTokenGenerate, getAllFaculty)
  .post(authMiddleware, accessTokenGenerate, createFaculty);
facultyRouter
  .route("/:id")
  .get(authMiddleware, accessTokenGenerate, getFaculty)
  .patch(authMiddleware, accessTokenGenerate, updateFaculty)
  .delete(authMiddleware, accessTokenGenerate, deleteFaculty);
facultyRouter.put(
  "/disable/:id",
  authMiddleware,
  accessTokenGenerate,
  disableFaculty
);
facultyRouter.get(
  "/schoolId/:id",
  authMiddleware,
  accessTokenGenerate,
  getFacultyBySchoolId
);
facultyRouter.post("/login", authUser);
facultyRouter.post("/logout", logout);
export { facultyRouter };
