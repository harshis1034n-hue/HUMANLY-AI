import React from 'react';
import { X, Sparkles, ShieldCheck, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">How Humanly AI Works</h3>
              <p className="text-xs text-slate-500">The 3-stage natural refinement & fact preservation pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Stage 1 */}
          <div className="flex items-start space-x-4">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>Stage 1: Robotic Pattern Diagnosis</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  Instant
                </span>
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Before sending anything to the AI, Humanly AI scans your text for common synthetic writing artifacts:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 pl-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span>Stiff boilerplate openings (e.g. <em>"Dear Sir/Madam, I am writing to inform you..."</em>)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span>Monotonous sentence starters (e.g. <em>"The candidate demonstrated... The candidate also..."</em>)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span>Overly formal or bureaucratic jargon (<em>utilize, aforementioned, commence</em>)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Stage 2 */}
          <div className="flex items-start space-x-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>Stage 2: Context-Aware Refinement</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Gemini API
                </span>
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                The text is sent through our secure backend to Google Gemini with strict prompt guards:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 pl-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Adapts to your chosen communication channel (e.g., recruiter feedback, email, summary).</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Applies your preferred tone (Professional, Natural, or Polished).</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Strict invariant: Changes expression and cadence rather than substance or claims.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Stage 3 */}
          <div className="flex items-start space-x-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>Stage 3: Dual-Layer Meaning & Fact Verification</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Differentiating Feature
                </span>
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Rather than trusting the model's claim that it kept all facts intact, an independent verification pipeline inspects the output:
              </p>
              <div className="mt-2 space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <strong className="text-slate-800">Layer 1: Deterministic Cross-Check</strong>
                  <p className="text-slate-500 mt-0.5">
                    Extracts and checks exact numbers (e.g. 12 modules, 92%), dates (15 September 2026), percentages, units, and proper nouns.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <strong className="text-slate-800">Layer 2: AI Semantic Intent Audit</strong>
                  <p className="text-slate-500 mt-0.5">
                    A separate semantic inspection verifies that conditions, negations, and confidence levels remain consistent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
