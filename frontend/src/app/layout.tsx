import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Recast AI — Autonomous Enterprise Data Migration & Smart Parsing Agent",
  description:
    "Convert messy legacy data, 1-line addresses, and Hinglish notes into clean 11-column structured schemas using LangGraph, Docling, PaddleOCR, and Gemma 4 multimodal reasoning.",
  keywords: [
    "Recast AI",
    "Data Migration Agent",
    "Smart Parsing",
    "Gemma 4",
    "LangGraph",
    "Docling",
    "PaddleOCR",
    "Unstructured",
    "Hinglish Parser",
    "Enterprise Schema"
  ],
  authors: [{ name: "Recast AI Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fbf9f4] text-stone-900 font-sans selection:bg-amber-200/80 selection:text-stone-900">
        {children}
      </body>
    </html>
  );
}
