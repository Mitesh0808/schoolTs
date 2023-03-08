"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const facultyRouter = express_1.default.Router();
exports.facultyRouter = facultyRouter;
const facultyController_1 = require("../controllers/facultyController");
facultyRouter
    .route("/")
    .get(auth_1.authMiddleware, auth_1.accessTokenGenerate, facultyController_1.getAllFaculty)
    .post(auth_1.authMiddleware, auth_1.accessTokenGenerate, facultyController_1.createFaculty);
facultyRouter
    .route("/:id")
    .get(auth_1.authMiddleware, auth_1.accessTokenGenerate, facultyController_1.getFaculty)
    .patch(auth_1.authMiddleware, auth_1.accessTokenGenerate, facultyController_1.updateFaculty)
    .delete(auth_1.authMiddleware, auth_1.accessTokenGenerate, facultyController_1.deleteFaculty);
facultyRouter.put("/disable/:id", auth_1.authMiddleware, auth_1.accessTokenGenerate, facultyController_1.disableFaculty);
facultyRouter.get("/schoolId/:id", auth_1.authMiddleware, auth_1.accessTokenGenerate, facultyController_1.getFacultyBySchoolId);
facultyRouter.post("/login", facultyController_1.authUser);
facultyRouter.post("/logout", facultyController_1.logout);
