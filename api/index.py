"""
HUMANLY AI — Vercel Serverless Function Entrypoint
Google Student Club Welcome Hackathon 2026 - Problem Statement 02
"""

import os
import sys
import time
import logging
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Header, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Ensure local api directory is in python search path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

try:
    from .config import settings
    from .analyzer import analyzer
    from .humanizer import humanizer
    from .verifier import verifier
except ImportError:
    from config import settings
    from analyzer import analyzer
    from humanizer import humanizer
    from verifier import verifier

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("humanly-ai-vercel")

app = FastAPI(
    title="HUMANLY AI — The Human Communication Studio",
    description="Google Student Club Welcome Hackathon 2026: AI Humanization & Natural Language Refinement",
    version=settings.VERSION
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Request and Response Schemas ---

class AnalyzeRequest(BaseModel):
    text: str = Field(..., description="Source text to evaluate for robotic language patterns")


class HumanizeRequest(BaseModel):
    text: str = Field(..., description="Source text to refine into natural communication")
    textType: Optional[str] = Field("recruiter_feedback", description="Text type: recruiter_feedback, candidate_email, interview_question, interview_summary, report, general_text")
    context: Optional[str] = Field(None, description="Legacy alias for textType")
    tone: Optional[str] = Field("conversational", description="Desired tone: professional, polished, conversational")
    level: Optional[str] = Field("balanced", description="Humanization level: light, balanced, strong")
    length: Optional[str] = Field(None, description="Legacy alias for level")
    optionalContext: Optional[str] = Field(None, description="Optional audience or situation guidance")
    apiKey: Optional[str] = Field(None, description="Optional Gemini API key passed from client")


class VerifyRequest(BaseModel):
    sourceText: str = Field(..., description="Original text")
    rewrittenText: str = Field(..., description="Humanized text")
    apiKey: Optional[str] = Field(None, description="Optional Gemini API key")


# --- Custom Exception Handler for Structured Errors ---

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict):
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "REQUEST_ERROR", "message": str(exc.detail)}
    )


# --- Reusable Handlers ---

async def handle_health():
    is_configured = bool(settings.GEMINI_API_KEY)
    return {
        "status": "healthy",
        "app": "HUMANLY AI — The Human Communication Studio",
        "tagline": "Less robotic. More human. Always true.",
        "hackathon": "Google Student Club Welcome Hackathon 2026",
        "problemStatement": "Problem Statement 02: AI Humanization & Natural Language Refinement",
        "version": settings.VERSION,
        "aiConfigured": is_configured,
        "model": settings.GEMINI_MODEL
    }


async def handle_analyze(payload: AnalyzeRequest):
    text = payload.text.strip()
    if not text:
        raise HTTPException(
            status_code=422,
            detail={"error": "EMPTY_TEXT", "message": "Text cannot be empty."}
        )

    if len(text) > settings.MAX_INPUT_CHARACTERS:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "TEXT_TOO_LONG",
                "message": f"Input exceeds maximum limit of {settings.MAX_INPUT_CHARACTERS} characters (received {len(text)})."
            }
        )

    return analyzer.analyze(text)


async def handle_humanize(payload: HumanizeRequest, x_gemini_api_key: Optional[str] = None):
    start_time = time.time()
    source_text = payload.text.strip()

    if not source_text:
        raise HTTPException(
            status_code=422,
            detail={"error": "EMPTY_TEXT", "message": "Please paste or enter some text to humanize."}
        )

    if len(source_text) > settings.MAX_INPUT_CHARACTERS:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "TEXT_TOO_LONG",
                "message": f"Text exceeds length limit of {settings.MAX_INPUT_CHARACTERS} characters ({len(source_text)} characters detected)."
            }
        )

    words_count = len(source_text.split())
    if words_count > settings.MAX_INPUT_WORDS:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "WORD_LIMIT_EXCEEDED",
                "message": f"Text exceeds limit of {settings.MAX_INPUT_WORDS} words ({words_count} words detected)."
            }
        )

    active_type = payload.textType or payload.context or "recruiter_feedback"
    active_tone = payload.tone or "conversational"
    active_level = payload.level or payload.length or "balanced"
    optional_context = payload.optionalContext

    active_key = (x_gemini_api_key or "").strip() or (payload.apiKey or "").strip() or (settings.GEMINI_API_KEY or "").strip()

    analysis_result = analyzer.analyze(source_text)

    ai_result = await humanizer.rewrite_text(
        text=source_text,
        text_type=active_type,
        tone=active_tone,
        level=active_level,
        optional_context=optional_context,
        api_key=active_key
    )

    rewritten_text = ai_result.get("rewrittenText", source_text)

    verification_result = await verifier.verify(
        source_text=source_text,
        rewritten_text=rewritten_text,
        api_key=active_key
    )

    elapsed_ms = int((time.time() - start_time) * 1000)

    return {
        "originalText": source_text,
        "rewrittenText": rewritten_text,
        "explanation": ai_result.get("explanation", "Refined into natural human communication."),
        "preservedEntities": ai_result.get("preservedEntities", []),
        "potentialConcerns": ai_result.get("potentialConcerns", []),
        "analysis": analysis_result,
        "verification": verification_result,
        "meta": {
            "textType": active_type,
            "context": active_type,
            "tone": active_tone,
            "level": active_level,
            "length": active_level,
            "optionalContext": optional_context,
            "originalWords": words_count,
            "rewrittenWords": len(rewritten_text.split()),
            "latencyMs": elapsed_ms
        }
    }


async def handle_verify(payload: VerifyRequest, x_gemini_api_key: Optional[str] = None):
    if not payload.sourceText.strip() or not payload.rewrittenText.strip():
        raise HTTPException(
            status_code=422,
            detail={"error": "EMPTY_TEXT", "message": "Both sourceText and rewrittenText are required for verification."}
        )

    active_key = (x_gemini_api_key or "").strip() or (payload.apiKey or "").strip() or (settings.GEMINI_API_KEY or "").strip()

    return await verifier.verify(
        source_text=payload.sourceText,
        rewritten_text=payload.rewrittenText,
        api_key=active_key
    )


# Dual route registrations (/api/... and /...)
@app.get("/api/health")
@app.get("/health")
async def health():
    return await handle_health()


@app.post("/api/analyze")
@app.post("/analyze")
async def analyze(payload: AnalyzeRequest):
    return await handle_analyze(payload)


@app.post("/api/humanize")
@app.post("/humanize")
async def humanize(
    payload: HumanizeRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="x-gemini-api-key")
):
    return await handle_humanize(payload, x_gemini_api_key)


@app.post("/api/verify")
@app.post("/verify")
async def verify(
    payload: VerifyRequest,
    x_gemini_api_key: Optional[str] = Header(None, alias="x-gemini-api-key")
):
    return await handle_verify(payload, x_gemini_api_key)
