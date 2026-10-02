from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ApplicationBase(BaseModel):
    company: str
    job_title: str
    job_url: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    status: Optional[str] = "draft"

class ApplicationCreate(ApplicationBase):
    resume_id: str
    job_description: str

class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    job_title: Optional[str] = None
    job_description: Optional[str] = None
    job_url: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    status: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    id: str
    user_id: str
    resume_id: str
    job_description: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ApplicationListItem(ApplicationBase):
    id: str
    resume_filename: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
