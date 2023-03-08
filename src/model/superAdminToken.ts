// [( superadminID/adminID): ID from perticular table,
// accessToken: String,
// refreshToken: String,
// isValid: Boolean, default: true]
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISuperAdminToken extends Document {
  isValid: boolean;
  accessToken: string;
  refreshToken: string;
  Id: Types.ObjectId;
}
const SuperAdminToken: Schema = new mongoose.Schema<ISuperAdminToken>({
  isValid: {
    type: Boolean,
    default: true,
  },
  Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuperAdmin",
  },
  refreshToken: { type: String, required: true },
  accessToken: { type: String, required: true },
});
export default mongoose.model<ISuperAdminToken>(
  "SuperAdminToken",
  SuperAdminToken
);
