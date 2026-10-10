import { describe, it, expect } from 'vitest';
import { BUILT_IN_SAMPLES } from './components/SampleSelector';

describe('Humanly AI Frontend Core', () => {
  it('loads 5 built-in hackathon demonstration samples covering all primary use cases', () => {
    expect(BUILT_IN_SAMPLES.length).toBe(5);
  });

  it('verifies Recruiter Feedback sample contains evaluation scores and repetitive patterns', () => {
    const recruiterSample = BUILT_IN_SAMPLES.find((s) => s.id === 'sample-recruiter');
    expect(recruiterSample).toBeDefined();
    expect(recruiterSample?.textType).toBe('recruiter_feedback');
    expect(recruiterSample?.text).toContain('The candidate demonstrated');
    expect(recruiterSample?.text).toContain('78/100');
    expect(recruiterSample?.text).toContain('15 September 2026');
  });

  it('verifies Candidate Email sample contains candidate communication', () => {
    const emailSample = BUILT_IN_SAMPLES.find((s) => s.id === 'sample-email');
    expect(emailSample).toBeDefined();
    expect(emailSample?.textType).toBe('candidate_email');
    expect(emailSample?.text).toContain('Senior Product Designer');
    expect(emailSample?.text).toContain('4 of our team leads');
  });

  it('verifies Interview Summary sample contains strict fact invariants', () => {
    const summarySample = BUILT_IN_SAMPLES.find((s) => s.id === 'sample-summary');
    expect(summarySample).toBeDefined();
    expect(summarySample?.textType).toBe('interview_summary');
    expect(summarySample?.text).toContain('15 September 2026');
    expect(summarySample?.text).toContain('12 modules');
    expect(summarySample?.text).toContain('92% accuracy');
    expect(summarySample?.text).toContain('Two modules');
  });

  it('ensures every sample has valid TextType, ToneMode, and HumanizationLevel', () => {
    const validTypes = [
      'recruiter_feedback',
      'candidate_email',
      'interview_question',
      'interview_summary',
      'report',
      'general_text'
    ];
    const validTones = ['professional', 'polished', 'conversational'];
    const validLevels = ['light', 'balanced', 'strong'];

    for (const sample of BUILT_IN_SAMPLES) {
      expect(validTypes).toContain(sample.textType);
      expect(validTones).toContain(sample.tone);
      expect(validLevels).toContain(sample.level);
      expect(sample.text.length).toBeGreaterThan(20);
    }
  });
});
