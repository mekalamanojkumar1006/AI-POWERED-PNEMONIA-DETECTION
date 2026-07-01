export interface Prediction {
  id: string;
  patientName: string;
  patientId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  clinicalNotes?: string;
  fever?: boolean;
  cold?: boolean;
  prediction: 'Normal' | 'Pneumonia Detected' | 'Inconclusive';
  confidence: number;
  analysisDetails: {
    leftLung: string;
    rightLung: string;
    heartSize: string;
    boneDensity: string;
  };
  modelVersion: string;
  processingTime: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  analyzedAt: string;
}

export interface Stats {
  totalPredictions: number;
  pneumoniaCases: number;
  normalCases: number;
  avgProcessingTime: number;
}

export interface ModelInfo {
    modelName: string;
    version: string;
    description: string;
    accuracy: number;
    trainedOn: string;
}

export type View = 'dashboard' | 'history' | 'result';

export interface UploadData {
    xrayImage: File;
    patientName: string;
    patientId?: string;
    patientAge?: number;
    clinicalNotes?: string;
    fever?: boolean;
    cold?: boolean;
}