import pytest
from unittest.mock import patch, MagicMock
from app.models.resume import Resume
from app.schemas.analysis import AnalysisResultSchema
from app.services.gemini import GeminiService

@pytest.fixture
def test_resume(db, test_user):
    resume = Resume(
        user_id=test_user.id,
        filename="test_resume.pdf",
        file_type="pdf",
        file_size=1024,
        extracted_text="This is a test resume content.",
        page_count=1
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume

@pytest.fixture
def test_application(client, test_resume):
    response = client.post("/api/applications/", json={
        "resume_id": test_resume.id,
        "company": "Acme Corp",
        "job_title": "Software Engineer",
        "job_description": "We are looking for a skilled software engineer..." * 5
    })
    return response.json()

def test_analyze_application_success(client, test_application, db):
    mock_analysis_result = AnalysisResultSchema(
        overall_score=85,
        score_explanation="Good match",
        score_limitations="AI generated",
        skills_alignment=[],
        experience_requirements={
            "relevant_experience": [],
            "relevant_projects": [],
            "missing_requirements": [],
            "strengths": [],
            "recommendations": []
        },
        keyword_coverage=[],
        improvement_suggestions=[]
    )
    
    with patch("app.services.analysis_service.gemini_service.analyze_application", return_value=mock_analysis_result):
        app_id = test_application["id"]
        response = client.post(f"/api/applications/{app_id}/analyze")
        assert response.status_code == 200
        data = response.json()
        assert data["overall_score"] == 85
        assert data["score_explanation"] == "Good match"

def test_analyze_application_missing_api_key(client, test_application):
    with patch("app.services.analysis_service.gemini_service.is_configured", return_value=False):
        app_id = test_application["id"]
        response = client.post(f"/api/applications/{app_id}/analyze")
        assert response.status_code == 503
        assert "Gemini API is not configured" in response.json()["detail"]

def test_get_analysis(client, test_application, db):
    mock_analysis_result = AnalysisResultSchema(
        overall_score=85,
        score_explanation="Good match",
        score_limitations="AI generated",
        skills_alignment=[],
        experience_requirements={
            "relevant_experience": [],
            "relevant_projects": [],
            "missing_requirements": [],
            "strengths": [],
            "recommendations": []
        },
        keyword_coverage=[],
        improvement_suggestions=[]
    )
    
    with patch("app.services.analysis_service.gemini_service.analyze_application", return_value=mock_analysis_result):
        app_id = test_application["id"]
        client.post(f"/api/applications/{app_id}/analyze")

    response = client.get(f"/api/applications/{app_id}/analysis")
    assert response.status_code == 200
    assert response.json()["overall_score"] == 85

def test_get_analysis_not_found(client, test_application):
    app_id = test_application["id"]
    response = client.get(f"/api/applications/{app_id}/analysis")
    assert response.status_code == 404
