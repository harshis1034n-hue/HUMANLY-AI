import re
from typing import List, Dict, Any, Optional
from collections import Counter


class RoboticLanguageAnalyzer:
    """
    Analyzes text for typical robotic, stiff, and repetitive language patterns.
    Provides diagnostic guidance and suggested improvements without presenting
    unvalidated 'AI detector scores'.
    """

    GENERIC_OPENINGS = [
        (r"(?i)^(dear sir/madam|to whom it may concern|respected sir/madam)", 
         "Generic salutation", "Consider addressing the recipient by name or using a more natural greeting like 'Hi [Name]' or 'Hello'."),
        (r"(?i)i am writing this email to (inform you|let you know|state that)", 
         "Stiff introductory boilerplate", "Lead directly with your purpose instead of announcing that you are writing."),
        (r"(?i)in today's (fast-paced|rapidly evolving|dynamic) world", 
         "AI cliché opening", "Start directly with the core argument or subject."),
        (r"(?i)please be advised that", 
         "Bureaucratic preamble", "State the information directly without bureaucratic buffer phrasing."),
        (r"(?i)hope this email finds you (well|in good health)", 
         "Formulaic filler opening", "Use a more genuine greeting or proceed straight to the core message.")
    ]

    FORMAL_SUBSTITUTIONS = [
        (r"\butilize(d|s|ing)?\b", "utilize", "use", "Simpler, more conversational vocabulary improves readability."),
        (r"\bin order to\b", "in order to", "to", "Removing wordy prepositions tightens sentence rhythm."),
        (r"\bdemonstrated an ability to\b", "demonstrated an ability to", "was able to / showed", "Active verbs sound more genuine."),
        (r"\baforementioned\b", "aforementioned", "this / mentioned earlier", "Avoid archaic legalese in standard writing."),
        (r"\bcommence(d|s|ing)?\b", "commence", "start / begin", "Everyday phrasing makes communication feel approachable."),
        (r"\bexpeditiously\b", "expeditiously", "quickly / promptly", "Plain language conveys urgency more clearly."),
        (r"\bpertaining to\b", "pertaining to", "about / regarding", "Concise prepositions reduce cognitive overhead.")
    ]

    def analyze(self, text: str) -> Dict[str, Any]:
        if not text or not text.strip():
            empty_metrics = {
                "wordCount": 0,
                "sentenceCount": 0,
                "averageSentenceLength": 0,
                "repetitionCount": 0
            }
            return {
                "issues": [],
                "readabilityMetrics": empty_metrics,
                "readability_metrics": empty_metrics,
                "summary": "No text provided for analysis."
            }

        cleaned = text.strip()
        words = re.findall(r"\b[A-Za-z0-9'-]+\b", cleaned)
        word_count = len(words)
        
        # Split into sentences
        raw_sentences = [s.strip() for s in re.split(r"[.!?]+", cleaned) if s.strip()]
        sentence_count = max(1, len(raw_sentences))
        avg_sentence_len = round(word_count / sentence_count, 1)

        issues: List[Dict[str, Any]] = []

        # 1. Check generic openings
        for pattern, title, suggestion in self.GENERIC_OPENINGS:
            match = re.search(pattern, cleaned)
            if match:
                issues.append({
                    "type": "generic_opening",
                    "severity": "medium",
                    "title": title,
                    "snippet": match.group(0),
                    "description": f"Formulaic opening phrase detected: '{match.group(0)}'.",
                    "suggestion": suggestion
                })

        # 2. Check repeated sentence beginnings
        if len(raw_sentences) >= 2:
            starters = []
            for s in raw_sentences:
                w_list = re.findall(r"\b[A-Za-z0-9'-]+\b", s)
                if len(w_list) >= 2:
                    starter = f"{w_list[0]} {w_list[1]}".lower()
                    starters.append(starter)
                elif len(w_list) == 1:
                    starters.append(w_list[0].lower())

            starter_counts = Counter(starters)
            for starter, count in starter_counts.items():
                if count >= 2:
                    issues.append({
                        "type": "repeated_structure",
                        "severity": "high" if count >= 3 else "medium",
                        "title": "Monotonous sentence beginnings",
                        "snippet": f"'{starter.title()}...' repeated {count} times",
                        "description": f"{count} sentences begin with the exact same structure ('{starter.title()}').",
                        "suggestion": "Vary sentence openings and combine related thoughts into compound or complex clauses."
                    })

        # 3. Check for repetitive vocabulary (excluding common stopwords)
        stopwords = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
            "is", "was", "are", "were", "be", "been", "being", "have", "has", "had", "do",
            "does", "did", "that", "this", "these", "those", "it", "its", "i", "you", "he",
            "she", "we", "they", "my", "your", "his", "her", "their", "our", "as", "by", "from"
        }
        content_words = [w.lower() for w in words if len(w) > 3 and w.lower() not in stopwords]
        word_freq = Counter(content_words)
        repetition_count = 0
        for word, count in word_freq.most_common(5):
            # If a content word appears 3+ times in short text or ratio is high
            if count >= 3 and (word_count < 100 or count / word_count > 0.04):
                repetition_count += count
                issues.append({
                    "type": "repetitive_phrasing",
                    "severity": "medium",
                    "title": f"Frequent repetition of '{word}'",
                    "snippet": f"'{word}' used {count} times",
                    "description": f"The term '{word}' occurs {count} times in close proximity.",
                    "suggestion": "Introduce synonyms or restructure sentences to avoid robotic echo."
                })

        # 4. Check excessively formal / bloated vocabulary
        for pattern, term, replacement, suggestion in self.FORMAL_SUBSTITUTIONS:
            matches = list(re.finditer(pattern, cleaned, re.IGNORECASE))
            if matches:
                issues.append({
                    "type": "excessive_formality",
                    "severity": "low",
                    "title": f"Overly formal phrasing: '{term}'",
                    "snippet": matches[0].group(0),
                    "description": f"'{matches[0].group(0)}' sounds bureaucratic or synthetic.",
                    "suggestion": f"Replace with '{replacement}'. {suggestion}"
                })

        # 5. Check long, run-on sentences
        for s in raw_sentences:
            s_words = re.findall(r"\b[A-Za-z0-9'-]+\b", s)
            if len(s_words) > 30:
                issues.append({
                    "type": "long_sentence",
                    "severity": "medium",
                    "title": "Unnecessarily long sentence",
                    "snippet": (s[:75] + "...") if len(s) > 75 else s,
                    "description": f"Sentence contains {len(s_words)} words, which can cause cognitive fatigue.",
                    "suggestion": "Split into two crisp, punchy sentences for clearer reading flow."
                })

        # Overall summary
        if not issues:
            summary = "Text demonstrates natural variation, crisp length, and minimal robotic boilerplate."
        else:
            summary = f"Detected {len(issues)} stylistic area(s) for improvement, including structural variety and natural tone."

        metrics = {
            "wordCount": word_count,
            "sentenceCount": sentence_count,
            "averageSentenceLength": avg_sentence_len,
            "repetitionCount": repetition_count
        }

        return {
            "issues": issues,
            "readabilityMetrics": metrics,
            "readability_metrics": metrics,
            "summary": summary
        }


analyzer = RoboticLanguageAnalyzer()
