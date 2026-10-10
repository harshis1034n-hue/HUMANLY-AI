import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.analyzer import analyzer
from app.verifier import verifier

client = TestClient(app)


def test_health_endpoint():
    """Verify health endpoint returns correct application metadata."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "HUMANLY AI" in data["app"].upper()
    assert "tagline" in data
    assert "aiConfigured" in data
    assert "model" in data


def test_analyzer_sample_1_robotic_email():
    """Verify analyzer flags formulaic opening in Sample 1."""
    text = (
        "Dear Sir/Madam, I am writing this email to inform you that I am interested "
        "in applying for the internship opportunity. I believe that this opportunity "
        "will provide me with valuable experience and help me improve my skills."
    )
    result = analyzer.analyze(text)
    assert len(result["issues"]) >= 1
    issue_types = [issue["type"] for issue in result["issues"]]
    assert "generic_opening" in issue_types


def test_analyzer_sample_2_repetitive_feedback():
    """Verify analyzer flags repetitive phrasing and structures in Sample 2."""
    text = (
        "The candidate demonstrated good communication skills. "
        "The candidate also demonstrated good teamwork skills. "
        "The candidate demonstrated an ability to explain the solution."
    )
    result = analyzer.analyze(text)
    assert len(result["issues"]) >= 1
    issue_types = [issue["type"] for issue in result["issues"]]
    assert any(t in issue_types for t in ["repeated_structure", "repetitive_phrasing", "excessive_formality"])


def test_analyzer_empty_input():
    """Verify analyzer handles empty text gracefully."""
    result = analyzer.analyze("")
    assert result["issues"] == []
    assert result["readability_metrics"]["wordCount"] == 0
    assert result["readabilityMetrics"]["wordCount"] == 0


def test_api_analyze_endpoint_validation():
    """Verify API endpoint validation for empty input."""
    res = client.post("/api/analyze", json={"text": "   "})
    assert res.status_code == 422
    assert res.json()["error"] == "EMPTY_TEXT"


def test_deterministic_verifier_preserves_facts_sample_3():
    """
    Verify that Sample 3 facts (date, 12 modules, 92%, two modules)
    are all correctly detected and preserved in an equivalent human rewrite.
    """
    source_text = (
        "The project was completed on 15 September 2026. "
        "The team tested 12 modules and achieved 92% accuracy. "
        "Two modules require further testing."
    )
    rewritten_text = (
        "We wrapped up the project on 15 September 2026. "
        "After thoroughly testing 12 modules, the team achieved a solid 92% accuracy rate, "
        "though 2 modules still need another round of testing."
    )

    result = verifier.verify_deterministic(source_text, rewritten_text)
    assert result["passed"] is True
    assert len(result["potentiallyChanged"]) == 0

    preserved_str = " ".join(result["preservedItems"])
    assert "15 September 2026" in preserved_str
    assert "92%" in preserved_str
    assert "12" in preserved_str


def test_deterministic_verifier_score_preservation_and_tampering():
    """
    Critical requirement: If original has 'Score: 78/100',
    changing it to 'Score: 90/100' must be flagged as potentially changed.
    """
    source_text = "Candidate evaluation: Score: 78/100 across technical rounds."
    preserved_rewrite = "The candidate earned an overall score of 78/100 throughout the technical rounds."
    tampered_rewrite = "The candidate achieved a score of 90/100 throughout the technical rounds."

    # 1. Preserved case
    res_ok = verifier.verify_deterministic(source_text, preserved_rewrite)
    assert res_ok["passed"] is True
    assert any("78/100" in item for item in res_ok["preservedItems"])

    # 2. Tampered case
    res_tampered = verifier.verify_deterministic(source_text, tampered_rewrite)
    assert res_tampered["passed"] is False
    assert len(res_tampered["potentiallyChanged"]) >= 1
    flagged = " ".join(res_tampered["potentiallyChanged"])
    assert "78/100" in flagged or "90/100" in flagged


def test_deterministic_verifier_flags_missing_numbers():
    """
    Verify that if a rewritten text drops a number or changes a percentage,
    the deterministic verifier immediately flags it as potentially changed.
    """
    source_text = (
        "The project was completed on 15 September 2026. "
        "The team tested 12 modules and achieved 92% accuracy. "
        "Two modules require further testing."
    )
    tampered_rewrite = (
        "We wrapped up the project recently. "
        "We tested 12 modules and achieved 85% accuracy. "
        "Two modules need more tests."
    )

    result = verifier.verify_deterministic(source_text, tampered_rewrite)
    assert result["passed"] is False
    assert len(result["potentiallyChanged"]) >= 1
    missing_str = " ".join(result["potentiallyChanged"])
    assert "92%" in missing_str or "15 September 2026" in missing_str


def test_humanize_endpoint_missing_api_key(monkeypatch):
    """
    Verify that calling /api/humanize without configured API key
    returns HTTP 401 with clear GEMINI_API_KEY_MISSING error,
    never pretending a fake rewrite succeeded.
    """
    from app.config import settings
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "")
    res = client.post(
        "/api/humanize",
        json={
            "text": "The candidate demonstrated good communication skills.",
            "textType": "recruiter_feedback",
            "tone": "conversational",
            "level": "balanced",
            "apiKey": ""
        }
    )
    assert res.status_code == 401
    data = res.json()
    assert data["error"] == "GEMINI_API_KEY_MISSING"
    assert "Google Gemini API key is not configured" in data["message"]


def test_humanize_endpoint_empty_text():
    """Verify empty text validation on /api/humanize."""
    res = client.post(
        "/api/humanize",
        json={"text": "   "}
    )
    assert res.status_code == 422
    assert res.json()["error"] == "EMPTY_TEXT"


def test_verify_endpoint_deterministic_execution():
    """Verify /api/verify executes and returns structured report."""
    res = client.post(
        "/api/verify",
        json={
            "sourceText": "Meeting set for 24 October 2026 with 5 participants.",
            "rewrittenText": "We have scheduled our meeting for 24 October 2026 with 5 participants."
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "preservedNumbersDates" in data
    assert "deterministicPassed" in data
    assert data["deterministicPassed"] is True
    assert "disclaimer" in data
