import mongoose, { Schema, Document, Types } from "mongoose";
// 1. course :- [isActive: Boolean,-
//     school: ID from school table,-
//     courseName: String,-
//     description:  String,-
//     fees:  String,-
//     duration:  String]-
//isActive,school,courseName,description,fees,duration
export interface ICourse extends Document {
  isActive: boolean;
  courseName: string;
  description: string;
  fees: string;
  duration: string;
  school: Types.ObjectId;
}
const CourseSchema: Schema = new mongoose.Schema<ICourse>({
  isActive: {
    type: Boolean,
    default: true,
  },
  courseName: {
    type: String,
    trim: true,
    maxLength: [100, "coursename should be less than 50 characters"],
    required: [true, "please provide coursename"],
  },
  description: {
    type: String,
    trim: true,
    maxLength: [200, "description should be less than 200 characters"],
    required: [true, "must provide description"],
  },
  // changes are required on basis of the type
  fees: {
    type: String,
    trim: true,
    maxLength: [100, "fees should be less than 100 characters"],
    required: [true, " provide fees"],
  },
  duration: {
    type: String,
    trim: true,
    maxLength: [50, "duration should be less than 50 characters"],
    required: [true, " provide duration"],
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
});
export default mongoose.model<ICourse>("Course", CourseSchema);
