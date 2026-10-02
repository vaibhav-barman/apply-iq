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

def test_analyze_application_provider_failure(client, test_application):
    with patch("app.services.analysis_service.gemini_service.analyze_application", side_effect=Exception("Provider error")):
        app_id = test_application["id"]
        response = client.post(f"/api/applications/{app_id}/analyze")
        assert response.status_code == 500
        assert "Failed to analyze application" in response.json()["detail"]

def test_get_analysis_ownership_violation(client, db):
    from app.models.user import User
    from app.models.resume import Resume
    from app.models.application import Application
    from app.models.analysis import Analysis
    
    other_user = User(email="hacker@example.local", name="Hacker")
    db.add(other_user)
    db.commit()
    db.refresh(other_user)
    
    resume = Resume(
        user_id=other_user.id,
        filename="other.pdf",
        file_type="pdf",
        file_size=1024,
        extracted_text="Other resume.",
        page_count=1
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    app = Application(
        user_id=other_user.id,
        resume_id=resume.id,
        company="Other Corp",
        job_title="Engineer",
        job_description="Valid desc..." * 5,
        status="draft"
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    
    response = client.get(f"/api/applications/{app.id}/analysis")
    assert response.status_code == 404
    
    response2 = client.post(f"/api/applications/{app.id}/analyze")
    assert response2.status_code == 404

def test_analyze_application_repeated_updates(client, test_application, db):
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
    
    mock_analysis_result_2 = AnalysisResultSchema(
        overall_score=95,
        score_explanation="Excellent match",
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
    
    app_id = test_application["id"]
    
    with patch("app.services.analysis_service.gemini_service.analyze_application", return_value=mock_analysis_result):
        client.post(f"/api/applications/{app_id}/analyze")
        
    with patch("app.services.analysis_service.gemini_service.analyze_application", return_value=mock_analysis_result_2):
        response2 = client.post(f"/api/applications/{app_id}/analyze")
        assert response2.status_code == 200
        assert response2.json()["overall_score"] == 95
        
    response3 = client.get(f"/api/applications/{app_id}/analysis")
    assert response3.json()["overall_score"] == 95

