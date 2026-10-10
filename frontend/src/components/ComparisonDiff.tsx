import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  RefreshCw,
  Columns,
  AlignLeft,
  Sparkles,
  FileText,
  Share2
} from 'lucide-react';

interface ComparisonDiffProps {
  originalText: string;
  rewrittenText: string;
  originalWords: number;
  rewrittenWords: number;
  explanation?: string;
  onUseAsInput: (text: string) => void;
  onReset: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export const ComparisonDiff: React.FC<ComparisonDiffProps> = ({
  originalText,
  rewrittenText,
  originalWords,
  rewrittenWords,
  explanation,
  onUseAsInput,
  onReset,
  onRegenerate,
  isRegenerating
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'inline'>('split');

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(rewrittenText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = rewrittenText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownloadTxt = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const content = `=====================================================
HUMANLY AI — The Human Communication Studio
Google Student Club Welcome Hackathon 2026
Export Timestamp: ${new Date().toLocaleString()}
=====================================================

--- REFINED HUMAN COMMUNICATION ---
${rewrittenText}

--- EDITORIAL SUMMARY ---
${explanation || 'Refined natural human communication.'}

--- ORIGINAL INPUT TEXT ---
${originalText}

--- WORD METRICS ---
Original Words: ${originalWords}
Refined Words: ${rewrittenWords}
Delta: ${rewrittenWords - originalWords} (${originalWords > 0 ? Math.round(((rewrittenWords - originalWords) / originalWords) * 100) : 0}%)
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `humanly-ai-output-${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const wordDelta = rewrittenWords - originalWords;
  const wordDeltaPercent = originalWords > 0 ? Math.round((wordDelta / originalWords) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden border-white/10 space-y-0">
      {/* Action Bar */}
      <div className="px-5 py-3.5 bg-midnight-900/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-electric-cyan" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Humanized Output & Comparison
          </span>

          {/* Word delta badge */}
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 font-mono">
            {originalWords} → {rewrittenWords} words ({wordDelta > 0 ? `+${wordDelta}` : wordDelta}, {wordDeltaPercent > 0 ? `+${wordDeltaPercent}%` : `${wordDeltaPercent}%`})
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <div className="inline-flex rounded-xl glass-panel p-0.5 border-white/10">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'split' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Side-by-side view"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('inline')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'inline' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Stacked view"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Explanation note */}
      {explanation && (
        <div className="px-5 py-2.5 bg-indigo-950/20 border-b border-indigo-500/15 text-xs text-indigo-200 flex items-center space-x-2">
          <span className="font-semibold text-electric-cyan">Editorial Polish:</span>
          <span>{explanation}</span>
        </div>
      )}

      {/* Comparison Body */}
      <div className="p-5">
        {viewMode === 'split' ? (
          /* Side-by-Side (Desktop) / Stacked (Mobile) */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Original Box */}
            <div className="rounded-xl p-4 bg-midnight-950/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Original Source Text
                </span>
                <span className="text-[10px] font-mono text-slate-500">{originalWords} words</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {originalText}
              </p>
            </div>

            {/* Rewritten Box */}
            <div className="rounded-xl p-4 bg-indigo-950/25 border border-indigo-500/20 space-y-2 shadow-glow-cyan">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-electric-cyan flex items-center space-x-1.5">
                  <Sparkles className="w-3 h-3 text-electric-cyan" />
                  <span>Humanized Communication</span>
                </span>
                <span className="text-[10px] font-mono text-electric-cyan">{rewrittenWords} words</span>
              </div>
              <p className="text-sm text-white leading-relaxed font-normal whitespace-pre-wrap">
                {rewrittenText}
              </p>
            </div>
          </div>
        ) : (
          /* Inline Stacked View */
          <div className="space-y-4">
            <div className="rounded-xl p-4 bg-indigo-950/30 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
                <span className="text-xs font-bold text-electric-cyan uppercase tracking-wider">
                  Refined Human Text
                </span>
                <span className="text-xs font-mono text-electric-cyan">{rewrittenWords} words</span>
              </div>
              <p className="text-sm text-white leading-relaxed font-normal whitespace-pre-wrap">
                {rewrittenText}
              </p>
            </div>

            <details className="rounded-xl p-3 bg-midnight-950/50 border border-white/5 text-xs">
              <summary className="cursor-pointer font-semibold text-slate-400 hover:text-white">
                View Original Text ({originalWords} words)
              </summary>
              <p className="mt-2 text-slate-300 font-mono whitespace-pre-wrap pl-2 border-l border-white/10">
                {originalText}
              </p>
            </details>
          </div>
        )}

        {/* Buttons Suite: Copy Output, Download TXT, Try Again, Reset */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Copy Button */}
            <button
              onClick={handleCopy}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white shadow-glow-cyan'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-indigo'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Output'}</span>
            </button>

            {/* Download TXT Button */}
            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white glass-card hover:border-white/20 transition-colors"
              title="Download humanized text as .txt file"
            >
              <Download className="w-3.5 h-3.5 text-electric-cyan" />
              <span>Download TXT</span>
            </button>

            {/* Try Again / Regenerate Button */}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white glass-card hover:border-white/20 transition-colors disabled:opacity-50"
                title="Regenerate with current settings"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-violet-400 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>Try Again</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Replace Input */}
            <button
              onClick={() => onUseAsInput(rewrittenText)}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white glass-card hover:border-white/20 transition-colors"
              title="Copy output back into editor for iterative editing"
            >
              <span>Use as Input</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 glass-card hover:border-rose-500/20 transition-colors"
              title="Reset results view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
