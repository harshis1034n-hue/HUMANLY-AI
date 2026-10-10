import os
from typing import List
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Humanly AI"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "AI Humanization & Natural Language Refinement with Guaranteed Meaning Preservation"
    TAGLINE: str = "Make AI Sound Human. Keep Every Fact Intact."
    
    # AI Credentials & Model (supports both GEMINI_API_KEY and GOOGLE_API_KEY)
    GEMINI_API_KEY: str = (os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or "").strip()
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite").strip()
    
    # Request constraints
    MAX_INPUT_CHARACTERS: int = 25000
    MAX_INPUT_WORDS: int = 5000
    REQUEST_TIMEOUT_SECONDS: float = 30.0
    
    # Server configuration
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*",  # Allow all for hackathon deployment & local testing
    ]

settings = Settings()
