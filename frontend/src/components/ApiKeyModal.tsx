import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  ExternalLink,
  Check,
  AlertCircle,
  HelpCircle,
  Lock,
  Sparkles
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverAiConfigured: boolean;
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  serverAiConfigured,
  onSaveKey,
  currentKey
}) => {
  const [keyValue, setKeyValue] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setKeyValue(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(keyValue.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setKeyValue('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-card rounded-2xl border-white/10 shadow-glass overflow-hidden space-y-0">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-midnight-900/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-electric-cyan flex items-center justify-center border border-indigo-500/30">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Google Gemini API Configuration</h3>
              <p className="text-[11px] text-slate-400">Configure credentials for live AI text humanization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Server status indicator */}
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
              serverAiConfigured
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
            }`}
          >
            {serverAiConfigured ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">
                {serverAiConfigured
                  ? 'Server-Level Gemini API Key Active'
                  : 'No Server-Level API Key Detected'}
              </p>
              <p className="text-[11px] mt-0.5 text-slate-300">
                {serverAiConfigured
                  ? 'The backend server has GEMINI_API_KEY configured in .env. You can still supply your personal key below to override it.'
                  : 'Enter your personal Google Gemini API key below to enable humanization features.'}
              </p>
            </div>
          </div>

          {/* Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                Gemini API Key
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] text-electric-cyan hover:underline"
              >
                {showKey ? 'Hide key' : 'Show key'}
              </button>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono glass-input placeholder:text-slate-600 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Keys typically start with <code className="text-slate-400 font-mono">AIza...</code>
            </p>
          </div>

          {/* How to get a free key */}
          <div className="p-3.5 rounded-xl bg-midnight-950/40 border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-electric-cyan" />
                <span>Need a Google Gemini API Key?</span>
              </span>
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-electric-cyan hover:underline inline-flex items-center space-x-1"
              >
                <span>Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Visit <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline">aistudio.google.com</a> and sign in with your Google account.</li>
              <li>Click <strong>Get API Key</strong> and create a key in your project.</li>
              <li>Paste it here or save as <code className="text-slate-300 font-mono">GEMINI_API_KEY</code> in your backend <code className="text-slate-300 font-mono">.env</code>.</li>
            </ol>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Saved securely in your browser's local storage and sent only via encrypted HTTPS headers.</span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            {keyValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Clear Key
              </button>
            )}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white glass-card"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow-indigo transition-all flex items-center space-x-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-electric-cyan" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save API Key</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
