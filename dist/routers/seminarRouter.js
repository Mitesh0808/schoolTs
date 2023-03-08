"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seminarRouter = void 0;
const express_1 = __importDefault(require("express"));
const seminarRouter = express_1.default.Router();
exports.seminarRouter = seminarRouter;
const seminarController_1 = require("../controllers/seminarController");
seminarRouter.route("/").get(seminarController_1.getAllSeminar).post(seminarController_1.createSeminar);
seminarRouter
    .route("/:id")
    .get(seminarController_1.getSeminar)
    .patch(seminarController_1.updateSeminar)
    .delete(seminarController_1.deleteSeminar);
seminarRouter.put("/disable/:id", seminarController_1.disableSeminar);
