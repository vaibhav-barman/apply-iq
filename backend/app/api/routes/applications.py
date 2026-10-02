from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationResponse, ApplicationListItem
from app.services import application_service

router = APIRouter()

@router.post("/", response_model=ApplicationResponse)
def create_application(
    app_in: ApplicationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.create_application(db, user, app_in)

@router.get("/", response_model=List[ApplicationListItem])
def list_applications(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.get_user_applications(db, user)

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(
    application_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.get_user_application(db, user, application_id)

@router.patch("/{application_id}", response_model=ApplicationResponse)
def update_application(
    application_id: str,
    app_in: ApplicationUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.update_application(db, user, application_id, app_in)

@router.delete("/{application_id}")
def delete_application(
    application_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return application_service.delete_application(db, user, application_id)

from app.services import analysis_service
from app.schemas.analysis import AnalysisResultSchema

@router.post("/{application_id}/analyze", response_model=AnalysisResultSchema)
def analyze_application(
    application_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return analysis_service.analyze_application(db, user, application_id)

@router.get("/{application_id}/analysis", response_model=AnalysisResultSchema)
def get_analysis(
    application_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return analysis_service.get_analysis(db, user, application_id)
