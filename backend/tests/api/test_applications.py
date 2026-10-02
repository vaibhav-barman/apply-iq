import pytest
from app.models.resume import Resume
from app.models.user import User

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
def other_user(db):
    user = User(email="other@example.local", name="Other User")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def other_resume(db, other_user):
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
    return resume

def test_create_application(client, test_resume):
    response = client.post("/api/applications/", json={
        "resume_id": test_resume.id,
        "company": "Acme Corp",
        "job_title": "Software Engineer",
        "job_description": "We are looking for a skilled software engineer..." * 5
    })
    assert response.status_code == 200
    data = response.json()
    assert data["company"] == "Acme Corp"
    assert data["job_title"] == "Software Engineer"
    assert data["status"] == "draft"
    assert data["resume_id"] == test_resume.id

def test_create_application_invalid_description(client, test_resume):
    response = client.post("/api/applications/", json={
        "resume_id": test_resume.id,
        "company": "Acme Corp",
        "job_title": "Software Engineer",
        "job_description": "Too short"
    })
    assert response.status_code == 400

def test_create_application_other_users_resume(client, other_resume):
    response = client.post("/api/applications/", json={
        "resume_id": other_resume.id,
        "company": "Acme Corp",
        "job_title": "Software Engineer",
        "job_description": "We are looking for a skilled software engineer..." * 5
    })
    assert response.status_code == 404

def test_get_applications(client, test_resume):
    client.post("/api/applications/", json={
        "resume_id": test_resume.id,
        "company": "Acme 1",
        "job_title": "Engineer",
        "job_description": "Valid desc..." * 5
    })
    response = client.get("/api/applications/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["company"] == "Acme 1"
    assert "resume_filename" in data[0]

def test_get_single_application(client, test_resume):
    create_res = client.post("/api/applications/", json={
        "resume_id": test_resume.id,
        "company": "Acme 2",
        "job_title": "Engineer",
        "job_description": "Valid desc..." * 5
    })
    app_id = create_res.json()["id"]
    
    response = client.get(f"/api/applications/{app_id}")
    assert response.status_code == 200
    assert response.json()["company"] == "Acme 2"

def test_update_application(client, test_resume):
    create_res = client.post("/api/applications/", json={
        "resume_id": test_resume.id,
        "company": "Acme 3",
        "job_title": "Engineer",
        "job_description": "Valid desc..." * 5
    })
    app_id = create_res.json()["id"]
    
    response = client.patch(f"/api/applications/{app_id}", json={
        "status": "ready"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "ready"

def test_delete_application(client, test_resume):
    create_res = client.post("/api/applications/", json={
        "resume_id": test_resume.id,
        "company": "Acme 4",
        "job_title": "Engineer",
        "job_description": "Valid desc..." * 5
    })
    app_id = create_res.json()["id"]
    
    response = client.delete(f"/api/applications/{app_id}")
    assert response.status_code == 200
    
    response2 = client.get(f"/api/applications/{app_id}")
    assert response2.status_code == 404
