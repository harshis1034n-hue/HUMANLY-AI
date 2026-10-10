import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Hash,
  Terminal,
  RotateCcw,
  Check,
  Info
} from 'lucide-react';
import { VerificationReport } from '../types';

interface VerificationReportCardProps {
  report: VerificationReport | null;
  onRetry?: () => void;
  onKeepOriginal?: () => void;
  onAcceptAnyway?: () => void;
}

export const VerificationReportCard: React.FC<VerificationReportCardProps> = ({
  report,
  onRetry,
  onKeepOriginal,
  onAcceptAnyway
}) => {
  if (!report) return null;

  const {
    status,
    preservedItems,
    preservedEntities,
    preservedNumbersDates,
    needsReviewItems,
    potentiallyChangedFacts,
    meaningCertaintyNotes,
    summary,
    disclaimer
  } = report;

  const isSuccess = status === 'No obvious differences detected' && potentiallyChangedFacts.length === 0;
  const isWarning = potentiallyChangedFacts.length > 0 || status === 'Potential differences found';

  return (
    <div className="glass-card rounded-2xl overflow-hidden border-white/10 space-y-0">
      {/* Header Banner */}
      <div
        className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-2 ${
          isSuccess
            ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-200'
            : isWarning
            ? 'bg-amber-950/30 border-amber-500/25 text-amber-200'
            : 'bg-midnight-900/80 border-white/10 text-slate-200'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          {isSuccess ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : isWarning ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" />
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
              Meaning & Fact Preservation Audit
            </span>
            <span className="text-sm font-bold text-white">{status}</span>
          </div>
        </div>

        {/* Status Pill */}
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
            isSuccess
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : isWarning
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-slate-800 border-white/10 text-slate-300'
          }`}
        >
          {isSuccess ? 'Verified Safe' : 'Review Flagged Discrepancies'}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Summary Narrative */}
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {summary}
        </p>

        {/* 1. Potentially Changed Claims (Rose alert) */}
        {potentiallyChangedFacts.length > 0 && (
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Potentially Changed or Missing Items ({potentiallyChangedFacts.length}):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-rose-200 pl-1">
              {potentiallyChangedFacts.map((fact, idx) => (
                <li key={idx} className="leading-relaxed">{fact}</li>
              ))}
            </ul>
            <p className="text-[11px] text-rose-300/80 pt-1">
              Notice: The system flags these items for your editorial judgment rather than assuming accuracy.
            </p>
          </div>
        )}

        {/* 2. Needs Review Items (Amber alert) */}
        {needsReviewItems && needsReviewItems.length > 0 && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Items Rephrased or Modulated ({needsReviewItems.length}):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-amber-200 pl-1">
              {needsReviewItems.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Preserved Items Grid (Emerald badges) */}
        {preservedItems.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preserved Facts, Scores & Entities ({preservedItems.length})</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {preservedItems.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-200"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 4. Semantic / Meaning Certainty Notes */}
        {meaningCertaintyNotes && meaningCertaintyNotes.length > 0 && (
          <div className="p-3 rounded-xl bg-midnight-950/40 border border-white/5 space-y-1 text-xs text-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Semantic Nuance Review</span>
            {meaningCertaintyNotes.map((note, idx) => (
              <p key={idx} className="text-slate-400 leading-relaxed">• {note}</p>
            ))}
          </div>
        )}

        {/* Warning Decision Buttons */}
        {isWarning && (
          <div className="pt-2 flex flex-wrap gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Humanization</span>
              </button>
            )}
            {onKeepOriginal && (
              <button
                onClick={onKeepOriginal}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white glass-card hover:border-white/20 transition-colors"
              >
                <span>Keep Original Text</span>
              </button>
            )}
            {onAcceptAnyway && (
              <button
                onClick={onAcceptAnyway}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 hover:text-white bg-amber-500/10 border border-amber-500/20 transition-colors"
              >
                <span>Accept with Discrepancies</span>
              </button>
            )}
          </div>
        )}

        {/* Prominent Automated Verification Disclaimer */}
        <div className="pt-3 border-t border-white/5 flex items-start space-x-2 text-[11px] text-slate-500 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            {disclaimer || 'Automated checks cannot guarantee factual correctness. We verify numbers and exact dates, but human review is recommended for high-stakes correspondence.'}
          </span>
        </div>
      </div>
    </div>
  );
};
