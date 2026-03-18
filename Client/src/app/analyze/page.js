"use client";

import { useState } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { analyzeResume } from "@/lib/analyzeResume";

export default function AnalyzePage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm();

  const resumeFile = watch("resume");

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", data.resume[0]);
    formData.append("jobDescription", data.jobDescription);

    const response = await analyzeResume(formData);

    if (response.error) {
      setError(response.error);
    } else {
      setResult(response.data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#0a66c2]">
          Resume Analyzer
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Left: Resume Upload */}
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">
                Upload Resume (PDF)
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-[#10b981] transition">
                <input
                  type="file"
                  accept=".pdf"
                  {...register("resume", { required: true })}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-4 text-[#0a66c2]" size={48} />
                  <p className="text-lg">
                    {resumeFile?.[0]?.name || "Click or drag PDF here"}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">Max 5MB</p>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Job Description */}
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">
                Job Description
              </label>
              <textarea
                {...register("jobDescription", { required: true })}
                rows={12}
                className="w-full p-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] bg-white dark:bg-slate-900"
                placeholder="Paste the full job description here..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !resumeFile}
              className="w-full bg-[#0a66c2] hover:bg-[#084d9b] text-white font-semibold py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-8 p-6 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-4">
            <AlertCircle className="text-red-600 flex-shrink-0" size={28} />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-[#0a66c2] to-[#10b981] text-white text-5xl font-bold px-10 py-6 rounded-full">
                {result.atsScore}%
              </div>
              <p className="text-2xl font-semibold mt-4">ATS Score</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#10b981]">
                  Missing Keywords
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  {result.missingKeywords.map((kw, i) => (
                    <li key={i}>{kw}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#10b981]">
                  Suggestions
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  {result.suggestions.split("\n").map((line, i) => (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-[#10b981]">
                Rewritten Bullets
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl whitespace-pre-line">
                {result.rewrittenBullets}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
