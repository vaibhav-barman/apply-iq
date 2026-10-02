from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.services.resume_service import process_resume_upload, get_user_resumes, get_user_resume_by_id, delete_user_resume
from app.schemas.resume import ResumeUploadResponse, ResumeResponse, ResumeListItem
from app.api.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    try:
        resume = await process_resume_upload(file, db, user)
        # We manually compute the length here for the response since text is loaded via SQLAlchemy
        # (Alternatively, could use len(resume.extracted_text) but that fetches text)
        return ResumeUploadResponse(success=True, resume=resume)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred while processing the resume.")

@router.get("/", response_model=List[ResumeListItem])
def list_resumes(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return get_user_resumes(db, user)

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return get_user_resume_by_id(db, user, resume_id)

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return delete_user_resume(db, user, resume_id)

