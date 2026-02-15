"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Header } from "../../../components/Header";

export default function RedFlagAnalyzer() {
  const { data: session } = useSession();

  const [input, setInput] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("Neutral");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const exampleScenarios = [
    "Received an email asking for my banking info urgently.",
    "Someone I just met online wants to invest in my business immediately.",
    "My colleague always asks me to cover their tasks but never reciprocates.",
    "A seller is offering a deal that seems too good to be true."
  ];

  const handleAnalyze = async () => {
    if (!session) {
      await signIn("github");
      return;
    }

    if (!input.trim()) {
      setAnalysis("Please enter a message or scenario first!");
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      console.log("Sending to API:", { tool: "Red Flag Analyzer", message: input, additionalInfo, tone, language });

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "Red Flag Analyzer", message: input, additionalInfo, tone, language }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON from server:", jsonErr);
        setAnalysis("Server returned invalid JSON");
        return;
      }

      if (!res.ok) {
        console.error("Server error response:", data);
        setAnalysis(data?.error || "Failed to analyze input");
        return;
      }

      setAnalysis(data?.result || "No analysis received from server");
    } catch (err) {
      console.error("Client fetch error:", err);
      setAnalysis("Failed to fetch from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header />

      <main className="flex flex-col items-center flex-1 w-full max-w-3xl px-4 py-24 pb-32 mx-auto sm:py-32 md:py-36">
        <h1 className="mb-4 text-3xl font-extrabold text-center sm:text-4xl md:text-5xl text-neonred drop-shadow-lg">
          Red Flag Analyzer 🚨
        </h1>
        <p className="mb-10 text-base text-center text-gray-400 sm:text-lg md:text-xl">
          Paste a message or scenario, provide extra context, and AI will highlight potential red flags.
        </p>

        {/* Example Scenarios */}
        <div className="grid w-full grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {exampleScenarios.map((ex, i) => (
            <div
              key={i}
              className="p-3 text-sm text-gray-300 transition bg-gray-900 border cursor-pointer sm:text-base rounded-xl border-neonred hover:bg-gray-800 hover:scale-105"
              onClick={() => setInput(ex)}
            >
              {ex}
            </div>
          ))}
        </div>

        {/* Main Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste the message or scenario you want analyzed..."
          rows={5}
          className="w-full p-4 mb-4 text-base placeholder-gray-500 transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonred"
        />

        {/* Additional Info */}
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Optional: Add extra context or information..."
          rows={3}
          className="w-full p-4 mb-6 text-base placeholder-gray-500 transition bg-gray-800 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonblue"
        />

        {/* Tone + Language */}
        <div className="flex flex-col w-full mb-6 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-300">Select Tone:</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 text-base transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonblue"
            >
              <option>Neutral</option>
              <option>Serious</option>
              <option>Friendly</option>
              <option>Strict</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-300">Select Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 text-base transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonblue"
            >
              <option>English</option>
              <option>Nepali</option>
              <option>Hindi</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          className="w-full py-3 text-lg font-bold transition-all duration-300 shadow-md sm:py-4 sm:text-xl rounded-xl bg-neonpurple hover:bg-neonpink hover:scale-105 active:scale-95"
        >
          {!session ? "Sign in to Analyze" : loading ? "Analyzing..." : "Analyze Red Flags"}
        </button>

{/* 
         <button
          onClick={handleGenerate}
        >
          {!session ? "Sign in to Generate" : loading ? "Generating..." : "Generate Reply"}
        </button> */}

        {/* Output */}
        {analysis && (
          <div className="relative z-10 flex items-center justify-between w-full p-5 mt-8 text-gray-100 whitespace-pre-line transition-all bg-gray-900 border shadow-inner rounded-xl border-neonred">
            <span>{analysis}</span>
            <button
              onClick={() => navigator.clipboard.writeText(analysis)}
              className="px-3 py-1 ml-4 text-sm transition rounded bg-neonred hover:bg-red-600"
            >
              Copy
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
