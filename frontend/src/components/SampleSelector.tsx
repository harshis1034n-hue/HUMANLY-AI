import React from 'react';
import {
  Sparkles,
  Trash2,
  Mail,
  MessageSquare,
  ShieldCheck,
  FileText,
  HelpCircle,
  Zap
} from 'lucide-react';
import { SampleItem } from '../types';

export const BUILT_IN_SAMPLES: SampleItem[] = [
  {
    id: 'sample-recruiter',
    title: 'Recruiter Feedback',
    badge: 'Popular',
    description: 'Constructive candidate evaluation; removes robotic "The candidate demonstrated" loops',
    textType: 'recruiter_feedback',
    tone: 'conversational',
    level: 'balanced',
    optionalContext: 'Review for mid-level software engineer debrief, focus on problem solving and collaboration',
    text: 'The candidate demonstrated good communication skills during the system architecture exercise. The candidate also demonstrated good teamwork skills when collaborating with the panel. However, the candidate demonstrated limited familiarity with distributed caching. Overall assessment rating: 78/100 recorded on 15 September 2026.',
    factualNote: 'Preserves score 78/100, date 15 September 2026, and specific assessment observations.'
  },
  {
    id: 'sample-email',
    title: 'Candidate Email',
    badge: 'Email',
    description: 'Direct candidate status update; transforms cold bureaucratic template into respectful empathy',
    textType: 'candidate_email',
    tone: 'professional',
    level: 'balanced',
    optionalContext: 'Warm interview follow-up after final round',
    text: 'Dear Candidate, I am writing this email to inform you that our hiring committee has completed its review of your application for the Senior Product Designer role. We appreciate you taking the time to interview with 4 of our team leads on 12 October 2026.',
    factualNote: 'Preserves position title, team count (4 team leads), and date (12 October 2026).'
  },
  {
    id: 'sample-question',
    title: 'Interview Question',
    badge: 'Questions',
    description: 'Conversational interviewer prompt instead of rigid question-bank phrasing',
    textType: 'interview_question',
    tone: 'conversational',
    level: 'balanced',
    optionalContext: 'Live technical interview warm-up question',
    text: 'Can you please state in detail a scenario wherein you had to utilize an asynchronous messaging architecture in order to achieve high throughput across multiple microservices?',
    factualNote: 'Maintains technical domain requirements (asynchronous messaging, throughput, microservices).'
  },
  {
    id: 'sample-summary',
    title: 'Interview Summary',
    badge: 'Facts Guard',
    description: 'Strict verification of dates, scores, module counts, and percentages',
    textType: 'interview_summary',
    tone: 'polished',
    level: 'strong',
    optionalContext: 'Evaluation debrief for hiring panel',
    text: 'The project evaluation was completed on 15 September 2026. The candidate tested 12 modules and achieved 92% accuracy across the suite. Two modules require further optimization before production launch.',
    factualNote: 'Guarantees preservation of 15 September 2026, 12 modules, 92%, and Two modules.'
  },
  {
    id: 'sample-report',
    title: 'Executive Report',
    badge: 'Report',
    description: 'Executive briefing; tightens wordy prepositions and removes synthetic transitions',
    textType: 'report',
    tone: 'polished',
    level: 'balanced',
    optionalContext: 'Q3 engineering velocity briefing',
    text: 'Please be advised that in today\'s fast-paced environment, the engineering team has commenced implementation of the aforementioned cloud migration. We must expeditiously finalize the transition in order to reduce infrastructure overhead by 28%.',
    factualNote: 'Preserves 28% infrastructure reduction goal while removing bureaucratic jargon.'
  }
];

interface SampleSelectorProps {
  onSelectSample: (sample: SampleItem) => void;
  onClearText: () => void;
  hasText: boolean;
}

export const SampleSelector: React.FC<SampleSelectorProps> = ({
  onSelectSample,
  onClearText,
  hasText
}) => {
  return (
    <div className="space-y-2.5 mb-3">
      {/* Primary "Try Example" Prominent Recruiter Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectSample(BUILT_IN_SAMPLES[0])}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-glow-indigo transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Load realistic recruiter feedback paragraph with scores and dates"
          >
            <Sparkles className="w-3.5 h-3.5 text-electric-cyan" />
            <span>Try Example: Recruiter Feedback</span>
          </button>

          <span className="text-[11px] text-slate-500 hidden sm:inline">or load:</span>

          {BUILT_IN_SAMPLES.slice(1).map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white glass-card hover:border-white/20 transition-colors"
              title={sample.description}
            >
              {sample.title}
            </button>
          ))}
        </div>

        {hasText && (
          <button
            onClick={onClearText}
            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Clear current input"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};
