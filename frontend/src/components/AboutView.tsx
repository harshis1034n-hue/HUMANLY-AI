import React from 'react';
import {
  Sparkles,
  Shield,
  Cpu,
  Lock,
  Layers,
  Code2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold glass-card text-indigo-300 border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-electric-cyan" />
          <span>Google Student Club Welcome Hackathon 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About HUMANLY AI
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          The Human Communication Studio engineered to bridge the gap between AI generation and natural human dialogue.
        </p>
      </div>

      {/* 1. Problem Statement */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border-white/10">
        <div className="flex items-center space-x-3 text-indigo-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider text-xs">
            Problem Statement 02: AI Humanization & Natural Language Refinement
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Modern Large Language Models produce text that is grammatically correct but frequently suffers from recognizable artificial artifacts: formulaic greetings (<em>"I hope this email finds you well"</em>), repetitive sentence openings (<em>"The candidate demonstrated..."</em>), and rigid corporate boilerplate.
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          Crucially, conventional rewriting tools often hallucinate or distort essential facts—altering evaluation scores, dropping completion dates, or mutating technical terms. HUMANLY AI solves this by coupling natural stylistic re-articulation with a dual-layer fact preservation invariant.
        </p>
      </div>

      {/* 2. 3-Stage Pipeline */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-electric-cyan" />
          <span>The Humanly AI Pipeline Architecture</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 space-y-3 border-white/5">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-300 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Stage 1: Robotic Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time heuristic evaluation identifies generic salutations, repetitive sentence structures, and bureaucratic substitutions before sending text to the AI model.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3 border-white/5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Stage 2: Context Humanization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini refines expression, cadence, and tone (Professional, Polished, Conversational) with strict system instructions prohibiting fabrication or claim modification.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3 border-white/5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Stage 3: Fact Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deterministic regex and token parsers verify that every score, date, number, unit, and entity from the original appears unaltered in the refined rewrite.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Technology Stack */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border-white/10">
        <div className="flex items-center space-x-3 text-electric-cyan">
          <Code2 className="w-5 h-5" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Production Technology Stack
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-midnight-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Frontend Core</span>
            <p className="text-xs font-semibold text-white">React 18 + TypeScript</p>
          </div>
          <div className="p-3 rounded-xl bg-midnight-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Build & Tooling</span>
            <p className="text-xs font-semibold text-white">Vite + Vitest</p>
          </div>
          <div className="p-3 rounded-xl bg-midnight-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Styling & Design</span>
            <p className="text-xs font-semibold text-white">Tailwind CSS (Midnight)</p>
          </div>
          <div className="p-3 rounded-xl bg-midnight-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Backend Server</span>
            <p className="text-xs font-semibold text-white">Python 3.12 + FastAPI</p>
          </div>
          <div className="p-3 rounded-xl bg-midnight-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">AI Intelligence</span>
            <p className="text-xs font-semibold text-white">Google Gemini API</p>
          </div>
          <div className="p-3 rounded-xl bg-midnight-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Testing Suite</span>
            <p className="text-xs font-semibold text-white">Pytest + Vitest</p>
          </div>
        </div>
      </div>

      {/* 4. Privacy & Ethical Disclaimers */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border-white/10">
        <div className="flex items-center space-x-3 text-purple-400">
          <Lock className="w-5 h-5" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Privacy Invariants & Limitations
          </h2>
        </div>
        <ul className="space-y-2 text-xs text-slate-300 leading-relaxed pl-1">
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Client Storage Isolation:</strong> History and client API keys are persisted strictly in your browser's local storage. They are never sent to external telemetry or third-party databases.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Server Credentials Security:</strong> Backend API keys remain safely in the server environment without leaking to the browser client.</span>
          </li>
          <li className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Verification Disclaimer:</strong> Automated rule-based checks verify exact numbers, scores, and dates, but cannot guarantee 100% philosophical factual correctness. Always review critical recruiter evaluations or candidate offers before sending.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
