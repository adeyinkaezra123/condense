import { Schema, model } from "mongoose";
// const ObjectId = Schema.ObjectId;

const SummariesSchema: Schema = new Schema({
  videoTitle: { type: String, required: true },
  videoDescription: { type: String, required: true },
  videoId: { type: String, required: true },
  transcript: { type: Object, required: true },
  summary: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: String,
});

SummariesSchema.pre("save", function (next) {
  this.updatedAt = new Date().toISOString(); // update the date every time a summary is saved
  next();
});

const SummariesModel = model("Summaries", SummariesSchema);

export default SummariesModel;
