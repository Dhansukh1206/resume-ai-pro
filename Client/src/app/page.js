import Link from "next/link";
import { Upload, Award, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0a66c2] to-[#10b981] text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl font-bold mb-6">
            Get Your Resume AI-Optimized in Seconds
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Upload your resume + job description. Get ATS score, rewritten
            bullets, and expert suggestions instantly.
          </p>
          <Link
            href="/analyze"
            className="bg-white text-[#0a66c2] font-semibold px-10 py-4 rounded-xl text-lg inline-flex items-center gap-3 hover:scale-105 transition"
          >
            Start Analyzing Now <Upload size={24} />
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div className="text-center">
          <Award className="mx-auto mb-4 text-[#10b981]" size={48} />
          <h3 className="text-2xl font-semibold mb-3">ATS Score</h3>
          <p className="text-slate-600">Real-time score + missing keywords</p>
        </div>
        <div className="text-center">
          <MessageCircle className="mx-auto mb-4 text-[#10b981]" size={48} />
          <h3 className="text-2xl font-semibold mb-3">AI Chat Assistant</h3>
          <p className="text-slate-600">Ask anything about your resume</p>
        </div>
        <div className="text-center">
          <Upload className="mx-auto mb-4 text-[#10b981]" size={48} />
          <h3 className="text-2xl font-semibold mb-3">One-Click Export</h3>
          <p className="text-slate-600">Download optimized PDF</p>
        </div>
      </div>
    </div>
  );
}
