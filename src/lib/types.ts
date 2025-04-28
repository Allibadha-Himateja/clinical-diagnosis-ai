
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodType?: string;
  medicalHistory?: string[];
  dateAdded: string;
}

export interface SymptomInput {
  id: string;
  name: string;
  value: number | boolean | string;
  category: string;
}

export interface PredictionResult {
  disease: string;
  probability: number;
  confidence: number;
  suggestedTests?: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  lastUpdated: string;
  diseaseCategory: string;
  description: string;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}
