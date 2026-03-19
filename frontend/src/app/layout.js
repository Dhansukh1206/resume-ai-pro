import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ResumeAI Pro - AI Resume Optimizer",
  description: "Optimize your resume with AI in seconds",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
