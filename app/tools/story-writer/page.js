"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Header } from "../../../components/Header";

export default function StoryWriter() {
  const { data: session } = useSession();

  const [prompt, setPrompt] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("Adventure");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");

  const examplePrompts = [
    "A young wizard discovers a hidden city",
    "A detective investigates a mysterious disappearance",
    "A friendship between a robot and a child",
    "A journey across a magical forest"
  ];

  const handleGenerateStory = async () => {
    if (!session) {
      await signIn("github");
      return;
    }

    if (!prompt.trim()) {
      setStory("Please enter a story prompt first!");
      return;
    }

    setLoading(true);
    setStory("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "Story Writer",
          message: prompt,
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
        setStory("Server returned invalid response");
        return;
      }

      if (!res.ok) {
        setStory(data?.error || "Failed to generate story");
        return;
      }

      setStory(data?.result || "No story generated");
    } catch (err) {
      console.error("Client fetch error:", err);
      setStory("Failed to fetch from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header />

      <main className="flex flex-col items-center flex-1 w-full max-w-3xl px-4 py-24 pb-32 mx-auto sm:py-32 md:py-36">
        <h1 className="mb-4 text-3xl font-extrabold text-center sm:text-4xl md:text-5xl text-neonorange drop-shadow-lg">
          Story Writer ✍️
        </h1>
        <p className="mb-10 text-base text-center text-gray-400 sm:text-lg md:text-xl">
          Enter a story prompt and let AI craft an engaging story for you.
        </p>

        {/* Example Prompts */}
        <div className="grid w-full grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {examplePrompts.map((ex, i) => (
            <div
              key={i}
              className="p-3 text-sm text-gray-300 transition bg-gray-900 border cursor-pointer sm:text-base rounded-xl border-neonorange hover:bg-gray-800 hover:scale-105"
              onClick={() => setPrompt(ex)}
            >
              {ex}
            </div>
          ))}
        </div>

        {/* Prompt Input */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your story prompt..."
          rows={5}
          className="w-full p-4 mb-4 text-base placeholder-gray-500 transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonorange"
        />

        {/* Additional Info */}
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Optional: add characters, setting, genre, or style..."
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
              <option>Adventure</option>
              <option>Romance</option>
              <option>Mystery</option>
              <option>Fantasy</option>
              <option>Humor</option>
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
          onClick={handleGenerateStory}
          className="relative z-10 w-full py-3 text-lg font-bold transition-all duration-300 shadow-md sm:py-4 sm:text-xl rounded-xl bg-neonpink text-darkbg hover:bg-pink-500 hover:scale-105 active:scale-95"
        >
          {!session ? "Sign in to Generate" : loading ? "Generating..." : "Generate Story"}
        </button>

        {/* Output */}
        {story && (
          <div className="relative z-10 flex flex-col items-start w-full p-5 mt-8 text-gray-100 whitespace-pre-line transition-all bg-gray-900 border shadow-inner rounded-xl border-neonorange">
            <span>{story}</span>
            <button
              onClick={() => navigator.clipboard.writeText(story)}
              className="px-3 py-1 mt-4 text-sm transition rounded bg-neonorange hover:bg-orange-500"
            >
              Copy
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
