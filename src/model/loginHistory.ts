import mongoose, { Schema, Document, Types } from "mongoose";
export interface ILoginHistory extends Document {
  superAdminID: Types.ObjectId;
  adminID: Types.ObjectId;
  facultyID: Types.ObjectId;
  financeID: Types.ObjectId;
  marketingID: Types.ObjectId;
  studentID: Types.ObjectId;
  email: string;
  password: string;
  property: string;
  os: string;
  userAgent: string;
  browser: string;
  device: string;
  os_version: string;
  browser_version: string;
  deviceType: string;
  orientation: string;
  ip: string;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
}
const logSchema: Schema = new mongoose.Schema<ILoginHistory>(
  {
    superAdminID: { type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin" },
    adminID: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    facultyID: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    financeID: { type: mongoose.Schema.Types.ObjectId, ref: "Finance" },
    marketingID: { type: mongoose.Schema.Types.ObjectId, ref: "Marketing" },
    studentID: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    property: { type: String },
    userAgent: { type: String },
    os: { type: String },
    browser: { type: String },
    device: { type: String },
    os_version: { type: String },
    browser_version: { type: String },
    deviceType: { type: String },
    orientation: { type: String },
    isDesktop: { type: Boolean },
    isMobile: { type: Boolean },
    isTablet: { type: Boolean },
    ip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ILoginHistory>("LogHistory", logSchema);
