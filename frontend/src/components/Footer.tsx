import React from 'react';
import { Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-midnight-950/80 backdrop-blur-md py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-white font-bold text-sm">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-electric-cyan flex items-center justify-center text-white shadow-glow-cyan p-0.5">
              <div className="w-full h-full rounded-[10px] bg-midnight-950 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-electric-cyan" />
              </div>
            </div>
            <div>
              <span className="font-extrabold tracking-wide">HUMANLY <span className="text-electric-cyan">AI</span></span>
              <span className="text-slate-400 font-normal text-xs block">
                The Human Communication Studio
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-400 text-xs glass-card px-3 py-1.5 rounded-full border-white/5">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Zero Data Selling • In-Memory Processing • Client Local Storage Only</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            Google Student Club Welcome Hackathon 2026 — Problem Statement 02: AI Humanization & Natural Language Refinement.
          </p>
          <p>
            "Less robotic. More human. Always true."
          </p>
        </div>
      </div>
    </footer>
  );
};
