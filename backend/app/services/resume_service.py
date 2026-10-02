import io
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.schemas.resume import ResumeUploadResponse, ResumeResponse, ResumeListItem
from app.models.resume import Resume
from app.models.user import User
from app.services.parsers.pdf_parser import extract_text_from_pdf
from app.services.parsers.docx_parser import extract_text_from_docx

MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

ALLOWED_MIME_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
}

async def process_resume_upload(file: UploadFile, db: Session, user: User) -> ResumeResponse:
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise ValueError(f"Unsupported file type: {file.content_type}. Please upload a PDF or DOCX file.")
    
    content = await file.read()
    file_size = len(content)
    
    if file_size > MAX_FILE_SIZE_BYTES:
        raise ValueError(f"File too large. Maximum size is {MAX_FILE_SIZE_MB}MB.")
    if file_size == 0:
        raise ValueError("File is empty.")

    file_type = ALLOWED_MIME_TYPES[file.content_type]
    file_stream = io.BytesIO(content)

    extracted_text = ""
    page_count = 0

    try:
        if file_type == "pdf":
            extracted_text, page_count = extract_text_from_pdf(file_stream)
        elif file_type == "docx":
            extracted_text, page_count = extract_text_from_docx(file_stream)
    except Exception as e:
        raise ValueError(f"Failed to parse document: {str(e)}")

    if not extracted_text or len(extracted_text.strip()) < 50:
        raise ValueError("Could not extract sufficient text from this document. It may be scanned, image-based, or corrupted.")

    try:
        db_resume = Resume(
            user_id=user.id,
            filename=file.filename or "unknown",
            file_type=file_type,
            file_size=file_size,
            extracted_text=extracted_text,
            page_count=page_count
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
    except Exception as e:
        db.rollback()
        raise Exception(f"Database error saving resume: {str(e)}")

    return db_resume

def get_user_resumes(db: Session, user: User) -> list[ResumeListItem]:
    resumes = db.query(Resume).filter(Resume.user_id == user.id).order_by(Resume.created_at.desc()).all()
    return resumes

def get_user_resume_by_id(db: Session, user: User, resume_id: str) -> ResumeResponse:
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

def delete_user_resume(db: Session, user: User, resume_id: str) -> dict:
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    try:
        db.delete(resume)
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete resume")
