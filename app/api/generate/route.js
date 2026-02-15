// app/api/generate/route.js
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    console.log("🔹 Request received");

    // -------------------------
    // 1️⃣ Parse request body safely
    // -------------------------
    let body = {};
    try {
      body = await req.json();
      console.log("📥 Body parsed:", body);
    } catch (parseErr) {
      console.warn("⚠️ Failed to parse JSON body, using empty object", parseErr);
      body = {};
    }

    const {
      tool = "Generic",
      message = "",
      additionalInfo = "",
      tone = "Neutral",
      language = "English"
    } = body;

    if (!message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // -------------------------
    // 2️⃣ Check API key
    // -------------------------
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY not found in environment");
      return NextResponse.json(
        { error: "GEMINI_API_KEY not set in environment" },
        { status: 500 }
      );
    }

    // -------------------------
    // 3️⃣ Initialize GenAI client
    // -------------------------
    let ai;
    try {
      ai = new GoogleGenAI({ apiKey });
      console.log("🟢 GenAI client initialized");
    } catch (initErr) {
      console.error("❌ Failed to initialize GenAI client:", initErr);
      return NextResponse.json(
        { error: "Failed to initialize GenAI client", details: initErr.message || initErr },
        { status: 500 }
      );
    }

    // -------------------------
    // 4️⃣ Compose prompt dynamically
     let prompt = "";
    switch (tool) {
      case "Savage Reply":
        prompt = `Generate a ${tone} reply in ${language} for: "${message}"`;
        if (additionalInfo) prompt += ` Additional info: ${additionalInfo}`;
        break;

      case "Quick Answer AI":
        prompt = `Give a short, concise ${tone} answer in ${language} for: "${message}"`;
        if (additionalInfo) prompt += ` Context: ${additionalInfo}`;
        break;

      case "Summarizer AI":
        prompt = `Summarize the following text in ${tone} tone and ${language}: "${message}"`;
        if (additionalInfo) prompt += ` Include info: ${additionalInfo}`;
        break;

      case "Voice Script AI":
        prompt = `Generate a voice script in ${tone} tone and ${language} for: "${message}"`;
        if (additionalInfo) prompt += ` Additional context: ${additionalInfo}`;
        break;

      default:
        prompt = `${tool} task: "${message}"`;
        if (additionalInfo) prompt += ` Additional info: ${additionalInfo}`;
        break;
    }

    console.log("📝 Composed prompt:", prompt);

    // -------------------------
    // 5️⃣ Call GenAI model
    // -------------------------
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ type: "text", text: prompt }],
      });
      console.log("📤 Raw response from GenAI:", JSON.stringify(response, null, 2));
    } catch (genErr) {
      console.error("❌ Error while calling GenAI model:", genErr);
      return NextResponse.json(
        { error: "Error calling GenAI model", details: genErr.message || genErr },
        { status: 500 }
      );
    }

    // -------------------------
    // 6️⃣ Extract text safely
    // -------------------------
    let text = "No text returned";
    try {
      text =
        response?.candidates?.[0]?.content?.[0]?.text ||
        response?.text ||
        response?.output_text ||
        "No text returned";
    } catch (extractErr) {
      console.warn("⚠️ Failed to extract text from response:", extractErr);
      text = "Failed to extract text from GenAI response";
    }

    console.log("✅ Generated text:", text);
    return NextResponse.json({ result: text });
  } catch (err) {
    console.error("❌ Unexpected server error:", err);
    return NextResponse.json(
      { error: "Unexpected server error", details: err.message || err },
      { status: 500 }
    );
  }
}
