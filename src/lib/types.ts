
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodType?: string;
  medicalHistory?: string[];
  dateAdded: string;
  email?: string; // Added for patient portal access
  userId?: string; // Reference to user account if patient has login
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'admin' | 'researcher' | 'patient';
  patientId?: string; // Reference to patient record if user is a patient
}

export interface SymptomInput {
  id: string;
  name: string;
  value: number | boolean | string;
  category: string;
}

export interface PredictionResult {
  id?: string; // For saved predictions
  disease: string;
  probability: number;
  confidence: number;
  suggestedTests?: string[];
  riskLevel: 'low' | 'medium' | 'high';
  patientId?: string; // For saving to patient records
  date?: string; // Date of prediction
  doctorId?: string; // ID of doctor who made the diagnosis
  notes?: string; // Additional notes
}

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  lastUpdated: string;
  diseaseCategory: string;
  description: string;
  createdBy?: string; // ID of the user who created the model
  isActive?: boolean; // Whether the model is currently active
  filePath?: string; // Path to the model file
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

// Database schema interfaces
export interface PatientTable {
  id: string;
  name: string;
  age: number;
  gender: string;
  blood_type: string | null;
  medical_history: string[] | null;
  date_added: string;
  email: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserTable {
  id: string;
  name: string;
  email: string;
  password_hash: string; // Hashed password
  role: string;
  patient_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiagnosisTable {
  id: string;
  patient_id: string;
  model_id: string;
  disease: string;
  probability: number;
  confidence: number;
  risk_level: string;
  suggested_tests: string[] | null;
  notes: string | null;
  doctor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModelTable {
  id: string;
  name: string;
  version: string;
  disease_category: string;
  accuracy: number;
  description: string | null;
  file_path: string | null;
  created_by: string;
  is_active: boolean;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface SymptomTable {
  id: string;
  name: string;
  category: string;
  value_type: 'numeric' | 'boolean' | 'categorical';
  min_value: number | null;
  max_value: number | null;
  default_value: string | number | boolean | null;
  options: string[] | null; // For categorical values
  created_at: string;
  updated_at: string;
}
