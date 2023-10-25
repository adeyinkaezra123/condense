import { Schema, model } from "mongoose";
// const ObjectId = Schema.ObjectId;

const SummariesSchema: Schema = new Schema({
  _id: Schema.Types.UUID,
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  videoTitle: { type: String, required: true },
  videoId: { type: String, required: true },
  rawTranscript: { type: String, required: true },
  cleanTranscript: String,
  summary: String,
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: String,
});


SummariesSchema.pre("save", function (next) {
  this.updatedAt = new Date().toISOString(); // update the date every time a blog post is saved
  next();
});

const SummariesModel = model("Summaries", SummariesSchema);

export default SummariesModel;
