// // 7. seminar :- [isActive: Boolean,-
// //     presenter: String,-
// //     description: String,-
// //     link: String,-
// //     dateTime: String]-
// //isActive,presenter,description,link,dateTime
import mongoose, { Schema, Document } from "mongoose";
export interface ISeminar extends Document {
  isActive: boolean;
  presenter: string;
  description: string;
  link: string;
  dateTime: string;
}

const SeminarSchema: Schema = new mongoose.Schema<ISeminar>({
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
export default mongoose.model<ISeminar>("Seminar", SeminarSchema);
