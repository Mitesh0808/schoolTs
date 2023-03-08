import express, { Router } from "express";
import { authMiddleware, accessTokenGenerate } from "../middleware/auth";
const marketingRouter: Router = express.Router();

import {
  getAllMarketing,
  createMarketing,
  getMarketing,
  updateMarketing,
  deleteMarketing,
  authUser,
  disableMarketing,
  logout,
} from "../controllers/marketingController";
marketingRouter
  .route("/")
  .get(authMiddleware, accessTokenGenerate, getAllMarketing)
  .post(authMiddleware, accessTokenGenerate, createMarketing);
marketingRouter.put(
  "/disable/:id",
  authMiddleware,
  accessTokenGenerate,
  disableMarketing
);
marketingRouter
  .route("/:id")
  .get(authMiddleware, accessTokenGenerate, getMarketing)
  .patch(authMiddleware, accessTokenGenerate, updateMarketing)
  .delete(authMiddleware, accessTokenGenerate, deleteMarketing);
marketingRouter.post("/login", authUser);
marketingRouter.post("/logout", logout);

export { marketingRouter };
