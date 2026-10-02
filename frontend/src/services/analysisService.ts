import { api } from './api';

export interface SkillAlignment {
  skill: string;
  importance: "core" | "differentiator" | "foundational";
  status: "matched" | "partial" | "missing";
  evidence?: string;
  explanation?: string;
}

export interface ExperienceRequirements {
  relevant_experience: string[];
  relevant_projects: string[];
  missing_requirements: string[];
  strengths: string[];
  recommendations: string[];
}

export interface KeywordCoverage {
  keyword: string;
  status: "found" | "missing";
  context?: string;
}

export interface ImprovementSuggestion {
  section: "summary" | "skills" | "experience" | "projects" | "missing_evidence";
  original_text?: string;
  suggested_rewrite?: string;
  rationale: string;
}

export interface AnalysisResultSchema {
  overall_score: number;
  score_explanation: string;
  score_limitations: string;
  skills_alignment: SkillAlignment[];
  experience_requirements: ExperienceRequirements;
  keyword_coverage: KeywordCoverage[];
  improvement_suggestions: ImprovementSuggestion[];
}

export const analysisService = {
  analyzeApplication: async (applicationId: string): Promise<AnalysisResultSchema> => {
    const response = await api.post<AnalysisResultSchema>(`/applications/${applicationId}/analyze`);
    return response.data;
  },

  getAnalysis: async (applicationId: string): Promise<AnalysisResultSchema> => {
    const response = await api.get<AnalysisResultSchema>(`/applications/${applicationId}/analysis`);
    return response.data;
  },
};
