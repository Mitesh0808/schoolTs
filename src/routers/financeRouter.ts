import express, { Router } from "express";
import { authMiddleware, accessTokenGenerate } from "../middleware/auth";
const financeRouter: Router = express.Router();
import {
  getAllFinance,
  createFinance,
  getFinance,
  updateFinance,
  deleteFinance,
  authUser,
  disableFinance,
  logout,
} from "../controllers/financeController";

financeRouter
  .route("/")
  .get(authMiddleware, accessTokenGenerate, getAllFinance)
  .post(authMiddleware, accessTokenGenerate, createFinance);
financeRouter
  .route("/:id")
  .get(authMiddleware, accessTokenGenerate, getFinance)
  .patch(authMiddleware, accessTokenGenerate, updateFinance)
  .delete(authMiddleware, accessTokenGenerate, deleteFinance);
financeRouter.put(
  "/disable/:id",
  authMiddleware,
  accessTokenGenerate,
  disableFinance
);
financeRouter.post("/login", authUser);
financeRouter.post("/logout", logout);
export { financeRouter };
