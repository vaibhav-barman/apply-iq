from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ResumeBase(BaseModel):
    filename: str
    file_type: str
    file_size: int
    page_count: int

class ResumeResponse(ResumeBase):
    id: str
    text_length: int
    extracted_text: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ResumeListItem(ResumeBase):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ResumeUploadResponse(BaseModel):
    success: bool
    resume: ResumeResponse
