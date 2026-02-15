"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Header } from "../../../components/Header";

export default function SavageReply() {
  const { data: session } = useSession();

  const [input, setInput] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState(""); // ✅ New field
  const [tone, setTone] = useState("Savage");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");

  const exampleReplies = [
    "Oh wow, that was cute. Try harder next time.",
    "Haha, keep dreaming buddy!",
    "Wow, impressive... not.",
    "Cold & classy: I'll pretend I didn’t see that."
  ];

  const handleGenerate = async () => {
    if (!session) {
      await signIn("github");
      return;
    }

    if (!input.trim()) {
      setReply("Please enter a message first!");
      return;
    }

    setLoading(true);
    setReply("");

    try {
      console.log("Sending to API:", { tool: "Savage Reply", message: input, additionalInfo, tone, language });

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "Savage Reply", message: input, additionalInfo, tone, language }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON from server:", jsonErr);
        setReply("Server returned invalid JSON");
        return;
      }

      if (!res.ok) {
        console.error("Server error response:", data);
        setReply(data?.error || "Failed to generate reply");
        return;
      }

      setReply(data?.result || "No reply received from server");
    } catch (err) {
      console.error("Client fetch error:", err);
      setReply("Failed to fetch from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header />
      <main className="flex flex-col items-center flex-1 w-full max-w-3xl px-4 py-24 mx-auto sm:py-32 md:py-36">
        <h1 className="mb-4 text-3xl font-extrabold text-center sm:text-4xl md:text-5xl text-neonpurple drop-shadow-lg">
          Savage Reply Generator 🔥
        </h1>
        <p className="mb-10 text-base text-center text-gray-400 sm:text-lg md:text-xl">
          Drop the message and let AI craft the perfect comeback.
        </p>

        {/* Example Replies */}
        <div className="grid w-full grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {exampleReplies.map((ex, i) => (
            <div
              key={i}
              className="p-3 text-sm text-gray-300 transition bg-gray-900 border cursor-pointer sm:text-base rounded-xl border-neonpurple hover:bg-gray-800 hover:scale-105"
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
          placeholder="Paste the message you want to reply to..."
          rows={5}
          className="w-full p-4 mb-4 text-base placeholder-gray-500 transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonpurple"
        />

        {/* Additional Info */}
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Optional: Add extra context or info..."
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
              <option>Savage</option>
              <option>Funny</option>
              <option>Polite but Deadly</option>
              <option>Cold & Classy</option>
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
             
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full py-3 text-lg font-bold transition-all duration-300 shadow-md sm:py-4 sm:text-xl rounded-xl bg-neonpurple hover:bg-neonpink hover:scale-105 active:scale-95"
        >
          {!session ? "Sign in to Generate" : loading ? "Generating..." : "Generate Reply"}
        </button>

        {/* Output */}
        {reply && (
          <div className="flex items-center justify-between w-full p-5 mt-8 text-gray-100 whitespace-pre-line transition-all bg-gray-900 border shadow-inner rounded-xl border-neonpurple">
            <span>{reply}</span>
            <button
              onClick={() => navigator.clipboard.writeText(reply)}
              className="px-3 py-1 ml-4 text-sm transition rounded bg-neonpurple hover:bg-neonpink"
            >
              Copy
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
