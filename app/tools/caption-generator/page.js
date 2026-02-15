"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Header } from "../../../components/Header";

export default function CaptionGenerator() {
  const { data: session } = useSession();

  const [input, setInput] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("Funny");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");

  const examplePrompts = [
    "Sunset on the beach with friends",
    "My cat sleeping on my laptop",
    "Delicious homemade pizza",
    "Road trip adventure with besties"
  ];

  const handleGenerateCaption = async () => {
    if (!session) {
      await signIn("github");
      return;
    }

    if (!input.trim()) {
      setCaption("Please enter a prompt or description first!");
      return;
    }

    setLoading(true);
    setCaption("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "Caption Generator",
          message: input,
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
        setCaption("Server returned invalid response");
        return;
      }

      if (!res.ok) {
        setCaption(data?.error || "Failed to generate caption");
        return;
      }

      setCaption(data?.result || "No caption generated");
    } catch (err) {
      console.error("Client fetch error:", err);
      setCaption("Failed to fetch from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header />

      <main className="flex flex-col items-center flex-1 w-full max-w-3xl px-4 py-24 pb-32 mx-auto sm:py-32 md:py-36">
        <h1 className="mb-4 text-3xl font-extrabold text-center sm:text-4xl md:text-5xl text-neonpink drop-shadow-lg">
          Caption Generator ✨
        </h1>
        <p className="mb-10 text-base text-center text-gray-400 sm:text-lg md:text-xl">
          Enter a photo description, theme, or idea and generate a catchy caption.
        </p>

        {/* Example Prompts */}
        <div className="grid w-full grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {examplePrompts.map((ex, i) => (
            <div
              key={i}
              className="p-3 text-sm text-gray-300 transition bg-gray-900 border cursor-pointer sm:text-base rounded-xl border-neonpink hover:bg-gray-800 hover:scale-105"
              onClick={() => setInput(ex)}
            >
              {ex}
            </div>
          ))}
        </div>

        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a description, theme, or idea..."
          rows={5}
          className="w-full p-4 mb-4 text-base placeholder-gray-500 transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonpink"
        />

        {/* Additional Info */}
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Optional: add hashtags, audience, or context..."
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
              <option>Funny</option>
              <option>Inspirational</option>
              <option>Romantic</option>
              <option>Cool</option>
              <option>Casual</option>
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
              
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateCaption}
          className="relative z-10 w-full py-3 text-lg font-bold transition-all duration-300 shadow-md sm:py-4 sm:text-xl rounded-xl bg-neonpink text-darkbg hover:bg-pink-500 hover:scale-105 active:scale-95"
        >
          {!session ? "Sign in to Generate" : loading ? "Generating..." : "Generate Caption"}
        </button>

        {/* Output */}
        {caption && (
          <div className="relative z-10 flex flex-col items-start w-full p-5 mt-8 text-gray-100 whitespace-pre-line transition-all bg-gray-900 border shadow-inner rounded-xl border-neonpink">
            <span>{caption}</span>
            <button
              onClick={() => navigator.clipboard.writeText(caption)}
              className="px-3 py-1 mt-4 text-sm transition rounded bg-neonpink hover:bg-pink-500"
            >
              Copy
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
