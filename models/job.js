import { model, Schema } from "mongoose";
import { CONTRACTS } from "../constants/contract.js";

const { ObjectId } = Schema.Types;

const jobSchema = new Schema(
  {
    company: { type: String },
    position: { type: String },
    contract: { type: String, enum: Object.values(CONTRACTS) },
    location: { type: String },
    description: { type: String },
    active: { type: Boolean, default: true },
    applications: [{ type: ObjectId, ref: "User" }],
  },
  { versionKey: false }
);

const Job = model("Job", jobSchema);

export default Job;
