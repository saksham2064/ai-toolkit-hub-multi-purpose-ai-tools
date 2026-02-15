"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Header } from "../../../components/Header";

export default function SummarizerAI() {
  const { data: session } = useSession();

  const [text, setText] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("Concise");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const exampleTexts = [
    "Long article about climate change and its impact on the environment.",
    "Meeting notes about project planning and deadlines.",
    "Research paper on AI trends and future technologies.",
    "Blog post about tips for productivity and time management."
  ];

  const handleSummarize = async () => {
    if (!session) {
      await signIn("github");
      return;
    }

    if (!text.trim()) {
      setSummary("Please enter text to summarize!");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "Summarizer AI",
          message: text,
          additionalInfo,
          tone,
          language
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON:", jsonErr);
        setSummary("Server returned invalid response");
        return;
      }

      if (!res.ok) {
        setSummary(data?.error || "Failed to summarize");
        return;
      }

      setSummary(data?.result || "No summary generated");
    } catch (err) {
      console.error("Client fetch error:", err);
      setSummary("Failed to fetch from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header />

      <main className="flex flex-col items-center flex-1 w-full max-w-3xl px-4 py-24 pb-32 mx-auto sm:py-32 md:py-36">
        <h1 className="mb-4 text-3xl font-extrabold text-center sm:text-4xl md:text-5xl text-neonyellow drop-shadow-lg">
          Summarizer AI 📝
        </h1>
        <p className="mb-10 text-base text-center text-gray-400 sm:text-lg md:text-xl">
          Paste your text and get a concise summary instantly.
        </p>

        {/* Example Texts */}
        <div className="grid w-full grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {exampleTexts.map((ex, i) => (
            <div
              key={i}
              className="p-3 text-sm text-gray-300 transition bg-gray-900 border cursor-pointer sm:text-base rounded-xl border-neonyellow hover:bg-gray-800 hover:scale-105"
              onClick={() => setText(ex)}
            >
              {ex}
            </div>
          ))}
        </div>

        {/* Text Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text to summarize..."
          rows={6}
          className="w-full p-4 mb-4 text-base placeholder-gray-500 transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonyellow"
        />

        {/* Additional Info */}
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Optional: audience, style, key points to include..."
          rows={3}
          className="w-full p-4 mb-6 text-base placeholder-gray-500 transition bg-gray-800 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonpurple"
        />

        {/* Tone + Language */}
        <div className="flex flex-col w-full mb-6 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-300">Tone:</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 text-base transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonpurple"
            >
              <option>Concise</option>
              <option>Professional</option>
              <option>Friendly</option>
              <option>Informative</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-300">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 text-base transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonpurple"
            >
              <option>English</option>
              <option>Nepali</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleSummarize}
          className="relative z-10 w-full py-3 text-lg font-bold transition-all duration-300 shadow-md sm:py-4 sm:text-xl rounded-xl bg-neonpink text-darkbg hover:bg-pink-500 hover:scale-105 active:scale-95"
        >
          {!session ? "Sign in to Summarize" : loading ? "Summarizing..." : "Summarize Text"}
        </button>

        {/* Output */}
        {summary && (
          <div className="relative z-10 flex flex-col items-start w-full p-5 mt-8 text-gray-100 whitespace-pre-line transition-all bg-blue-900 border shadow-inner rounded-xl border-neonyellow">
            <span>{summary}</span>
            <button
              onClick={() => navigator.clipboard.writeText(summary)}
              className="px-3 py-1 mt-4 text-sm transition rounded bg-neonyellow hover:bg-yellow-500"
            >
              Copy
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
