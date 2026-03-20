import { NextResponse } from "next/server";
import PDFParser from "pdf2json";
import connectDB from "@/lib/mongodb";
import Analysis from "@/models/Analysis";

export async function POST(req) {
  console.log(`[${new Date().toISOString()}] POST /api/analyze received`);

  try {
    const formData = await req.formData();
    const resumeFile = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    if (!resumeFile) {
      return NextResponse.json({ error: "No resume file uploaded" }, { status: 400 });
    }

    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
        reject(err.parserError || err);
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
    await connectDB();
    const analysis = await Analysis.create({
      resumeText: resumeText || "No text extracted",
      jobDescription,
      ...aiData,
      createdAt: new Date(),
    });

    console.log(`Analysis saved with ID: ${analysis._id}`);

    return NextResponse.json({
      success: true,
      data: aiData,
      analysisId: analysis._id,
    });
  } catch (error) {
    console.error("Error in /api/analyze:", error.stack || error);
    return NextResponse.json(
      { error: "Analysis failed", message: error.message },
      { status: 500 }
    );
  }
}
