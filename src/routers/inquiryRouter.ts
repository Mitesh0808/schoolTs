const express = require("express");
const inquiryRouter = express.Router();

import {
  getAllInquiry,
  createInquiry,
  getInquiry,
  updateInquiry,
  deleteInquiry,
  disableInquiry,
} from "../controllers/inquiryController";
inquiryRouter.route("/").get(getAllInquiry).post(createInquiry);
inquiryRouter
  .route("/:id")
  .get(getInquiry)
  .patch(updateInquiry)
  .delete(deleteInquiry);
inquiryRouter.put("/disable/:id", disableInquiry);

export { inquiryRouter };
