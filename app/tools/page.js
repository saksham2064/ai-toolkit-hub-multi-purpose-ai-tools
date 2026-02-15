"use client";
import React from "react";
import {
  Flame,
  AlertTriangle,
  Sparkles,
  Camera,
  TrendingUp,
  Shield,
  MessageSquare,
  Brain,
  Code,
  PenTool,
  Image,
  Mic,
  FileText,
  Zap,
  Search,
} from "lucide-react";

import { FeatureCard } from "../../components/FeatureCard";
import { Header } from "../../components/Header";

export default function ToolsPage() {
  const features = [
    { icon: Flame, title: "Savage Reply", description: "Generate witty comebacks that hit different", accentColor: "purple" },
    { icon: AlertTriangle, title: "Red Flag Analyzer", description: "Scan texts for warning signs instantly", accentColor: "blue" },
    { icon: Sparkles, title: "Vibe Check", description: "Rate the energy of any situation", accentColor: "purple" },
    { icon: Camera, title: "Receipts Generator", description: "Create screenshots for the proof you need", accentColor: "blue" },
    // { icon: TrendingUp, title: "Drama Scale", description: "Measure exactly how petty something is", accentColor: "purple" },
    // { icon: Shield, title: "Toxic Detector", description: "Identify problematic behavior in real-time", accentColor: "blue" },

    // Extra AI Tools
    { icon: MessageSquare, title: "Caption Generator", description: "Create viral captions for any post", accentColor: "purple" },
    { icon: Brain, title: "AI Brainstormer", description: "Generate creative ideas instantly", accentColor: "blue" },
    // { icon: Code, title: "Code Helper", description: "Fix, generate, or optimize your code", accentColor: "purple" },
    { icon: PenTool, title: "Story Writer", description: "Write stories, scripts & creative content", accentColor: "blue" },
    { icon: Image, title: "Prompt Enhancer", description: "Improve prompts for better AI results", accentColor: "purple" },
    { icon: Mic, title: "Voice Script AI", description: "Generate scripts for reels & YouTube", accentColor: "blue" },
    { icon: FileText, title: "Summarizer", description: "Turn long text into quick summaries", accentColor: "purple" },
    { icon: Zap, title: "Quick Answer AI", description: "Instant answers to daily questions", accentColor: "blue" },
    { icon: Search, title: "Research Assistant", description: "Organize research in seconds", accentColor: "purple" },
  ];

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header />

      {/* Page Hero */}
      <header className="px-4 py-20 text-center md:px-12">
        <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-display text-neonpurple drop-shadow-neon">
          Explore All AI Tools
        </h1>

        <p className="max-w-2xl mx-auto text-base text-graytext sm:text-lg md:text-xl">
          Discover powerful, fun, and savage AI tools built to make your life easier.
        </p>
      </header>

      {/* Tools Grid */}
      <main className="flex-1 w-full px-6 mb-16 md:px-12">
        <div className="mx-auto max-w-7xl">
          <h3 className="mb-8 text-xl font-bold text-gray-100 sm:text-2xl md:text-3xl">
            All Available Tools
          </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {features.map((feature, index) => (
                        <FeatureCard
                          key={index}
                          icon={feature.icon}
                          title={feature.title}
                          description={feature.description}
                          accentColor={feature.accentColor}
                        />
                      ))}
                    </div>
        </div>
      </main>
    </div>
  );
}
