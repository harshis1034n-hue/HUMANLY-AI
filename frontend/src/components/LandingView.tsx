import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sliders,
  CheckCircle2,
  FileCheck2,
  Zap,
  MessageSquare,
  Users,
  FileText,
  HelpCircle,
  Copy,
  ChevronRight
} from 'lucide-react';

interface LandingViewProps {
  onStartHumanizing: () => void;
  onExploreFeatures: () => void;
  onOpenAbout: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartHumanizing,
  onExploreFeatures,
  onOpenAbout
}) => {
  return (
    <div className="space-y-24 py-6">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Glowing Background Ambient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-electric-cyan/15 rounded-full blur-[110px] pointer-events-none -z-10 animate-orb-float" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-electric-cyan/10 rounded-full blur-[90px] pointer-events-none -z-10 animate-orb-float-delayed" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Hackathon Pill */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full text-xs font-medium glass-card border-white/10 text-indigo-300 shadow-glow-indigo">
            <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
            <span className="text-slate-300 font-semibold">Google Student Club Welcome Hackathon 2026</span>
            <span className="text-slate-500">•</span>
            <span className="text-electric-cyan">Problem Statement 02</span>
          </div>

          {/* Glowing Abstract AI Orb Graphic */}
          <div className="relative w-28 h-28 mx-auto my-2 flex items-center justify-center">
            {/* Outer Glowing Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-electric-cyan opacity-40 blur-md animate-pulse-slow" />
            {/* Middle Rotating Ribbon Effect */}
            <div className="absolute inset-1 rounded-full border border-electric-cyan/40 border-dashed animate-spin" style={{ animationDuration: '24s' }} />
            {/* Core Orb */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-700 via-violet-600 to-electric-cyanDark p-0.5 shadow-glow-cyan flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-midnight-950/80 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-9 h-9 text-electric-cyan" />
              </div>
            </div>
          </div>

          {/* Main Hero Headings */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Your ideas deserve a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-electric-violet to-electric-cyan">
                human voice.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Transform robotic, repetitive AI-generated text into authentic, context-aware human communication.
              Refine tone and cadence while <span className="text-white font-medium">strictly preserving every fact, number, score, and date</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartHumanizing}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-600 shadow-glow-indigo hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-electric-cyan" />
              <span>Start Humanizing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white glass-card hover:border-white/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Features</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Fact Hallucination Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-electric-cyan" />
              <span>Powered by Google Gemini API</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-purple-400" />
              <span>Dual-Layer Deterministic Audit</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE BEFORE & AFTER PREVIEW ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-electric-cyan">Real Transformation</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Before and After Preview</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            See how stiff corporate jargon transforms into warm, constructive human prose while preserving scores and dates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before Card */}
          <div className="glass-card rounded-2xl p-6 border-rose-500/20 relative space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Robotic AI Input</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Stiff • Repetitive</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The candidate demonstrated good communication skills. The candidate also demonstrated good teamwork skills during the group exercise. The candidate demonstrated an ability to explain the solution. Overall assessment score: 78/100 recorded on 15 September 2026."
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Monotonous "The candidate demonstrated" repeated 3×
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Robotic cadence
              </span>
            </div>
          </div>

          {/* After Card */}
          <div className="glass-card rounded-2xl p-6 border-emerald-500/20 relative space-y-3 bg-midnight-900/60 shadow-glow-cyan">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Refined Human Communication</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300">Natural • Conversational</span>
            </div>
            <p className="text-xs text-slate-100 leading-relaxed font-normal">
              "The candidate communicated clearly and collaborated effectively during the group exercise, explaining their approach in an engaging, intuitive way. They achieved an overall score of <strong className="text-electric-cyan font-bold">78/100</strong> during their evaluation on <strong className="text-electric-cyan font-bold">15 September 2026</strong>."
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Score: 78/100 exactly preserved</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Date: 15 Sept 2026 locked</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4-STEP VISUAL WORKFLOW ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Process</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How Humanly AI Refines Your Text</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            A rigorous, multi-stage pipeline designed to eliminate robotic writing patterns without risking factual integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="glass-card rounded-2xl p-5 space-y-3 border-white/5 relative">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
              01
            </div>
            <h3 className="text-sm font-bold text-white">1. Analyze</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects robotic clichés, formulaic openings, repetitive syntax, and stiff corporate vocabulary in real-time.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-2xl p-5 space-y-3 border-white/5 relative">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 font-bold text-xs flex items-center justify-center border border-violet-500/30">
              02
            </div>
            <h3 className="text-sm font-bold text-white">2. Humanize</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini adapts the text to your chosen tone and audience with strict prompt guardrails against fabrication.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-2xl p-5 space-y-3 border-white/5 relative">
            <div className="w-8 h-8 rounded-xl bg-electric-cyan/20 text-electric-cyan font-bold text-xs flex items-center justify-center border border-electric-cyan/30">
              03
            </div>
            <h3 className="text-sm font-bold text-white">3. Verify</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dual-layer deterministic cross-checking locks all scores, metrics, dates, and named entities. Any shift is flagged.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-card rounded-2xl p-5 space-y-3 border-white/5 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
              04
            </div>
            <h3 className="text-sm font-bold text-white">4. Copy & Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect side-by-side diffs, copy instantly to clipboard, or download as a formatted TXT archive with verification notes.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CORE FEATURES MATRIX ================= */}
      <section id="features" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-electric-cyan">Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Built for High-Stakes Communication</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Engineered specifically for recruiting, candidate correspondence, interview evaluation, and executive reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Feature 1 */}
          <div className="glass-card rounded-2xl p-6 space-y-3 glass-card-interactive">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Contextual Rewriting</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Select tailored contexts including Recruiter Feedback, Candidate Email, Interview Question, Interview Summary, and Executive Reports. Each mode adapts greetings, transitions, and phrasing to real communication norms.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card rounded-2xl p-6 space-y-3 glass-card-interactive">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Fact & Entity Preservation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every date, number, score (e.g. 78/100), percentage, technical term, and named entity is audited before and after rewrite. Discrepancies are flagged for user review rather than assumed safe.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card rounded-2xl p-6 space-y-3 glass-card-interactive">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Tone & Strength Intelligence</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fine-tune the voice with Professional, Polished, and Conversational tones, paired with Light, Balanced, and Strong humanization levels to match the exact nuance of your recipient.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="glass-card rounded-2xl p-6 space-y-3 glass-card-interactive">
            <div className="w-10 h-10 rounded-xl bg-electric-cyan/20 text-electric-cyan flex items-center justify-center border border-electric-cyan/30">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Meaning Verification & Disclaimers</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Combines deterministic verification with semantic auditing. Transparently labels verified entities and flags potential changes without ever claiming infallible AI accuracy.
            </p>
          </div>
        </div>

        {/* Bottom Workspace CTA Banner */}
        <div className="mt-12 glass-panel rounded-2xl p-8 text-center space-y-4 border-indigo-500/30 shadow-glow-indigo">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Ready to give your writing a genuine human touch?
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Try our built-in recruiter feedback sample or paste your own AI text directly into the humanization workspace.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartHumanizing}
              className="px-7 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all inline-flex items-center space-x-2"
            >
              <span>Open Humanization Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
