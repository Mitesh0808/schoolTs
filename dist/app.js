"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const not_found_1 = __importDefault(require("./middleware/not-found"));
const connectDb_1 = __importDefault(require("./connectDb/connectDb"));
const index_1 = __importDefault(require("./routers/index"));
const app = (0, express_1.default)();
(0, connectDb_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/", index_1.default);
app.use(not_found_1.default);
const server = app.listen(5000, () => {
    console.log("server live on 5000");
});
