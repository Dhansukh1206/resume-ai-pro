import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fromBuffer } from "pdf2pic";
import { createWorker } from "tesseract.js";
import PDFParser from "pdf2json";
import connectDB from "./lib/mongodb.js";
import Analysis from "./models/Analysis.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    await connectDB();
    const { jobDescription } = req.body;
    const buffer = req.file?.buffer;

    if (!buffer || !jobDescription) {
      return res.status(400).json({ error: "Missing file or JD" });
    }

    const pdfParser = new PDFParser(null, 1);
    const resumeText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", () => {
        const rawText = pdfParser.getRawTextContent() || "";
        resolve(decodeURIComponent(rawText).trim());
      });
      pdfParser.on("pdfParser_dataError", (err) => reject(err));
      pdfParser.parseBuffer(buffer);
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiData = {
      atsScore: Math.floor(Math.random() * 100),
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
        "• Architected a scalable React frontend reducing load times by 35%.\n• Spearheaded the integration of AWS Lambda for serverless image processing.\n• Mentored 5 junior developers on TypeScript best practices and clean code.",
    };

    const analysis = await Analysis.create({
      resumeText: resumeText || "Dummy Resume Text",
      jobDescription,
      ...aiData,
    });

    res.json({
      success: true,
      data: aiData,
      id: analysis._id,
    });
  } catch (error) {
    console.error("Test Worker Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(5050, "0.0.0.0", () =>
  console.log("Test Worker running on port 5050 (Dummy Mode)"),
);
