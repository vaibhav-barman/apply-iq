from typing import Generator
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(db: Session = Depends(get_db)) -> User:
    """
    Dummy authentication dependency for local development.
    In Phase 4/5, this will be replaced with real Supabase Auth JWT validation.
    """
    dummy_email = "alex@applyiq.local"
    user = db.query(User).filter(User.email == dummy_email).first()
    
    if not user:
        user = User(email=dummy_email, name="Alex (Dev)")
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user
