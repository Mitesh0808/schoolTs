"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // 7. seminar :- [isActive: Boolean,-
// //     presenter: String,-
// //     description: String,-
// //     link: String,-
// //     dateTime: String]-
// //isActive,presenter,description,link,dateTime
const mongoose_1 = __importDefault(require("mongoose"));
const SeminarSchema = new mongoose_1.default.Schema({
    isActive: {
        type: Boolean,
        default: true,
    },
    presenter: {
        type: String,
        trim: true,
        maxLength: [50, "Presenter name should be less than 50 characters"],
        required: [true, "Please provide presenter name"],
    },
    description: {
        type: String,
        trim: true,
        maxLength: [255, "Description should be less than 255 characters"],
        required: [true, "Please provide description"],
    },
    dateTime: {
        type: String,
        trim: true,
        maxLength: [50, "Date and time should be less than 50 characters"],
        required: [true, "Please provide date and time"],
    },
    link: {
        type: String,
        trim: true,
        maxLength: [255, "Link should be less than 255 characters"],
        required: [true, "Please provide link"],
    },
});
exports.default = mongoose_1.default.model("Seminar", SeminarSchema);
