import express, { Router } from "express";
const superAdminRouter = express.Router();
import {
  getAllSuperAdmin,
  createSuperAdmin,
  getSuperAdmin,
  updateSuperAdmin,
  deleteSuperAdmin,
  authUser,
  logout,
  allLogout,
} from "../controllers/superAdminController";
import { authMiddleware, accessTokenGenerate } from "../middleware/auth";

superAdminRouter.route("/").get(getAllSuperAdmin).post(createSuperAdmin);
superAdminRouter
  .route("/:id")
  .get(getSuperAdmin)
  .patch(updateSuperAdmin)
  .delete(deleteSuperAdmin);
superAdminRouter.post("/login", authUser);
superAdminRouter.post("/logout", authMiddleware, accessTokenGenerate, logout);
superAdminRouter.post(
  "/alllogout",
  authMiddleware,
  accessTokenGenerate,
  allLogout
);
export { superAdminRouter };
