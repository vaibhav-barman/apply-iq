from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.application import Application
from app.models.resume import Resume
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationResponse, ApplicationListItem

def create_application(db: Session, user: User, app_in: ApplicationCreate) -> Application:
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == app_in.resume_id, Resume.user_id == user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found or you don't have access to it")
    
    if len(app_in.job_description.strip()) < 20:
        raise HTTPException(status_code=400, detail="Job description is too short")

    db_app = Application(
        user_id=user.id,
        resume_id=app_in.resume_id,
        company=app_in.company,
        job_title=app_in.job_title,
        job_description=app_in.job_description,
        job_url=app_in.job_url,
        location=app_in.location,
        employment_type=app_in.employment_type,
        status=app_in.status or "draft"
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

def get_user_applications(db: Session, user: User) -> list[ApplicationListItem]:
    # Query applications with their related resume to get the filename
    apps = db.query(Application).filter(Application.user_id == user.id).order_by(Application.created_at.desc()).all()
    
    results = []
    for app in apps:
        item = ApplicationListItem(
            id=app.id,
            company=app.company,
            job_title=app.job_title,
            job_url=app.job_url,
            location=app.location,
            employment_type=app.employment_type,
            status=app.status,
            resume_filename=app.resume.filename if app.resume else "Unknown",
            created_at=app.created_at
        )
        results.append(item)
    return results

def get_user_application(db: Session, user: User, application_id: str) -> Application:
    app = db.query(Application).filter(Application.id == application_id, Application.user_id == user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

def update_application(db: Session, user: User, application_id: str, app_in: ApplicationUpdate) -> Application:
    app = db.query(Application).filter(Application.id == application_id, Application.user_id == user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    update_data = app_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(app, field, value)
        
    db.commit()
    db.refresh(app)
    return app

def delete_application(db: Session, user: User, application_id: str) -> dict:
    app = db.query(Application).filter(Application.id == application_id, Application.user_id == user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    db.delete(app)
    db.commit()
    return {"success": True}
