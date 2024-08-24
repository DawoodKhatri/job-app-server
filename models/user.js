import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROLES } from "../constants/roles.js";

const { ObjectId } = Schema.Types;

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
    jobs: [{ type: ObjectId, ref: "Job" }],
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

const User = model("User", userSchema);

export default User;
