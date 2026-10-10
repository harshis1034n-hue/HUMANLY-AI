import React from 'react';
import { ArrowDown, ShieldCheck, Cpu, MessageSquareText } from 'lucide-react';

interface HeroProps {
  onStartWriting: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartWriting }) => {
  return (
    <section className="relative overflow-hidden py-8 sm:py-12 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200/70 text-indigo-700 mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          <span>Google Student Club Welcome Hackathon 2026</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none mb-4">
          Your Words, Refined.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700">
            Your Meaning, Preserved.
          </span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
          Transform robotic AI-generated text into natural communication without losing the facts that matter.
        </p>

        {/* Action Button & Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={onStartWriting}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Writing</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Deterministic Fact Guard</h4>
              <p className="text-[11px] text-slate-500">Every date, number, unit, and metric is verified before and after rewrite.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Robotic Pattern Diagnosis</h4>
              <p className="text-[11px] text-slate-500">Identifies overused cliches, monotonous starters, and artificial phrasing.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Context & Tone Nuance</h4>
              <p className="text-[11px] text-slate-500">Adapts across 6 communication channels and 3 human tone modes.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
