from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class SkillAlignment(BaseModel):
    skill: str = Field(..., description="The skill or requirement extracted from the job description.")
    importance: Literal["core", "differentiator", "foundational"] = Field(
        ..., description="Inferred importance of this skill for the role."
    )
    status: Literal["matched", "partial", "missing"] = Field(
        ..., description="Whether the resume matches this skill."
    )
    evidence: Optional[str] = Field(
        None, description="Supporting evidence from the resume, if found."
    )
    explanation: Optional[str] = Field(
        None, description="Explanation of the gap or match."
    )

class ExperienceRequirements(BaseModel):
    relevant_experience: List[str] = Field(..., description="Relevant experience demonstrated by the resume.")
    relevant_projects: List[str] = Field(..., description="Relevant projects and qualifications.")
    missing_requirements: List[str] = Field(..., description="Important requirements with insufficient evidence.")
    strengths: List[str] = Field(..., description="Key strengths of this applicant for this role.")
    recommendations: List[str] = Field(..., description="Practical, prioritized recommendations to improve the application.")

class KeywordCoverage(BaseModel):
    keyword: str = Field(..., description="Relevant job-description term.")
    status: Literal["found", "missing"] = Field(..., description="Whether the keyword is in the resume.")
    context: Optional[str] = Field(None, description="How to incorporate it if missing and applicable, or where it was found.")

class ImprovementSuggestion(BaseModel):
    section: Literal["summary", "skills", "experience", "projects", "missing_evidence"] = Field(
        ..., description="The section of the resume to improve."
    )
    original_text: Optional[str] = Field(None, description="The original text from the resume, if applicable.")
    suggested_rewrite: Optional[str] = Field(None, description="The suggested rewrite or addition.")
    rationale: str = Field(..., description="Why this improvement helps align with the job description.")

class AnalysisResultSchema(BaseModel):
    overall_score: int = Field(..., ge=0, le=100, description="Overall resume-to-job alignment score from 0-100.")
    score_explanation: str = Field(..., description="Concise explanation of the score.")
    score_limitations: str = Field(..., description="Explanation of the limitations of this heuristic score.")
    
    skills_alignment: List[SkillAlignment] = Field(..., description="Detailed alignment of key skills.")
    experience_requirements: ExperienceRequirements = Field(..., description="Experience and requirement breakdown.")
    keyword_coverage: List[KeywordCoverage] = Field(..., description="Keyword coverage analysis.")
    improvement_suggestions: List[ImprovementSuggestion] = Field(..., description="Actionable improvement suggestions.")
