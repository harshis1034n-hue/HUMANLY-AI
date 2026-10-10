import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Key,
  ArrowRight,
  Loader2,
  FileText,
  Sliders,
  Layers,
  MessageSquare,
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';

import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { AboutView } from './components/AboutView';
import { HistoryView } from './components/HistoryView';
import { SampleSelector, BUILT_IN_SAMPLES } from './components/SampleSelector';
import { RoboticAnalysisCard } from './components/RoboticAnalysisCard';
import { VerificationReportCard } from './components/VerificationReportCard';
import { ComparisonDiff } from './components/ComparisonDiff';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Footer } from './components/Footer';

import {
  TextType,
  ToneMode,
  HumanizationLevel,
  HumanizeResponse,
  RoboticAnalysisResult,
  HistoryItem,
  SampleItem
} from './types';
import { api, ApiError } from './services/api';

const MAX_CHARACTERS = 25000;
const MAX_WORDS = 5000;
const STORAGE_KEY_HISTORY = 'humanly_history_v2';
const STORAGE_KEY_API_KEY = 'humanly_gemini_api_key';

export const App: React.FC = () => {
  // Navigation: 'home' | 'workspace' | 'history' | 'about'
  const [activeTab, setActiveTab] = useState<'home' | 'workspace' | 'history' | 'about'>('home');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // API Key & Backend Health
  const [serverAiConfigured, setServerAiConfigured] = useState(false);
  const [clientApiKey, setClientApiKey] = useState('');

  // Editing State
  const [inputText, setInputText] = useState('');
  const [textType, setTextType] = useState<TextType>('recruiter_feedback');
  const [tone, setTone] = useState<ToneMode>('conversational');
  const [level, setLevel] = useState<HumanizationLevel>('balanced');
  const [optionalContext, setOptionalContext] = useState('');

  // Execution & Diagnostics
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [currentResponse, setCurrentResponse] = useState<HumanizeResponse | null>(null);
  const [liveAnalysis, setLiveAnalysis] = useState<RoboticAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; code?: string } | null>(null);

  // History State
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const analyzeTimeoutRef = useRef<any>(null);

  // 1. Initial Load: Check backend health and load localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY_API_KEY) || '';
    setClientApiKey(savedKey);

    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setHistoryItems(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
    }

    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const health = await api.getHealth();
      setServerAiConfigured(health.aiConfigured);
    } catch {
      setServerAiConfigured(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 2. Debounced live robotic analysis as user types
  useEffect(() => {
    if (analyzeTimeoutRef.current) {
      clearTimeout(analyzeTimeoutRef.current);
    }

    if (!inputText.trim()) {
      setLiveAnalysis(null);
      return;
    }

    analyzeTimeoutRef.current = setTimeout(async () => {
      try {
        setIsAnalyzing(true);
        const analysis = await api.analyzeText(inputText);
        setLiveAnalysis(analysis);
      } catch {
        // Silent catch for rapid typing
      } finally {
        setIsAnalyzing(false);
      }
    }, 550);

    return () => {
      if (analyzeTimeoutRef.current) clearTimeout(analyzeTimeoutRef.current);
    };
  }, [inputText]);

  // Save history to localStorage
  const saveHistoryItem = (response: HumanizeResponse) => {
    const newItem: HistoryItem = {
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      originalText: response.originalText,
      rewrittenText: response.rewrittenText,
      textType: response.meta.textType || textType,
      tone: response.meta.tone || tone,
      level: response.meta.level || level,
      optionalContext: response.meta.optionalContext || optionalContext,
      verificationStatus: response.verification.status,
      originalWords: response.meta.originalWords,
      rewrittenWords: response.meta.rewrittenWords,
      explanation: response.explanation
    };

    setHistoryItems((prev) => {
      const updated = [newItem, ...prev.filter((i) => i.originalText !== newItem.originalText)].slice(0, 40);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      return updated;
    });
  };

  // Delete history item
  const handleDeleteHistoryItem = (id: string) => {
    setHistoryItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      return updated;
    });
    showToast('Record deleted from history.');
  };

  // Clear all history
  const handleClearAllHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    showToast('All history records cleared.');
  };

  // Save Client API Key
  const handleSaveApiKey = (key: string) => {
    setClientApiKey(key);
    if (key) {
      localStorage.setItem(STORAGE_KEY_API_KEY, key);
      showToast('API key saved for this browser.');
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
      showToast('API key cleared.');
    }
    checkBackendHealth();
  };

  // Input Metrics
  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const isInputTooLong = charCount > MAX_CHARACTERS || wordCount > MAX_WORDS;

  // Handle Sample Selection
  const handleSelectSample = (sample: SampleItem) => {
    setInputText(sample.text);
    setTextType(sample.textType);
    setTone(sample.tone);
    setLevel(sample.level);
    setOptionalContext(sample.optionalContext || '');
    setApiError(null);
    setCurrentResponse(null);
    setActiveTab('workspace');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    showToast(`Loaded "${sample.title}" sample.`);
  };

  // Handle Clear
  const handleClearText = () => {
    setInputText('');
    setCurrentResponse(null);
    setLiveAnalysis(null);
    setApiError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle Humanize Submission
  const handleHumanize = async () => {
    if (isLoading) return;
    const trimmed = inputText.trim();
    if (!trimmed) {
      setApiError({
        message: 'Please paste or enter some text before clicking Humanize Text.',
        code: 'EMPTY_INPUT'
      });
      return;
    }

    if (isInputTooLong) {
      setApiError({
        message: `Input exceeds maximum limit of ${MAX_CHARACTERS} characters or ${MAX_WORDS} words.`,
        code: 'TEXT_TOO_LONG'
      });
      return;
    }

    setApiError(null);
    setIsLoading(true);

    try {
      setLoadingStep('1/3 Analyzing stylistic & robotic patterns...');
      await new Promise((r) => setTimeout(r, 250));

      setLoadingStep('2/3 Refining natural human communication via Gemini...');
      const response = await api.humanizeText(
        trimmed,
        textType,
        tone,
        level,
        optionalContext,
        clientApiKey || undefined
      );

      setLoadingStep('3/3 Running dual-layer fact & meaning verification...');
      await new Promise((r) => setTimeout(r, 200));

      setCurrentResponse(response);
      setLiveAnalysis(response.analysis);
      saveHistoryItem(response);
      showToast('Refinement complete with fact verification audit.');
    } catch (err: any) {
      console.error('Humanize error:', err);
      if (err instanceof ApiError) {
        setApiError({
          message: err.message,
          code: err.code
        });
      } else {
        setApiError({
          message: err.message || 'An unexpected error occurred while communicating with the AI service.',
          code: 'GENERIC_ERROR'
        });
      }
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Reopen session from History
  const handleReopenSession = (item: HistoryItem) => {
    setInputText(item.originalText);
    setTextType(item.textType);
    setTone(item.tone);
    setLevel(item.level);
    setOptionalContext(item.optionalContext || '');
    setActiveTab('workspace');

    setCurrentResponse({
      originalText: item.originalText,
      rewrittenText: item.rewrittenText,
      explanation: item.explanation || 'Loaded from session history.',
      analysis: {
        issues: [],
        readabilityMetrics: {
          wordCount: item.originalWords,
          sentenceCount: 1,
          averageSentenceLength: item.originalWords,
          repetitionCount: 0
        },
        summary: 'Loaded from session history.'
      },
      verification: {
        status: item.verificationStatus,
        deterministicPassed: true,
        preservedItems: [],
        preservedEntities: [],
        preservedNumbersDates: [],
        needsReviewItems: [],
        potentiallyChangedFacts: [],
        meaningCertaintyNotes: [],
        summary: 'Historical session record.',
        disclaimer: 'Loaded from previous verification.'
      },
      meta: {
        textType: item.textType,
        tone: item.tone,
        level: item.level,
        originalWords: item.originalWords,
        rewrittenWords: item.rewrittenWords,
        latencyMs: 0
      }
    });

    if (inputRef.current) {
      inputRef.current.focus();
    }
    showToast('Session loaded into workspace.');
  };

  const handleUseAsInput = (newText: string) => {
    setInputText(newText);
    setCurrentResponse(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    showToast('Output transferred to editor for iterative refinement.');
  };

  const isAiReady = serverAiConfigured || Boolean(clientApiKey.trim());

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col font-sans bg-grid-pattern selection:bg-indigo-500 selection:text-white">
      {/* Sticky Header Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        aiConfigured={isAiReady}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        historyCount={historyItems.length}
      />

      {/* Main Container Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: LANDING PAGE */}
        {activeTab === 'home' && (
          <LandingView
            onStartHumanizing={() => {
              setActiveTab('workspace');
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }}
            onExploreFeatures={() => {
              const el = document.getElementById('features');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                setActiveTab('about');
              }
            }}
            onOpenAbout={() => setActiveTab('about')}
          />
        )}

        {/* VIEW 2: ABOUT PAGE */}
        {activeTab === 'about' && <AboutView />}

        {/* VIEW 3: HISTORY EXPLORER */}
        {activeTab === 'history' && (
          <HistoryView
            items={historyItems}
            onSelectSession={handleReopenSession}
            onDeleteItem={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
          />
        )}

        {/* VIEW 4: HUMANIZATION WORKSPACE */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            {/* Workspace Title Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
                  <span>Humanization Studio</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20 font-mono">
                    PRO
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Refine robotic expressions into natural human communication while strictly locking all facts and scores.
                </p>
              </div>

              {/* Quick sample loader prompt */}
              <button
                onClick={() => handleSelectSample(BUILT_IN_SAMPLES[0])}
                className="self-start sm:self-auto inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold glass-card hover:border-white/20 text-indigo-300 hover:text-white transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-electric-cyan" />
                <span>Try Recruiter Sample</span>
              </button>
            </div>

            {/* Workspace Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ================= LEFT COLUMN: INPUT & REFINEMENT CONTROLS (6 COLS) ================= */}
              <div className="lg:col-span-6 space-y-5">
                <div className="glass-card rounded-2xl p-5 space-y-4 border-white/10">
                  {/* Top Bar with Counters */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-electric-cyan" />
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                        Source Text Input
                      </h2>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      <span className={charCount > MAX_CHARACTERS ? 'text-rose-400 font-bold' : ''}>
                        {charCount.toLocaleString()}
                      </span>
                      /{MAX_CHARACTERS.toLocaleString()} chars • {wordCount} words
                    </div>
                  </div>

                  {/* Sample Selector Quick Bar */}
                  <SampleSelector
                    onSelectSample={handleSelectSample}
                    onClearText={handleClearText}
                    hasText={Boolean(inputText)}
                  />

                  {/* Textarea Input Editor */}
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste robotic AI-generated text here (e.g., recruiter evaluations, candidate correspondence, interview questions, or executive reports)..."
                      rows={8}
                      className={`w-full p-4 rounded-xl text-sm leading-relaxed glass-input resize-y transition-all ${
                        isInputTooLong
                          ? 'border-rose-500/50 focus:ring-rose-500/20'
                          : 'focus:border-indigo-500'
                      }`}
                    />
                  </div>

                  {/* Over-length Warning */}
                  {isInputTooLong && (
                    <div className="flex items-center space-x-2 text-xs text-rose-300 bg-rose-950/30 p-3 rounded-xl border border-rose-500/30">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>
                        Input exceeds maximum limit ({charCount}/{MAX_CHARACTERS} chars). Please shorten text.
                      </span>
                    </div>
                  )}

                  {/* Refinement Control Selectors: Text Type, Tone, Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
                    {/* Text Type Selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Text Type
                      </label>
                      <select
                        value={textType}
                        onChange={(e) => setTextType(e.target.value as TextType)}
                        className="w-full text-xs py-2 px-2.5 rounded-xl glass-input bg-midnight-900 text-slate-200"
                      >
                        <option value="recruiter_feedback">1. Recruiter Feedback</option>
                        <option value="candidate_email">2. Candidate Email</option>
                        <option value="interview_question">3. Interview Question</option>
                        <option value="interview_summary">4. Interview Summary</option>
                        <option value="report">5. Report</option>
                        <option value="general_text">6. General Text</option>
                      </select>
                    </div>

                    {/* Tone Selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Desired Tone
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value as ToneMode)}
                        className="w-full text-xs py-2 px-2.5 rounded-xl glass-input bg-midnight-900 text-slate-200"
                      >
                        <option value="professional">Professional</option>
                        <option value="polished">Polished</option>
                        <option value="conversational">Conversational</option>
                      </select>
                    </div>

                    {/* Humanization Level */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Refinement Level
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as HumanizationLevel)}
                        className="w-full text-xs py-2 px-2.5 rounded-xl glass-input bg-midnight-900 text-slate-200"
                      >
                        <option value="light">Light (Subtle)</option>
                        <option value="balanced">Balanced (Optimal)</option>
                        <option value="strong">Strong (Deep Re-articulation)</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Context Field */}
                  <div className="pt-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Optional Audience / Situation Context
                    </label>
                    <input
                      type="text"
                      value={optionalContext}
                      onChange={(e) => setOptionalContext(e.target.value)}
                      placeholder="e.g. Feedback for senior engineer applicant rejected after system design round..."
                      className="w-full px-3 py-2 rounded-xl text-xs glass-input placeholder:text-slate-600"
                    />
                  </div>

                  {/* Primary Humanize Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleHumanize}
                      disabled={isLoading || !inputText.trim() || isInputTooLong}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all ${
                        isLoading || !inputText.trim() || isInputTooLong
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                          : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white shadow-glow-indigo hover:scale-[1.01] active:scale-[0.99]'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-electric-cyan" />
                          <span className="text-white normal-case">{loadingStep || 'Humanizing text...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-electric-cyan" />
                          <span>Humanize Text</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* API Key Missing or Error Alert */}
                  {apiError && (
                    <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-200 space-y-2">
                      <div className="flex items-start space-x-2.5">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                            {apiError.code === 'GEMINI_API_KEY_MISSING'
                              ? 'Google Gemini API Key Required'
                              : apiError.code === 'INVALID_API_KEY'
                              ? 'Invalid Gemini API Key'
                              : 'AI Service Error'}
                          </h4>
                          <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                            {apiError.message}
                          </p>
                        </div>
                      </div>

                      <div className="pt-1 flex flex-wrap gap-2 pl-6">
                        {(apiError.code === 'GEMINI_API_KEY_MISSING' ||
                          apiError.code === 'INVALID_API_KEY') && (
                          <button
                            onClick={() => setIsApiKeyModalOpen(true)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-indigo transition-all"
                          >
                            <Key className="w-3.5 h-3.5 text-electric-cyan" />
                            <span>Configure API Key</span>
                          </button>
                        )}
                        <button
                          onClick={handleHumanize}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white glass-card"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retry</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Robotic Diagnostic Analysis Panel */}
                <RoboticAnalysisCard
                  analysis={liveAnalysis}
                  isLoading={isAnalyzing && !liveAnalysis}
                />
              </div>

              {/* ================= RIGHT COLUMN: OUTPUT, COMPARISON & VERIFICATION (6 COLS) ================= */}
              <div className="lg:col-span-6 space-y-5">
                {currentResponse ? (
                  <>
                    {/* Output & Comparison Component */}
                    <ComparisonDiff
                      originalText={currentResponse.originalText}
                      rewrittenText={currentResponse.rewrittenText}
                      originalWords={currentResponse.meta.originalWords}
                      rewrittenWords={currentResponse.meta.rewrittenWords}
                      explanation={currentResponse.explanation}
                      onUseAsInput={handleUseAsInput}
                      onReset={() => setCurrentResponse(null)}
                      onRegenerate={handleHumanize}
                      isRegenerating={isLoading}
                    />

                    {/* Factuality & Meaning Preservation Report */}
                    <VerificationReportCard
                      report={currentResponse.verification}
                      onRetry={handleHumanize}
                      onKeepOriginal={() => {
                        setCurrentResponse(null);
                        showToast('Original text retained in input editor.');
                      }}
                      onAcceptAnyway={() => {
                        if (currentResponse) {
                          setCurrentResponse({
                            ...currentResponse,
                            verification: {
                              ...currentResponse.verification,
                              status: 'No obvious differences detected',
                              potentiallyChangedFacts: [],
                              summary: 'Rewrite reviewed and accepted by author.'
                            }
                          });
                          showToast('Rewrite accepted with notes.');
                        }
                      }}
                    />
                  </>
                ) : (
                  /* Empty State awaiting humanize */
                  <div className="glass-card rounded-2xl p-8 text-center space-y-5 border-white/5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-electric-cyan flex items-center justify-center mx-auto border border-indigo-500/20 shadow-glow-indigo">
                      <Sparkles className="w-7 h-7" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white">
                        Awaiting Text Input
                      </h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Paste robotic AI text on the left or select a sample, then click{' '}
                        <strong className="text-electric-cyan">Humanize Text</strong> to view natural refinement side-by-side with our fact preservation audit.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => handleSelectSample(BUILT_IN_SAMPLES[0])}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold glass-card text-slate-300 hover:text-white hover:border-white/20 transition-colors"
                      >
                        <span>Load Sample 1 (Recruiter Feedback)</span>
                      </button>
                      <button
                        onClick={() => handleSelectSample(BUILT_IN_SAMPLES[3])}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                      >
                        <span>Load Sample 4 (Score & Fact Guard)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        serverAiConfigured={serverAiConfigured}
        onSaveKey={handleSaveApiKey}
        currentKey={clientApiKey}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl glass-card bg-midnight-900 border-indigo-500/30 text-white text-xs font-medium shadow-2xl animate-fade-in shadow-glow-cyan">
          <CheckCircle2 className="w-4 h-4 text-electric-cyan shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
