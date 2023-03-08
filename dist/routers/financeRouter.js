"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.financeRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const financeRouter = express_1.default.Router();
exports.financeRouter = financeRouter;
const financeController_1 = require("../controllers/financeController");
financeRouter
    .route("/")
    .get(auth_1.authMiddleware, auth_1.accessTokenGenerate, financeController_1.getAllFinance)
    .post(auth_1.authMiddleware, auth_1.accessTokenGenerate, financeController_1.createFinance);
financeRouter
    .route("/:id")
    .get(auth_1.authMiddleware, auth_1.accessTokenGenerate, financeController_1.getFinance)
    .patch(auth_1.authMiddleware, auth_1.accessTokenGenerate, financeController_1.updateFinance)
    .delete(auth_1.authMiddleware, auth_1.accessTokenGenerate, financeController_1.deleteFinance);
financeRouter.put("/disable/:id", auth_1.authMiddleware, auth_1.accessTokenGenerate, financeController_1.disableFinance);
financeRouter.post("/login", financeController_1.authUser);
financeRouter.post("/logout", financeController_1.logout);
