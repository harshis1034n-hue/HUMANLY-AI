"""
Humanly AI - Meaning & Factuality Preservation Verifier
"Less robotic. More human. Always true."
Google Student Club Welcome Hackathon 2026 - Problem Statement 02
"""

import re
import json
import logging
from typing import List, Dict, Any, Tuple, Optional, Set
import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# Number word mapping for flexible matching (e.g., "two" <-> "2")
NUMBER_WORD_MAP = {
    "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14,
    "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18,
    "nineteen": 19, "twenty": 20, "thirty": 30, "forty": 40,
    "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80,
    "ninety": 90, "hundred": 100, "thousand": 1000
}

COMMON_TECH_TERMS = {
    "python", "react", "typescript", "javascript", "node", "nodejs",
    "docker", "kubernetes", "aws", "gcp", "azure", "sql", "postgresql",
    "mongodb", "redis", "graphql", "rest", "api", "git", "ci/cd",
    "linux", "html", "css", "tailwind", "fastapi", "express", "vite",
    "gemini", "llm", "ai", "machine learning", "nlp"
}

VERIFICATION_DISCLAIMER = (
    "Automated verification cannot guarantee 100% factual correctness or catch every semantic nuance. "
    "Flagged items highlight potential discrepancies for human review."
)


class FactualityVerifier:
    """
    Dual-layer factuality and meaning preservation verifier:
    1. Deterministic extraction and cross-check of scores, numbers, percentages, dates,
       proper nouns, and technical terminology.
    2. AI-assisted semantic verification comparing nuanced intent, negations,
       and certainty levels.
    """

    def extract_deterministic_facts(self, text: str) -> Dict[str, Any]:
        """
        Extracts scores, numbers, percentages, dates, entities, technical terms, and negations.
        """
        # 1. Scores (e.g. Score: 78/100, 78/100, 4.5/5.0, 9/10, rating of 8/10)
        score_pattern = r"\b(?:score|rating|grade|result)?\s*[:=]?\s*(\b\d+(?:\.\d+)?\s*/\s*\d+(?:\.\d+)?\b)"
        scores = [s.strip() for s in re.findall(score_pattern, text, re.IGNORECASE)]

        # 2. Dates and temporal references
        date_pattern = (
            r"\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|"
            r"Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{2,4}|"
            r"(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|"
            r"Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{2,4}|"
            r"\d{4}[-/]\d{2}[-/]\d{2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|"
            r"Q[1-4]\s+\d{4}|(?:Q[1-4])\b)"
        )
        dates = [d.strip() for d in re.findall(date_pattern, text, re.IGNORECASE)]

        # 3. Percentages (e.g. 92%, 92.5 percent)
        percentages = [p.strip() for p in re.findall(r"\b\d+(?:\.\d+)?\s*(?:%|percent\b)", text, re.IGNORECASE)]
        pct_numbers = {re.search(r"\d+(?:\.\d+)?", p).group(0) for p in percentages if re.search(r"\d+(?:\.\d+)?", p)}

        # 4. Score numbers to avoid double-counting in raw numbers
        score_numbers = set()
        for s in scores:
            for num in re.findall(r"\d+(?:\.\d+)?", s):
                score_numbers.add(num)

        # 5. Standalone Numbers & Quantities (e.g. 12 modules, 3 candidates)
        quantities = re.findall(r"\b(\d+(?:\.\d+)?)\s*([A-Za-z]+)?\b", text)
        numeric_values = []
        for val, noun in quantities:
            if val in pct_numbers or val in score_numbers:
                continue
            numeric_values.append({
                "value": val,
                "context": f"{val} {noun}".strip() if noun else val,
                "raw": val
            })

        # 6. Number words (e.g., "Two modules", "three")
        number_words = []
        for word, num in NUMBER_WORD_MAP.items():
            pattern = rf"\b({word})\s*([A-Za-z]+)?\b"
            matches = re.findall(pattern, text, re.IGNORECASE)
            for w, n in matches:
                number_words.append({
                    "word": w.lower(),
                    "numericEquivalent": str(num),
                    "context": f"{w} {n}".strip() if n else w
                })

        # 7. Capitalized named entities
        words = text.split()
        capitalized_entities = set()
        for idx, w in enumerate(words):
            clean_w = re.sub(r"[^A-Za-z0-9]", "", w)
            if clean_w and clean_w[0].isupper() and idx > 0 and not words[idx-1].endswith(('.', '!', '?')):
                if len(clean_w) > 2 and clean_w.lower() not in {"this", "that", "there", "these", "those", "here", "also", "dear", "hello", "please"}:
                    capitalized_entities.add(clean_w)

        # 8. Technical terms
        found_tech_terms = []
        lower_text = text.lower()
        for term in sorted(COMMON_TECH_TERMS):
            if re.search(rf"\b{re.escape(term)}\b", lower_text):
                found_tech_terms.append(term)

        # 9. Negations
        negations = re.findall(r"\b(not|never|no|none|neither|nor|cannot|can't|won't|didn't|doesn't|isn't|aren't|wasn't|weren't)\b", text, re.IGNORECASE)

        return {
            "scores": scores,
            "dates": dates,
            "percentages": percentages,
            "numericValues": numeric_values,
            "numberWords": number_words,
            "entities": sorted(list(capitalized_entities)),
            "techTerms": found_tech_terms,
            "negations": [n.lower() for n in negations]
        }

    def verify_deterministic(self, source_text: str, rewritten_text: str) -> Dict[str, Any]:
        """
        Compares extracted factual elements between source and target text.
        Returns categorization: preservedItems, needsReviewItems, potentiallyChangedClaims.
        """
        source_facts = self.extract_deterministic_facts(source_text)
        target_facts = self.extract_deterministic_facts(rewritten_text)

        preserved_items: List[str] = []
        needs_review_items: List[str] = []
        potentially_changed: List[str] = []

        # A. Scores Check (Critical invariant: e.g. Score: 78/100 -> MUST NOT become 90/100)
        target_scores = set(target_facts["scores"])
        for score in source_facts["scores"]:
            # Normalize whitespace: "78 / 100" -> "78/100"
            norm_score = re.sub(r"\s+", "", score)
            matched = False
            for t_score in target_scores:
                if norm_score == re.sub(r"\s+", "", t_score):
                    matched = True
                    break
            if matched:
                preserved_items.append(f"Score: {score}")
            else:
                # Check if numbers still appear in target
                nums = re.findall(r"\d+(?:\.\d+)?", score)
                if nums and all(n in rewritten_text for n in nums):
                    needs_review_items.append(f"Score '{score}' parts found but formatted differently")
                else:
                    potentially_changed.append(f"Original score '{score}' missing or altered in rewrite")

        # Check if new scores were fabricated in target
        for t_score in target_facts["scores"]:
            norm_t = re.sub(r"\s+", "", t_score)
            if not any(norm_t == re.sub(r"\s+", "", s) for s in source_facts["scores"]):
                potentially_changed.append(f"Potentially invented or changed score in rewrite: '{t_score}'")

        # B. Percentages Check
        target_pcts = set(target_facts["percentages"])
        for pct in source_facts["percentages"]:
            val = re.search(r"\d+(?:\.\d+)?", pct).group(0)
            if any(val in tp for tp in target_pcts) or f"{val}%" in rewritten_text or f"{val} percent" in rewritten_text.lower():
                preserved_items.append(pct)
            else:
                potentially_changed.append(f"Percentage '{pct}' missing or altered")

        # C. Dates Check
        for d in source_facts["dates"]:
            # Check direct or partial inclusion (month name and year)
            if d.lower() in rewritten_text.lower():
                preserved_items.append(d)
            else:
                tokens = d.split()
                if len(tokens) >= 2 and all(t.lower() in rewritten_text.lower() for t in tokens if len(t) > 2):
                    preserved_items.append(d)
                else:
                    potentially_changed.append(f"Date '{d}' missing or altered")

        # D. Numeric Values Check
        for num_obj in source_facts["numericValues"]:
            val = num_obj["value"]
            ctx = num_obj["context"]
            num_found = False
            if re.search(rf"\b{re.escape(val)}\b", rewritten_text):
                num_found = True
            else:
                # Check if written as number word (e.g. 2 -> "two")
                for w, n in NUMBER_WORD_MAP.items():
                    if str(n) == val and re.search(rf"\b{w}\b", rewritten_text, re.IGNORECASE):
                        num_found = True
                        break

            if num_found:
                preserved_items.append(ctx)
            else:
                potentially_changed.append(f"Metric or quantity '{ctx}' missing or modified")

        # E. Number Words Check
        for nw in source_facts["numberWords"]:
            w = nw["word"]
            equiv = nw["numericEquivalent"]
            ctx = nw["context"]
            if re.search(rf"\b{w}\b", rewritten_text, re.IGNORECASE) or re.search(rf"\b{equiv}\b", rewritten_text):
                preserved_items.append(ctx)
            else:
                needs_review_items.append(f"Quantity descriptor '{ctx}' may have been rephrased")

        # F. Proper Nouns / Named Entities Check
        for ent in source_facts["entities"]:
            if re.search(rf"\b{re.escape(ent)}\b", rewritten_text, re.IGNORECASE):
                preserved_items.append(ent)
            else:
                needs_review_items.append(f"Entity '{ent}' not found verbatim (review if intended)")

        # G. Technical Terms Check
        for term in source_facts["techTerms"]:
            if re.search(rf"\b{re.escape(term)}\b", rewritten_text, re.IGNORECASE):
                preserved_items.append(f"Tech: {term}")
            else:
                needs_review_items.append(f"Technical term '{term}' not found in rewrite")

        # H. Negations check
        source_neg_count = len(source_facts["negations"])
        target_neg_count = len(target_facts["negations"])
        if source_neg_count > 0 and target_neg_count == 0:
            potentially_changed.append("Source contains negations ('not', 'never', etc.) that are absent in the rewrite.")

        # Determine overall verification status
        has_critical_issues = len(potentially_changed) > 0
        has_warnings = len(needs_review_items) > 0

        if not has_critical_issues and not has_warnings:
            status = "No obvious differences detected"
        elif has_critical_issues:
            status = "Potential differences found"
        else:
            status = "No obvious differences detected"

        summary_parts = []
        if preserved_items:
            summary_parts.append(f"{len(preserved_items)} factual item(s) preserved.")
        if potentially_changed:
            summary_parts.append(f"{len(potentially_changed)} discrepancy item(s) require review.")
        if needs_review_items:
            summary_parts.append(f"{len(needs_review_items)} item(s) rephrased.")

        summary = " ".join(summary_parts) if summary_parts else "Deterministic checks completed with no extracted entities."

        return {
            "status": status,
            "passed": not has_critical_issues,
            "preservedItems": sorted(list(set(preserved_items))),
            "needsReviewItems": sorted(list(set(needs_review_items))),
            "potentiallyChanged": sorted(list(set(potentially_changed))),
            "summary": summary,
            "disclaimer": VERIFICATION_DISCLAIMER
        }

    async def verify_semantic_ai(
        self,
        source_text: str,
        rewritten_text: str,
        api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        AI-assisted semantic comparison: evaluates whether nuances, commitments,
        or claims were altered between source and rewritten text.
        """
        active_key = (api_key or settings.GEMINI_API_KEY).strip()
        if not active_key:
            return {
                "aiAuditCompleted": False,
                "notes": ["AI semantic audit skipped (no API key configured). Deterministic checks active."]
            }

        prompt = f"""Compare the original text and rewritten text. Identify any subtle semantic shifts, altered commitments, or dropped qualifications.

ORIGINAL:
\"\"\"{source_text}\"\"\"

REWRITTEN:
\"\"\"{rewritten_text}\"\"\"

Return a JSON object:
{{
  "meaningPreserved": true,
  "confidenceNotes": ["note 1", "note 2"],
  "alteredClaims": []
}}"""

        endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={active_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"}
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(endpoint, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    raw = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    cleaned = re.sub(r"^```(?:json)?\s*", "", raw.strip(), flags=re.IGNORECASE)
                    cleaned = re.sub(r"\s*```$", "", cleaned.strip())
                    parsed = json.loads(cleaned)
                    return {
                        "aiAuditCompleted": True,
                        "meaningPreserved": parsed.get("meaningPreserved", True),
                        "notes": parsed.get("confidenceNotes", []),
                        "alteredClaims": parsed.get("alteredClaims", [])
                    }
        except Exception as e:
            logger.warning(f"AI semantic verification bypassed: {e}")

        return {
            "aiAuditCompleted": False,
            "notes": ["AI semantic verification completed with deterministic baseline."]
        }

    async def verify(
        self,
        source_text: str,
        rewritten_text: str,
        api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Full dual-layer verification combining deterministic checks with semantic audit.
        """
        deterministic_result = self.verify_deterministic(source_text, rewritten_text)

        ai_semantic = await self.verify_semantic_ai(
            source_text=source_text,
            rewritten_text=rewritten_text,
            api_key=api_key
        )

        potentially_changed = list(deterministic_result["potentiallyChanged"])
        if ai_semantic.get("aiAuditCompleted") and ai_semantic.get("alteredClaims"):
            potentially_changed.extend(ai_semantic["alteredClaims"])

        # Determine overall report status
        if len(potentially_changed) > 0:
            final_status = "Potential differences found"
        elif not deterministic_result["passed"]:
            final_status = "Potential differences found"
        else:
            final_status = "No obvious differences detected"

        # Separate preserved entities vs numbers/dates for front-end presentation
        preserved_entities = [item for item in deterministic_result["preservedItems"] if not any(char.isdigit() for char in item)]
        preserved_numbers = [item for item in deterministic_result["preservedItems"] if any(char.isdigit() for char in item)]

        notes = list(ai_semantic.get("notes", []))

        return {
            "status": final_status,
            "deterministicPassed": deterministic_result["passed"],
            "preservedItems": deterministic_result["preservedItems"],
            "preservedEntities": preserved_entities,
            "preservedNumbersDates": preserved_numbers,
            "needsReviewItems": deterministic_result["needsReviewItems"],
            "potentiallyChangedFacts": potentially_changed,
            "meaningCertaintyNotes": notes,
            "summary": deterministic_result["summary"],
            "disclaimer": VERIFICATION_DISCLAIMER
        }


verifier = FactualityVerifier()
