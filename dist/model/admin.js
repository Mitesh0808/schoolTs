"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const generate_password_1 = require("generate-password");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcrypt = require("bcryptjs");
// // Admin :- [isActive: Boolean,
// //     email: String,
// //     password: String,
// //     school: ID from school table]
const mailer_1 = require("../utils/mailer");
const AdminSchema = new mongoose_1.default.Schema({
    isActive: {
        type: Boolean,
        default: true,
    },
    school: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "School",
    },
    password: { type: "String" },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
    },
});
AdminSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = (0, generate_password_1.generate)({
            length: 8,
            uppercase: false,
        });
        console.log(password);
        this.password = password;
        const salt = yield bcrypt.genSalt(10);
        this.password = yield bcrypt.hash(this.password, salt);
        const logsDir = path_1.default.join(__dirname, "../logs");
        if (!fs_1.default.existsSync(logsDir)) {
            fs_1.default.mkdirSync(logsDir);
        }
        const logFile = path_1.default.join(logsDir, "Admin.log");
        const writeStream = fs_1.default.createWriteStream(logFile, { flags: "a" });
        writeStream.write(`email: ${this.email}, password: ${password}\n`);
        writeStream.end();
        this.$locals = {
            plainPassword: password,
        };
        next();
    });
});
AdminSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, mailer_1.sendEmail)(this.email, doc.$locals.plainPassword, "schoolAdmin");
        next();
    });
});
exports.default = mongoose_1.default.model("Admin", AdminSchema);
