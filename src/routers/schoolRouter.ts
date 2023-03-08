import express, { Router } from "express";
const schoolRouter = express.Router();
import {
  getAllSchool,
  createSchool,
  getSchool,
  updateSchool,
  deleteSchool,
  disableSchool,
  authUser,
  logout,
  allLogout,
} from "../controllers/schoolController";
import { authMiddleware, accessTokenGenerate } from "../middleware/auth";
schoolRouter
  .route("/")
  .get(authMiddleware, accessTokenGenerate, getAllSchool)
  .post(authMiddleware, accessTokenGenerate, createSchool);
schoolRouter
  .route("/:id")
  .get(authMiddleware, accessTokenGenerate, getSchool)
  .patch(authMiddleware, accessTokenGenerate, updateSchool)
  .delete(authMiddleware, accessTokenGenerate, deleteSchool);
schoolRouter.put("/disable/:id", authMiddleware, disableSchool);
schoolRouter.post("/login", authUser);
schoolRouter.post("/logout", authMiddleware, accessTokenGenerate, logout);
schoolRouter.post("/alllogout", authMiddleware, accessTokenGenerate, allLogout);
export { schoolRouter };
