import express, { Router } from "express";

const courseRouter: Router = express.Router();
import {
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  disableCourse,
} from "../controllers/courseController";

courseRouter.route("/").get(getAllCourses).post(createCourse);
courseRouter
  .route("/:id")
  .get(getCourse)
  .patch(updateCourse)
  .delete(deleteCourse);
courseRouter.put("/disable/:id", disableCourse);

export { courseRouter };
