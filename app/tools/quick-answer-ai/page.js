"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Header } from "../../../components/Header";

export default function QuickAnswerAI() {
  const { data: session } = useSession();

  const [question, setQuestion] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("Concise");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const exampleQuestions = [
    "What is the fastest way to learn JavaScript?",
    "Tips to improve productivity working from home?",
    "How to secure a WordPress website?",
    "Best practices for creating REST APIs?"
  ];

  const handleGenerateAnswer = async () => {
    if (!session) {
      await signIn("github");
      return;
    }

    if (!question.trim()) {
      setAnswer("Please enter a question!");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "Quick Answer AI",
          message: question,
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
        setAnswer("Server returned invalid response");
        return;
      }

      if (!res.ok) {
        setAnswer(data?.error || "Failed to generate answer");
        return;
      }

      setAnswer(data?.result || "No answer generated");
    } catch (err) {
      console.error("Client fetch error:", err);
      setAnswer("Failed to fetch from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header />

      <main className="flex flex-col items-center flex-1 w-full max-w-3xl px-4 py-24 pb-32 mx-auto sm:py-32 md:py-36">
        <h1 className="mb-4 text-3xl font-extrabold text-center sm:text-4xl md:text-5xl text-neonred drop-shadow-lg">
          Quick Answer AI ⚡
        </h1>
        <p className="mb-10 text-base text-center text-gray-400 sm:text-lg md:text-xl">
          Ask a question and get a precise, concise AI answer instantly.
        </p>

        {/* Example Questions */}
        <div className="grid w-full grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {exampleQuestions.map((ex, i) => (
            <div
              key={i}
              className="p-3 text-sm text-gray-300 transition bg-gray-900 border cursor-pointer sm:text-base rounded-xl border-neonred hover:bg-gray-800 hover:scale-105"
              onClick={() => setQuestion(ex)}
            >
              {ex}
            </div>
          ))}
        </div>

        {/* Question Input */}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          rows={4}
          className="w-full p-4 mb-4 text-base placeholder-gray-500 transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonred"
        />

        {/* Additional Info */}
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Optional: add context or constraints..."
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
              <option>Friendly</option>
              <option>Professional</option>
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
          onClick={handleGenerateAnswer}
          className="relative z-10 w-full py-3 text-lg font-bold transition-all duration-300 shadow-md sm:py-4 sm:text-xl rounded-xl bg-neonred text-darkbg hover:bg-red-500 hover:scale-105 active:scale-95"
        >
          {!session ? "Sign in to Generate" : loading ? "Generating..." : "Get Quick Answer"}
        </button>

        {/* Output */}
        {answer && (
          <div className="relative z-10 flex flex-col items-start w-full p-5 mt-8 text-gray-100 whitespace-pre-line transition-all bg-gray-900 border shadow-inner rounded-xl border-neonred">
            <span>{answer}</span>
            <button
              onClick={() => navigator.clipboard.writeText(answer)}
              className="px-3 py-1 mt-4 text-sm transition rounded bg-neonred hover:bg-red-500"
            >
              Copy
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
