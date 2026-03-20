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

const Analysis =
  mongoose.models.Analysis || mongoose.model("Analysis", AnalysisSchema);

export default Analysis;
