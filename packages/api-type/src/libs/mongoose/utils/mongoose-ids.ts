import mongoose from "mongoose";
import type { ToObjectId } from "#mongoose-wrapper/mongoose-types";

export const toObjectId: ToObjectId = (id) => {
  if (typeof id === "number") {
    return mongoose.Types.ObjectId.createFromTime(id);
  }
  return new mongoose.Types.ObjectId(id.toString());
};
