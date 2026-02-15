"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Header } from "../../../components/Header";

export default function ReceiptsGenerator() {
  const { data: session } = useSession();

  const [items, setItems] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState("");

  const exampleItems = [
    "1x Coffee - $3.50\n2x Sandwich - $10.00",
    "3x Notebook - $12.00\n1x Pen - $1.50",
    "2x T-shirt - $25.00\n1x Cap - $10.00"
  ];

  const handleGenerateReceipt = async () => {
    if (!session) {
      await signIn("github");
      return;
    }

    if (!items.trim()) {
      setReceipt("Please enter items and prices first!");
      return;
    }

    setLoading(true);
    setReceipt("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "Receipts Generator",
          message: items,
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
        setReceipt("Server returned invalid response");
        return;
      }

      if (!res.ok) {
        setReceipt(data?.error || "Failed to generate receipt");
        return;
      }

      setReceipt(data?.result || "No receipt generated");
    } catch (err) {
      console.error("Client fetch error:", err);
      setReceipt("Failed to fetch from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header />

      <main className="flex flex-col items-center flex-1 w-full max-w-3xl px-4 py-24 pb-32 mx-auto sm:py-32 md:py-36">
        <h1 className="mb-4 text-3xl font-extrabold text-center sm:text-4xl md:text-5xl text-neongreen drop-shadow-lg">
          Receipts Generator 🧾
        </h1>
        <p className="mb-10 text-base text-center text-gray-400 sm:text-lg md:text-xl">
          Enter your items and prices, add extra notes, and generate a formatted receipt.
        </p>

        {/* Example Items */}
        <div className="grid w-full grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {exampleItems.map((ex, i) => (
            <div
              key={i}
              className="p-3 text-sm text-gray-300 transition bg-gray-900 border cursor-pointer sm:text-base rounded-xl border-neongreen hover:bg-gray-800 hover:scale-105"
              onClick={() => setItems(ex)}
            >
              {ex}
            </div>
          ))}
        </div>

        {/* Items Input */}
        <textarea
          value={items}
          onChange={(e) => setItems(e.target.value)}
          placeholder="Enter items and prices (e.g., 1x Coffee - $3.50)"
          rows={5}
          className="w-full p-4 mb-4 text-base placeholder-gray-500 transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neongreen"
        />

        {/* Additional Info */}
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Optional: Add notes, customer name, date, etc."
          rows={3}
          className="w-full p-4 mb-6 text-base placeholder-gray-500 transition bg-gray-800 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonblue"
        />

        {/* Tone + Language */}
        <div className="flex flex-col w-full mb-6 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-300">Tone:</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 text-base transition bg-gray-900 sm:text-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-neonblue"
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Minimalist</option>
              <option>Detailed</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-300">Language:</label>
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
          onClick={handleGenerateReceipt}
          className="relative z-10 w-full py-3 text-lg font-bold transition-all duration-300 shadow-md sm:py-4 sm:text-xl rounded-xl bg-neongreen text-darkbg hover:bg-green-500 hover:scale-105 active:scale-95"
        >
          {!session ? "Sign in to Generate" : loading ? "Generating..." : "Generate Receipt"}
        </button>

        {/* Output */}
        {receipt && (
          <div className="relative z-10 flex flex-col items-start w-full p-5 mt-8 text-gray-100 whitespace-pre-line transition-all bg-gray-900 border shadow-inner rounded-xl border-neongreen">
            <span>{receipt}</span>
            <button
              onClick={() => navigator.clipboard.writeText(receipt)}
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
