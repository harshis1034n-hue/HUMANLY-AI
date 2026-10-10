import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { RoboticAnalysisResult } from '../types';

interface RoboticAnalysisCardProps {
  analysis: RoboticAnalysisResult | null;
  isLoading?: boolean;
}

export const RoboticAnalysisCard: React.FC<RoboticAnalysisCardProps> = ({
  analysis,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-5 border-white/5 space-y-3 animate-pulse">
        <div className="h-4 w-48 bg-white/10 rounded" />
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-3/4 bg-white/5 rounded" />
      </div>
    );
  }

  if (!analysis) return null;

  const issues = analysis.issues || [];
  const metrics = analysis.readabilityMetrics || (analysis as any).readability_metrics || {
    wordCount: 0,
    sentenceCount: 0,
    averageSentenceLength: 0,
    repetitionCount: 0
  };
  const summary = analysis.summary || '';

  return (
    <div className="glass-card rounded-2xl overflow-hidden border-white/10 space-y-0">
      {/* Header */}
      <div className="px-5 py-3.5 bg-midnight-900/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Robotic-Language Diagnostic
          </h3>
        </div>
        <div className="flex items-center space-x-2.5 text-[11px] text-slate-400 font-mono">
          <span>{metrics.wordCount} words</span>
          <span>•</span>
          <span>{metrics.sentenceCount} sentence{metrics.sentenceCount !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{metrics.averageSentenceLength} w/sent</span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {/* Notice that these are editorial observations, not AI detector scores */}
        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-medium">
          <Info className="w-3 h-3 text-slate-500" />
          <span>Editorial observations on rhythm and phrasing — not unvalidated AI detection scores.</span>
        </div>

        {issues.length === 0 ? (
          <div className="flex items-start space-x-3 text-xs text-emerald-300 bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Natural, Fluent Cadence</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {summary || 'No glaring formulaic clichés, stiff bureaucratic openings, or monotonous syntax detected.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {issues.map((issue, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-white/5 bg-midnight-950/40 hover:bg-midnight-950/70 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2">
                    <AlertCircle
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        issue.severity === 'high'
                          ? 'text-rose-400'
                          : issue.severity === 'medium'
                          ? 'text-amber-400'
                          : 'text-indigo-400'
                      }`}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{issue.title}</h4>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{issue.description}</p>
                    </div>
                  </div>

                  {issue.snippet && (
                    <span
                      title={issue.snippet}
                      className="text-[10px] font-mono bg-white/5 text-slate-300 px-2 py-0.5 rounded-lg border border-white/5 shrink-0 max-w-[150px] truncate"
                    >
                      {issue.snippet}
                    </span>
                  )}
                </div>

                <div className="pl-6 flex items-start space-x-1.5 text-xs text-indigo-300 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-500/15">
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-electric-cyan" />
                  <span>
                    <strong className="font-semibold text-white">Suggested Revision:</strong>{' '}
                    {issue.suggestion}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
