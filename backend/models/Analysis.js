import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema(
  {
    resumeText: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: String,
      required: true,
    },
    rewrittenBullets: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// This check prevents Mongoose from trying to re-compile the model
// if the server restarts during development (hot-reloading).
const Analysis =
  mongoose.models.Analysis || mongoose.model("Analysis", AnalysisSchema);

export default Analysis;
