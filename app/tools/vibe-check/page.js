"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Header } from "../../../components/Header";

export default function VibeChecker() {
  const { data: session } = useSession();

  const [input, setInput] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [vibe, setVibe] = useState("");

  const exampleMessages = [
    "Just finished my work early, feeling great! 😎",
    "My boss just yelled at me for no reason...",
    "Thinking about life and feeling kinda meh.",
    "Got an unexpected gift from a friend today!"
  ];

  const handleCheckVibe = async () => {
    if (!session) {
      await signIn("github");
      return;
    }

    if (!input.trim()) {
      setVibe("Please enter a message first!");
      return;
    }

    setLoading(true);
    setVibe("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "Vibe Checker",
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
        setVibe("Server returned invalid response");
        return;
      }

      if (!res.ok) {
        setVibe(data?.error || "Failed to check vibe");
        return;
      }

      setVibe(data?.result || "No vibe detected");
    } catch (err) {
      console.error("Client fetch error:", err);
      setVibe("Failed to fetch from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header />

      <main className="flex flex-col items-center flex-1 w-full max-w-3xl px-4 py-24 pb-32 mx-auto sm:py-32 md:py-36">
        <h1 className="mb-4 text-3xl font-extrabold text-center sm:text-4xl md:text-5xl text-neonblue drop-shadow-lg">
          Vibe Checker ✨
        </h1>
        <p className="mb-10 text-base text-center text-gray-400 sm:text-lg md:text-xl">
          Paste your message and see what vibe it gives off. 🕵️‍♂️
        </p>

        {/* Example Messages */}
        <div className="grid w-full grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {exampleMessages.map((ex, i) => (
            <div
              key={i}
              className="p-3 text-sm text-gray-300 transition bg-gray-900 border cursor-pointer sm:text-base rounded-xl border-neonblue hover:bg-gray-800 hover:scale-105"
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
          placeholder="Type or paste your message..."
          rows={5}
          className="w-full p-4 mb-4 text-base placeholder-gray-500 transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonblue"
        />

        {/* Additional Info */}
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Optional: Add extra context..."
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
              <option>Friendly</option>
              <option>Neutral</option>
              <option>Serious</option>
              <option>Funny</option>
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

        {/* Analyze Button */}
        <button
          onClick={handleCheckVibe}
          className="relative z-10 w-full py-3 text-lg font-bold transition-all duration-300 shadow-md sm:py-4 sm:text-xl rounded-xl bg-neonblue text-darkbg hover:bg-blue-500 hover:scale-105 active:scale-95"
        >
          {!session ? "Sign in to Check Vibe" : loading ? "Checking..." : "Check Vibe"}
        </button>

        {/* Output */}
        {vibe && (
          <div className="relative z-10 flex items-center justify-between w-full p-5 mt-8 text-gray-100 whitespace-pre-line transition-all bg-gray-900 border shadow-inner rounded-xl border-neonblue">
            <span>{vibe}</span>
            <button
              onClick={() => navigator.clipboard.writeText(vibe)}
              className="px-3 py-1 ml-4 text-sm transition rounded bg-neonblue hover:bg-blue-500"
            >
              Copy
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
