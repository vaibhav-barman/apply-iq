import { api } from './api';

export interface ResumeBase {
  filename: string;
  file_type: string;
  file_size: number;
  page_count: number;
}

export interface ResumeResponse extends ResumeBase {
  id: string;
  text_length: number;
  extracted_text: string;
  created_at: string;
}

export interface ResumeListItem extends ResumeBase {
  id: string;
  created_at: string;
}

export interface ResumeUploadResponse {
  success: boolean;
  resume: ResumeResponse;
}

export const resumeService = {
  uploadResume: async (file: File): Promise<ResumeUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ResumeUploadResponse>('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  getResumes: async (): Promise<ResumeListItem[]> => {
    const response = await api.get<ResumeListItem[]>('/resumes/');
    return response.data;
  },

  getResume: async (id: string): Promise<ResumeResponse> => {
    const response = await api.get<ResumeResponse>(`/resumes/${id}`);
    return response.data;
  },

  deleteResume: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/resumes/${id}`);
    return response.data;
  }
};
