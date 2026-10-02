import { api } from './api';

export interface ApplicationCreate {
  resume_id: string;
  company: string;
  job_title: string;
  job_description: string;
  job_url?: string;
  location?: string;
  employment_type?: string;
  status?: string;
}

export interface ApplicationUpdate {
  company?: string;
  job_title?: string;
  job_description?: string;
  job_url?: string;
  location?: string;
  employment_type?: string;
  status?: string;
}

export interface ApplicationListItem {
  id: string;
  company: string;
  job_title: string;
  job_url?: string;
  location?: string;
  employment_type?: string;
  status: string;
  resume_filename: string;
  created_at: string;
}

export interface ApplicationResponse extends ApplicationListItem {
  resume_id: string;
  job_description: string;
  updated_at: string;
}

export const applicationService = {
  createApplication: async (data: ApplicationCreate): Promise<ApplicationResponse> => {
    const response = await api.post<ApplicationResponse>('/applications/', data);
    return response.data;
  },

  getApplications: async (): Promise<ApplicationListItem[]> => {
    const response = await api.get<ApplicationListItem[]>('/applications/');
    return response.data;
  },

  getApplication: async (id: string): Promise<ApplicationResponse> => {
    const response = await api.get<ApplicationResponse>(`/applications/${id}`);
    return response.data;
  },

  updateApplication: async (id: string, data: ApplicationUpdate): Promise<ApplicationResponse> => {
    const response = await api.patch<ApplicationResponse>(`/applications/${id}`, data);
    return response.data;
  },

  deleteApplication: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/applications/${id}`);
    return response.data;
  }
};
