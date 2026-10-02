import json
import logging
from google import genai
from google.genai import types
from pydantic import ValidationError
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.analysis import AnalysisResultSchema

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        else:
            self.client = None
        self.model_name = settings.GEMINI_MODEL

    def is_configured(self) -> bool:
        return self.client is not None

    def analyze_application(self, resume_text: str, job_description: str) -> AnalysisResultSchema:
        if not self.is_configured():
            raise HTTPException(
                status_code=503,
                detail="Gemini API is not configured. Please set GEMINI_API_KEY."
            )

        prompt = f"""
You are an expert career coach and technical recruiter. Your task is to analyze the provided resume against the provided job description and return a structured JSON evaluation.

Do NOT invent evidence. Base all claims only on the provided resume.
If a skill is missing, explicitly mark it as missing.
Distinguish between skills totally missing and skills that are present but poorly phrased.

# Resume
{resume_text}

# Job Description
{job_description}
"""

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=AnalysisResultSchema,
                    temperature=0.2,
                )
            )
            
            # Parse the response text as JSON and validate with Pydantic
            raw_result = json.loads(response.text)
            validated_result = AnalysisResultSchema(**raw_result)
            return validated_result
            
        except ValidationError as e:
            logger.error(f"Gemini output validation failed: {e}")
            raise HTTPException(status_code=502, detail="Received malformed analysis from AI provider.")
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise HTTPException(status_code=502, detail=f"AI provider error: {str(e)}")

gemini_service = GeminiService()
