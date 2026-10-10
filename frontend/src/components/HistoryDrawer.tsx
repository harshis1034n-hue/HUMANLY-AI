import React from 'react';
import {
  History,
  X,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelectSession: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSelectSession,
  onDeleteItem,
  onClearAll
}) => {
  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Sessions</h3>
              <p className="text-xs text-slate-500">Stored privately in your browser storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700">No session history yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Rewrites you generate will be saved here so you can revisit and compare previous drafts.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const isSuccess = item.verificationStatus === 'No obvious differences detected';
              const isWarning = item.verificationStatus === 'Potential differences found';

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all group"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                    <span className="flex items-center space-x-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(item.timestamp)}</span>
                    </span>

                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full font-medium text-[10px] border ${
                        isSuccess
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : isWarning
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {isSuccess ? (
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                      ) : (
                        <HelpCircle className="w-3 h-3 text-slate-500" />
                      )}
                      <span>{isSuccess ? 'Facts Intact' : isWarning ? 'Warning Flagged' : 'Rule Checked'}</span>
                    </span>
                  </div>

                  {/* Context and tone tag */}
                  <div className="flex items-center space-x-1.5 text-[11px] font-medium text-indigo-700 mb-2">
                    <span className="capitalize">{item.context.replace('_', ' ')}</span>
                    <span>•</span>
                    <span className="capitalize">{item.tone}</span>
                    <span>•</span>
                    <span>{item.originalWords} → {item.rewrittenWords} words</span>
                  </div>

                  {/* Snippet preview */}
                  <div className="text-xs text-slate-700 line-clamp-2 leading-relaxed bg-slate-50/70 p-2 rounded-lg border border-slate-100 mb-3">
                    {item.rewrittenText}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors text-xs flex items-center space-x-1"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>

                    <button
                      onClick={() => onSelectSession(item)}
                      className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                    >
                      <span>Reopen Draft</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              {items.length} saved session{items.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={onClearAll}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center space-x-1 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
