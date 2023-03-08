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
// 8. student :- [school: ID from school table,
//     faculty:  ID from faculty table,
//     isActive: Boolean,-
//     firstName: String,-
//     middleName: String,-
//     lastName: String,-
//     email:  String,-
//     age: String,-
//     gender: String]-
//school,faculty,isActive,firstName,middleName,lastName,email,age,gender
const mongoose_1 = __importDefault(require("mongoose"));
const generate_password_1 = require("generate-password");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcrypt = require("bcryptjs");
const StudentSchema = new mongoose_1.default.Schema({
    school: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "School",
    },
    faculty: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Faculty",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    firstName: {
        type: String,
        trim: true,
        maxLength: [255, "firstName should be less than 50 characters"],
        required: [true, "please provide coursename"],
    },
    middleName: {
        type: String,
        trim: true,
        maxLength: [255, "middleName should be less than 50 characters"],
        required: [true, "must provide description"],
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: [255, "middleName should be less than 50 characters"],
        required: [true, "must provide description"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
    },
    age: {
        type: String,
        trim: true,
        maxLength: [255, "age should be less than 50 characters"],
        required: [true, "must provide description"],
    },
    gender: {
        type: String,
        trim: true,
        maxLength: [255, "gender should be less than 50 characters"],
        required: [true, "must provide description"],
    },
    password: { type: "String" },
});
StudentSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = (0, generate_password_1.generate)({
            length: 8,
            uppercase: false,
        });
        this.password = password;
        const salt = yield bcrypt.genSalt(10);
        this.password = yield bcrypt.hash(this.password, salt);
        const logsDir = path_1.default.join(__dirname, "../logs");
        if (!fs_1.default.existsSync(logsDir)) {
            fs_1.default.mkdirSync(logsDir);
        }
        const logFile = path_1.default.join(logsDir, "school.log");
        const writeStream = fs_1.default.createWriteStream(logFile, { flags: "a" });
        writeStream.write(`email: ${this.email}, password: ${password}\n`);
        writeStream.end();
        //   sendEmail(this.email, password, "faculty");
        next();
    });
});
exports.default = mongoose_1.default.model("Student", StudentSchema);
