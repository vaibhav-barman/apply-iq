from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.models.application import Application
from app.models.analysis import Analysis
from app.services.gemini import gemini_service
from app.schemas.analysis import AnalysisResultSchema
from app.core.config import settings

def analyze_application(db: Session, user: User, application_id: str) -> AnalysisResultSchema:
    # Verify ownership and get application with resume
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == user.id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if not application.resume or not application.resume.parsed_content:
        raise HTTPException(status_code=400, detail="Resume content is missing or not parsed")

    # Check if analysis already exists
    existing_analysis = db.query(Analysis).filter(
        Analysis.application_id == application_id
    ).first()

    # Invoke Gemini
    result: AnalysisResultSchema = gemini_service.analyze_application(
        resume_text=application.resume.parsed_content,
        job_description=application.job_description
    )

    if existing_analysis:
        existing_analysis.score = result.overall_score
        existing_analysis.model_name = settings.GEMINI_MODEL
        existing_analysis.result = result.model_dump()
    else:
        new_analysis = Analysis(
            application_id=application_id,
            user_id=user.id,
            score=result.overall_score,
            model_name=settings.GEMINI_MODEL,
            result=result.model_dump()
        )
        db.add(new_analysis)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save analysis results")

    return result

def get_analysis(db: Session, user: User, application_id: str) -> dict:
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == user.id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    analysis = db.query(Analysis).filter(
        Analysis.application_id == application_id
    ).first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return analysis.result
