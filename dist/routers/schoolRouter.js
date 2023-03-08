"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolRouter = void 0;
const express_1 = __importDefault(require("express"));
const schoolRouter = express_1.default.Router();
exports.schoolRouter = schoolRouter;
const schoolController_1 = require("../controllers/schoolController");
const auth_1 = require("../middleware/auth");
schoolRouter
    .route("/")
    .get(auth_1.authMiddleware, auth_1.accessTokenGenerate, schoolController_1.getAllSchool)
    .post(auth_1.authMiddleware, auth_1.accessTokenGenerate, schoolController_1.createSchool);
schoolRouter
    .route("/:id")
    .get(auth_1.authMiddleware, auth_1.accessTokenGenerate, schoolController_1.getSchool)
    .patch(auth_1.authMiddleware, auth_1.accessTokenGenerate, schoolController_1.updateSchool)
    .delete(auth_1.authMiddleware, auth_1.accessTokenGenerate, schoolController_1.deleteSchool);
schoolRouter.put("/disable/:id", auth_1.authMiddleware, schoolController_1.disableSchool);
schoolRouter.post("/login", schoolController_1.authUser);
schoolRouter.post("/logout", auth_1.authMiddleware, auth_1.accessTokenGenerate, schoolController_1.logout);
schoolRouter.post("/alllogout", auth_1.authMiddleware, auth_1.accessTokenGenerate, schoolController_1.allLogout);
