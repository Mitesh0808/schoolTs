"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketingRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const marketingRouter = express_1.default.Router();
exports.marketingRouter = marketingRouter;
const marketingController_1 = require("../controllers/marketingController");
marketingRouter
    .route("/")
    .get(auth_1.authMiddleware, auth_1.accessTokenGenerate, marketingController_1.getAllMarketing)
    .post(auth_1.authMiddleware, auth_1.accessTokenGenerate, marketingController_1.createMarketing);
marketingRouter.put("/disable/:id", auth_1.authMiddleware, auth_1.accessTokenGenerate, marketingController_1.disableMarketing);
marketingRouter
    .route("/:id")
    .get(auth_1.authMiddleware, auth_1.accessTokenGenerate, marketingController_1.getMarketing)
    .patch(auth_1.authMiddleware, auth_1.accessTokenGenerate, marketingController_1.updateMarketing)
    .delete(auth_1.authMiddleware, auth_1.accessTokenGenerate, marketingController_1.deleteMarketing);
marketingRouter.post("/login", marketingController_1.authUser);
marketingRouter.post("/logout", marketingController_1.logout);
