"use client";
import React from "react";
import { Flame, AlertTriangle, Sparkles, Camera, TrendingUp, Shield } from "lucide-react";
import { FeatureCard } from "../components/FeatureCard";
import "./globals.css";
import { Header } from '../components/Header'
import Link from "next/link";


export default function Home() {
  const features = [
    { icon: Flame, title: "Savage Reply", description: "Generate witty comebacks that hit different", accentColor: "purple" },
    { icon: AlertTriangle, title: "Red Flag Analyzer", description: "Scan texts for warning signs instantly", accentColor: "blue" },
    { icon: Sparkles, title: "Vibe Check", description: "Rate the energy of any situation", accentColor: "purple" },
    { icon: Camera, title: "Receipts Generator", description: "Create screenshots for the proof you need", accentColor: "blue" },
    // { icon: TrendingUp, title: "Drama Scale", description: "Measure exactly how petty something is", accentColor: "purple" },
    // { icon: Shield, title: "Toxic Detector", description: "Identify problematic behavior in real-time", accentColor: "blue" },
  ];

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-darkbg">
      <Header/>
      {/* Hero Section */}
      <header className="px-4 py-16 text-center md:px-12">
        <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-neonpurple drop-shadow-neon">
          STOP THINKING
        </h1>
        <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl text-neonblue drop-shadow-neon">
          Let AI Think For You
        </h2>
        <p className="max-w-2xl mx-auto text-base text-graytext sm:text-lg md:text-xl">
          Your ultimate Gen Z AI toolkit — fun, savage, and ready for your daily life.
        </p>
      </header>

      {/* Features Grid */}
      <main className="flex-1 w-full px-6 mb-16 md:px-12">
        <div className="mx-auto max-w-7xl">
          <h3 className="mb-6 text-xl font-bold text-gray-100 sm:text-2xl md:text-3xl">
            Tools Currently Available
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
{/* Explore More Section */}
<div className="flex justify-center mt-12">
<Link
  href="/tools"
  className="inline-block px-8 py-3 text-lg font-semibold transition-all duration-300 sm:text-xl rounded-xl bg-neonpurple text-darkbg hover:bg-neonpink hover:scale-105 hover:shadow-neon active:scale-95"
>
  Explore More →
</Link>

</div>

        
      </main>
    </div>
  );
}
