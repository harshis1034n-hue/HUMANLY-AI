import React, { useState } from 'react';
import {
  Sparkles,
  Key,
  History,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  BookOpen,
  Sliders,
  Home
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'workspace' | 'history' | 'about';
  onSelectTab: (tab: 'home' | 'workspace' | 'history' | 'about') => void;
  aiConfigured: boolean;
  onOpenApiKeyModal: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  aiConfigured,
  onOpenApiKeyModal,
  historyCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'workspace' | 'history' | 'about') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-midnight-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-electric-cyan p-0.5 shadow-glow-indigo transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-[10px] bg-midnight-950 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-electric-cyan" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-wider text-white">
                  HUMANLY <span className="text-electric-cyan">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Less robotic. More human. Always true.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-indigo-600/20 text-electric-cyan border border-indigo-500/30 shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick('workspace')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'workspace'
                  ? 'bg-indigo-600/20 text-electric-cyan border border-indigo-500/30 shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Humanize</span>
            </button>

            <button
              onClick={() => handleNavClick('history')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
                activeTab === 'history'
                  ? 'bg-indigo-600/20 text-electric-cyan border border-indigo-500/30 shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'about'
                  ? 'bg-indigo-600/20 text-electric-cyan border border-indigo-500/30 shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>About</span>
            </button>

            <div className="h-4 w-px bg-white/10 mx-2" />

            {/* AI API Status Button */}
            <button
              onClick={onOpenApiKeyModal}
              title="Configure Gemini API Key"
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                aiConfigured
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 animate-pulse'
              }`}
            >
              {aiConfigured ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gemini AI Ready</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Configure API Key</span>
                </>
              )}
              <Key className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenApiKeyModal}
              className={`p-2 rounded-lg border text-xs ${
                aiConfigured
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 py-4 space-y-2 animate-fade-in">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold ${
              activeTab === 'home' ? 'bg-indigo-600/20 text-electric-cyan' : 'text-slate-300'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handleNavClick('workspace')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold ${
              activeTab === 'workspace' ? 'bg-indigo-600/20 text-electric-cyan' : 'text-slate-300'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Humanize Workspace</span>
          </button>
          <button
            onClick={() => handleNavClick('history')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
              activeTab === 'history' ? 'bg-indigo-600/20 text-electric-cyan' : 'text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span>History</span>
            </div>
            {historyCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px]">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold ${
              activeTab === 'about' ? 'bg-indigo-600/20 text-electric-cyan' : 'text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>About</span>
          </button>
        </div>
      )}
    </header>
  );
};
