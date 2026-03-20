// server.js (or index.js)
import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import dotenv from "dotenv";
import PDFParser from "pdf2json";
import connectDB from "./lib/mongodb.js";
import Analysis from "./models/Analysis.js";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// ────────────────────────────────────────────────
// Connect to MongoDB once at startup
// ────────────────────────────────────────────────
connectDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit if DB fails (Railway will restart)
  });

// ────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "https://your-vercel-app-name.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001", // add others if needed
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json()); // for JSON bodies (if you add other routes later)

// ────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Resume AI Pro Backend – OK");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.post("/analyze", upload.single("resume"), async (req, res) => {
  console.log(`[${new Date().toISOString()}] POST /analyze received`);

  try {
    const { jobDescription } = req.body;
    const buffer = req.file?.buffer;

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    if (!jobDescription?.trim()) {
      return res.status(400).json({ error: "Job description is required" });
    }

    console.log(`File size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log(`Job description length: ${jobDescription.length} chars`);

    // ───── PDF Text Extraction ─────
    const pdfParser = new PDFParser(null, 1);

    const resumeText = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pdfParser.destroy();
        reject(new Error("PDF parsing timeout after 12 seconds"));
      }, 12000);

      pdfParser.on("pdfParser_dataReady", () => {
        clearTimeout(timeout);
        const rawText = pdfParser.getRawTextContent() || "";
        resolve(decodeURIComponent(rawText).trim());
      });

      pdfParser.on("pdfParser_dataError", (err) => {
        clearTimeout(timeout);
        reject(err);
      });

      pdfParser.parseBuffer(buffer);
    });

    console.log(`Extracted text length: ${resumeText.length} chars`);

    // Dummy delay (you can remove later)
    await new Promise((r) => setTimeout(r, 1500));

    // ───── Dummy AI Response (replace with real Gemini/OpenAI later) ─────
    const aiData = {
      atsScore: Math.floor(Math.random() * 30 + 70), // 70-100
      missingKeywords: [
        "React Native",
        "TypeScript",
        "CI/CD Pipelines",
        "AWS S3",
        "Unit Testing",
      ],
      suggestions:
        "• Add a dedicated 'Skills' section for better ATS readability.\n• Use more action verbs like 'Architected' or 'Spearheaded'.\n• Quantify your achievements (e.g., 'Improved performance by 20%').",
      rewrittenBullets:
        "• Architected a scalable React frontend reducing load times by 35%.\n• Spearheaded the integration of AWS Lambda for serverless image processing.\n• Mentored 5 junior developers on TypeScript best practices.",
    };

    // Save to MongoDB
    const analysis = await Analysis.create({
      resumeText: resumeText || "No text extracted",
      jobDescription,
      ...aiData,
      createdAt: new Date(),
    });

    console.log(`Analysis saved with ID: ${analysis._id}`);

    res.json({
      success: true,
      data: aiData,
      analysisId: analysis._id,
    });
  } catch (error) {
    console.error("Error in /analyze:", error.stack || error);
    res.status(500).json({
      error: "Analysis failed",
      message: error.message,
    });
  }
});

// ────────────────────────────────────────────────
// Global Error Handler
// ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack || err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ────────────────────────────────────────────────
// Unhandled Promise Rejection Handler
// ────────────────────────────────────────────────
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // In production you might want to notify (Sentry, etc.) but don't exit
});

// ────────────────────────────────────────────────
// Start Server
// ────────────────────────────────────────────────
const PORT = process.env.PORT || 5050;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
