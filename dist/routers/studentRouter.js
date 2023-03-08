"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRouter = void 0;
const express_1 = __importDefault(require("express"));
const studentRouter = express_1.default.Router();
exports.studentRouter = studentRouter;
const studentController_1 = require("../controllers/studentController");
const auth_1 = require("../middleware/auth");
studentRouter
    .route("/")
    .get(auth_1.authMiddleware, auth_1.accessTokenGenerate, studentController_1.getAllStudent)
    .post(auth_1.authMiddleware, auth_1.accessTokenGenerate, studentController_1.createStudent);
studentRouter
    .route("/:id")
    .get(auth_1.authMiddleware, auth_1.accessTokenGenerate, studentController_1.getStudent)
    .patch(auth_1.authMiddleware, auth_1.accessTokenGenerate, studentController_1.updateStudent)
    .delete(auth_1.authMiddleware, auth_1.accessTokenGenerate, studentController_1.deleteStudent);
studentRouter.put("/disable/:id", auth_1.authMiddleware, auth_1.accessTokenGenerate, studentController_1.disableStudent);
studentRouter.post("/login", studentController_1.authUser);
studentRouter.post("/logout", studentController_1.logout);
studentRouter.get("/facultyId/:id", auth_1.authMiddleware, auth_1.accessTokenGenerate, studentController_1.getStudentByFacultyId);
