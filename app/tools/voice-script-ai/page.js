"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Header } from "../../../components/Header";

export default function VoiceScriptAI() {
  const { data: session } = useSession();

  const [topic, setTopic] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("Narrative");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState("");

  const exampleTopics = [
    "Promotional video for a new coffee shop",
    "Motivational speech for students",
    "Story narration for a YouTube short",
    "Podcast intro for tech news"
  ];

  const handleGenerateScript = async () => {
    if (!session) {
      await signIn("github");
      return;
    }

    if (!topic.trim()) {
      setScript("Please enter a topic or idea!");
      return;
    }

    setLoading(true);
    setScript("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "Voice Script AI",
          message: topic,
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
        setScript("Server returned invalid response");
        return;
      }

      if (!res.ok) {
        setScript(data?.error || "Failed to generate script");
        return;
      }

      setScript(data?.result || "No script generated");
    } catch (err) {
      console.error("Client fetch error:", err);
      setScript("Failed to fetch from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header />

      <main className="flex flex-col items-center flex-1 w-full max-w-3xl px-4 py-24 pb-32 mx-auto sm:py-32 md:py-36">
        <h1 className="mb-4 text-3xl font-extrabold text-center sm:text-4xl md:text-5xl text-neongreen drop-shadow-lg">
          Voice Script AI 🎙️
        </h1>
        <p className="mb-10 text-base text-center text-gray-400 sm:text-lg md:text-xl">
          Enter a topic and let AI create a ready-to-read voice script.
        </p>

        {/* Example Topics */}
        <div className="grid w-full grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {exampleTopics.map((ex, i) => (
            <div
              key={i}
              className="p-3 text-sm text-gray-300 transition bg-gray-900 border cursor-pointer sm:text-base rounded-xl border-neongreen hover:bg-gray-800 hover:scale-105"
              onClick={() => setTopic(ex)}
            >
              {ex}
            </div>
          ))}
        </div>

        {/* Topic Input */}
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your topic or idea..."
          rows={5}
          className="w-full p-4 mb-4 text-base placeholder-gray-500 transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neongreen"
        />

        {/* Additional Info */}
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Optional: style, duration, audience, characters..."
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
              <option>Narrative</option>
              <option>Funny</option>
              <option>Inspirational</option>
              <option>Professional</option>
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
          onClick={handleGenerateScript}
          className="relative z-10 w-full py-3 text-lg font-bold transition-all duration-300 shadow-md sm:py-4 sm:text-xl rounded-xl bg-neongreen text-darkbg hover:bg-green-500 hover:scale-105 active:scale-95"
        >
          {!session ? "Sign in to Generate" : loading ? "Generating..." : "Generate Script"}
        </button>

        {/* Output */}
        {script && (
          <div className="relative z-10 flex flex-col items-start w-full p-5 mt-8 text-gray-100 whitespace-pre-line transition-all bg-gray-900 border shadow-inner rounded-xl border-neongreen">
            <span>{script}</span>
            <button
              onClick={() => navigator.clipboard.writeText(script)}
              className="px-3 py-1 mt-4 text-sm transition rounded bg-neongreen hover:bg-green-500"
            >
              Copy
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
