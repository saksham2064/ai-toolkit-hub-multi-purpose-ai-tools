import React from 'react';
import { LucideIcon } from 'lucide-react'; // optional: can be used for prop typing in TS, not needed in JS
import { useRouter } from "next/navigation";
import Link from "next/link";



export function FeatureCard({ icon: Icon, title, description, accentColor }) {
  const borderColor = accentColor === 'purple' ? 'var(--neon-purple)' : 'var(--neon-blue)';

  return (
    <div
      className="relative p-6 overflow-hidden transition-all duration-300 bg-black cursor-pointer group rounded-2xl hover:scale-105"
      style={{
        backgroundColor: 'var(--dark-card)',
        border: '2px solid transparent',
      }}
     
    >
      {/* Shine effect on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, transparent 0%, ${borderColor}10 50%, transparent 100%)`,
          animation: 'shine 1.5s ease-in-out infinite',
        }}
      ></div>

      {/* Glow effect */}
      <div
        className="absolute transition-opacity duration-300 opacity-0 -inset-1 group-hover:opacity-20 blur-xl rounded-2xl"
        style={{ backgroundColor: borderColor }}
      ></div>

      {/* Content */}
      <div className="relative z-10 p-6 border-2 min-h-[240px] border-gray-700 rounded-2xl ">
        <div
          className="flex items-center justify-center mb-4 w-14 h-14 rounded-xl "
          style={{
            backgroundColor: `${borderColor}20`,
            color: borderColor,
          }}
        >
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
<Link
  href={`/tools/${title.toLowerCase().replace(/\s+/g, "-")}`}
  className="absolute px-3 py-1 font-bold transition-all duration-300 rounded-md bottom-3 bg-slate-800 hover:bg-slate-700"
>
  Try now
</Link>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(30deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(30deg); }
        }
      `}</style>
    </div>
  );
}
