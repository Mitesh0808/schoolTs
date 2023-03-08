import express, { Router } from "express";
const seminarRouter = express.Router();
import {
  getAllSeminar,
  createSeminar,
  getSeminar,
  updateSeminar,
  deleteSeminar,
  disableSeminar,
} from "../controllers/seminarController";
seminarRouter.route("/").get(getAllSeminar).post(createSeminar);
seminarRouter
  .route("/:id")
  .get(getSeminar)
  .patch(updateSeminar)
  .delete(deleteSeminar);
seminarRouter.put("/disable/:id", disableSeminar);
export { seminarRouter };
