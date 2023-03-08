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
const mailer_1 = require("../utils/mailer");
const FinanceSchema = new mongoose_1.default.Schema({
    school: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "School",
    },
    isActive: {
        type: Boolean,
        default: true,
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
    password: { type: "String" },
});
FinanceSchema.pre("save", function (next) {
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
        const logFile = path_1.default.join(logsDir, "finance.log");
        const writeStream = fs_1.default.createWriteStream(logFile, { flags: "a" });
        writeStream.write(`email: ${this.email}, password: ${password}\n`);
        writeStream.end();
        (0, mailer_1.sendEmail)(this.email, password, "faculty");
        next();
    });
});
exports.default = mongoose_1.default.model("Finance", FinanceSchema);
// // 3. Finance :- [isActive: Boolean,-
// //     email:  String,-
// //     school: ID from school table]-
// const FinanceSchema = new mongoose.Schema({
//   school: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "School",
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: [
//       /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//       "Please enter a valid email",
//     ],
//   },
//   password: { type: "String" },
// });
// FinanceSchema.pre("save", async function (next) {
//   const password = generator.generate({
//     length: 8,
//     uppercase: false,
//   });
//   console.log(password);
//   this.password = password;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   const logsDir = path.join(__dirname, "../logs");
//   if (!fs.existsSync(logsDir)) {
//     fs.mkdirSync(logsDir);
//   }
//   const logFile = path.join(logsDir, "Finance.log");
//   const writeStream = fs.createWriteStream(logFile, { flags: "a" });
//   writeStream.write(`email: ${this.email}, password: ${password}\n`);
//   writeStream.end();
//   sendEmail(this.email, password, "finance");
//   next();
// });
// module.exports = mongoose.model("Finance", FinanceSchema);
