import React, { useState } from 'react';
import {
  History,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { HistoryItem, TextType } from '../types';

interface HistoryViewProps {
  items: HistoryItem[];
  onSelectSession: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

const TEXT_TYPE_LABELS: Record<string, string> = {
  recruiter_feedback: 'Recruiter Feedback',
  candidate_email: 'Candidate Email',
  interview_question: 'Interview Question',
  interview_summary: 'Interview Summary',
  report: 'Report',
  general_text: 'General Text',
  professional_email: 'Candidate Email',
  candidate_communication: 'Candidate Email',
  interview_questions: 'Interview Question',
  academic_general: 'Report'
};

export const HistoryView: React.FC<HistoryViewProps> = ({
  items,
  onSelectSession,
  onDeleteItem,
  onClearAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rewrittenText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedTypeFilter === 'all' || item.textType === selectedTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400">
            <History className="w-5 h-5 text-electric-cyan" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Transformation History</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persisted in your local browser storage ({items.length} sessions recorded)
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearAll}
            className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history by content..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs glass-input placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl glass-input bg-midnight-900 text-slate-200"
            >
              <option value="all">All Text Types</option>
              <option value="recruiter_feedback">Recruiter Feedback</option>
              <option value="candidate_email">Candidate Email</option>
              <option value="interview_question">Interview Question</option>
              <option value="interview_summary">Interview Summary</option>
              <option value="report">Report</option>
              <option value="general_text">General Text</option>
            </select>
          </div>
        </div>
      )}

      {/* Content List */}
      {filteredItems.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-4 border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No history records found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {items.length === 0
                ? 'Your humanized transformations will appear here as you run them in the workspace.'
                : 'No sessions match your search criteria.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const dateStr = new Date(item.timestamp).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short'
            });
            const typeLabel = TEXT_TYPE_LABELS[item.textType] || item.textType;
            const isVerifiedSafe = item.verificationStatus === 'No obvious differences detected';

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-5 space-y-4 glass-card-interactive border-white/5"
              >
                {/* Meta bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      {typeLabel}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 capitalize">
                      {item.tone}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">
                      {item.level}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium border flex items-center space-x-1 ${
                        isVerifiedSafe
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {isVerifiedSafe ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                      )}
                      <span>{isVerifiedSafe ? 'Verified Safe' : 'Needs Review'}</span>
                    </span>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Excerpt comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Original Text</span>
                    <p className="text-slate-400 line-clamp-3 leading-relaxed bg-midnight-950/40 p-3 rounded-xl border border-white/5 font-mono text-[11px]">
                      {item.originalText}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-electric-cyan block">Humanized Text</span>
                    <p className="text-slate-200 line-clamp-3 leading-relaxed bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/10">
                      {item.rewrittenText}
                    </p>
                  </div>
                </div>

                {/* Action footer */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {item.originalWords} words → {item.rewrittenWords} words
                  </span>
                  <button
                    onClick={() => onSelectSession(item)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all"
                  >
                    <span>Load into Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Storage Limitation Notice */}
      <div className="p-4 rounded-xl glass-card border-white/5 text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">Browser Local Storage Notice:</p>
        <p>
          History is saved locally in your browser session for privacy. It does not synchronize across separate devices and will be cleared if your browser cache is reset.
        </p>
      </div>
    </div>
  );
};
