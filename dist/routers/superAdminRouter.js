"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const superAdminRouter = express_1.default.Router();
exports.superAdminRouter = superAdminRouter;
const superAdminController_1 = require("../controllers/superAdminController");
const auth_1 = require("../middleware/auth");
superAdminRouter.route("/").get(superAdminController_1.getAllSuperAdmin).post(superAdminController_1.createSuperAdmin);
superAdminRouter
    .route("/:id")
    .get(superAdminController_1.getSuperAdmin)
    .patch(superAdminController_1.updateSuperAdmin)
    .delete(superAdminController_1.deleteSuperAdmin);
superAdminRouter.post("/login", superAdminController_1.authUser);
superAdminRouter.post("/logout", auth_1.authMiddleware, auth_1.accessTokenGenerate, superAdminController_1.logout);
superAdminRouter.post("/alllogout", auth_1.authMiddleware, auth_1.accessTokenGenerate, superAdminController_1.allLogout);
