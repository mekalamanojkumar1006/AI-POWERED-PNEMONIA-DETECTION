import type { Prediction, Stats, ModelInfo, UploadData } from '../types';

const API_BASE_URL = 'http://localhost:5000';

/**
 * A helper function to make API requests and handle responses.
 * @param endpoint The API endpoint to call.
 * @param options The options for the fetch request.
 * @returns The JSON response from the API.
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      // Try to parse error details from the response body
      const errorData = await response.json().catch(() => ({ message: 'An unknown server error occurred.' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    // Re-throw the error so UI components can display a message
    throw error;
  }
}

export const getStats = (): Promise<Stats> => {
  return apiFetch<Stats>('/api/predictions/stats');
};

export const getHistory = (): Promise<Prediction[]> => {
  return apiFetch<Prediction[]>('/api/predictions/history');
};

// Special implementation to handle 404 gracefully for the UI, returning undefined as the mock did.
export const getPredictionById = async (id: string): Promise<Prediction | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predictions/results/${id}`);
    if (response.status === 404) {
      return undefined;
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown server error occurred.' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API call to /api/predictions/results/${id} failed:`, error);
    throw error;
  }
};

export const getModelInfo = (): Promise<ModelInfo> => {
  return apiFetch<ModelInfo>('/api/predictions/model-info');
};

export const uploadXray = async (data: UploadData): Promise<Prediction> => {
  const formData = new FormData();
  formData.append('xrayImage', data.xrayImage);
  formData.append('patientName', data.patientName);
  
  if (data.patientId) {
    formData.append('patientId', data.patientId);
  }
  if (data.clinicalNotes) {
    formData.append('clinicalNotes', data.clinicalNotes);
  }

  // When using FormData with fetch, the browser automatically sets the
  // 'Content-Type' header to 'multipart/form-data' with the correct boundary.
  // Do not set it manually.
  return apiFetch<Prediction>('/api/predictions/upload', {
    method: 'POST',
    body: formData,
  });
};
