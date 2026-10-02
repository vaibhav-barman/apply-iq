from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from app.api.routes import resumes, applications

app = FastAPI(
    title="ApplyIQ API",
    description="Backend API for ApplyIQ - AI Resume & Job Application Assistant",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(OperationalError)
async def sqlalchemy_operational_error_handler(request: Request, exc: OperationalError):
    return JSONResponse(
        status_code=503,
        content={
            "detail": "Database connection failed. Please ensure PostgreSQL is running (e.g. via 'docker-compose up -d')."
        }
    )

# Include routers
app.include_router(resumes.router, prefix="/api/resumes", tags=["resumes"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
