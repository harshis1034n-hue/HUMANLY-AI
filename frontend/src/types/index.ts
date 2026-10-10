export type TextType =
  | 'recruiter_feedback'
  | 'candidate_email'
  | 'interview_question'
  | 'interview_summary'
  | 'report'
  | 'general_text';

// Backwards compatibility alias
export type CommunicationContext = TextType;

export type ToneMode = 'professional' | 'polished' | 'conversational';

export type HumanizationLevel = 'light' | 'balanced' | 'strong';

// Backwards compatibility alias
export type LengthPreference = HumanizationLevel;

export type VerificationStatus =
  | 'No obvious differences detected'
  | 'Potential differences found'
  | 'Verification incomplete';

export interface WritingIssue {
  type: 'generic_opening' | 'repeated_structure' | 'repetitive_phrasing' | 'excessive_formality' | 'long_sentence';
  severity: 'high' | 'medium' | 'low';
  title: string;
  snippet?: string;
  description: string;
  suggestion: string;
}

export interface ReadabilityMetrics {
  wordCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  repetitionCount: number;
}

export interface RoboticAnalysisResult {
  issues: WritingIssue[];
  readabilityMetrics: ReadabilityMetrics;
  summary: string;
}

export interface VerificationReport {
  status: VerificationStatus;
  deterministicPassed: boolean;
  preservedItems: string[];
  preservedEntities: string[];
  preservedNumbersDates: string[];
  needsReviewItems: string[];
  potentiallyChangedFacts: string[];
  meaningCertaintyNotes: string[];
  summary: string;
  disclaimer: string;
}

export interface HumanizeResponse {
  originalText: string;
  rewrittenText: string;
  explanation?: string;
  preservedEntities?: string[];
  potentialConcerns?: string[];
  analysis: RoboticAnalysisResult;
  verification: VerificationReport;
  meta: {
    textType: TextType;
    context?: TextType;
    tone: ToneMode;
    level: HumanizationLevel;
    length?: HumanizationLevel;
    optionalContext?: string;
    originalWords: number;
    rewrittenWords: number;
    latencyMs: number;
  };
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  originalText: string;
  rewrittenText: string;
  textType: TextType;
  tone: ToneMode;
  level: HumanizationLevel;
  optionalContext?: string;
  verificationStatus: VerificationStatus;
  originalWords: number;
  rewrittenWords: number;
  explanation?: string;
}

export interface HealthStatus {
  status: string;
  app: string;
  tagline: string;
  hackathon?: string;
  problemStatement?: string;
  version: string;
  aiConfigured: boolean;
  model: string;
}

export interface SampleItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  textType: TextType;
  tone: ToneMode;
  level: HumanizationLevel;
  optionalContext?: string;
  text: string;
  factualNote?: string;
}
