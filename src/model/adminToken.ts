// [( superadminID/adminID): ID from perticular table,
// accessToken: String,
// refreshToken: String,
// isValid: Boolean, default: true]
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAdminToken extends Document {
  isValid: boolean;
  accessToken: string;
  refreshToken: string;
  Id: Types.ObjectId;
}
const AdminToken: Schema = new mongoose.Schema<IAdminToken>({
  isValid: {
    type: Boolean,
    default: true,
  },
  Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  refreshToken: { type: String, required: true },
  accessToken: { type: String, required: true },
});
export default mongoose.model<IAdminToken>("AdminToken", AdminToken);
