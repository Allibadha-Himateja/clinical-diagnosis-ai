
import { Patient, PredictionResult, SymptomInput, ModelMetadata, ModelPerformance } from './types';

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 45,
    gender: 'male',
    bloodType: 'O+',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    dateAdded: '2023-09-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 32,
    gender: 'female',
    bloodType: 'A-',
    medicalHistory: ['Asthma', 'Eczema'],
    dateAdded: '2023-10-02'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    age: 58,
    gender: 'male',
    bloodType: 'B+',
    medicalHistory: ['Coronary Artery Disease', 'Hyperlipidemia'],
    dateAdded: '2023-08-20'
  },
  {
    id: '4',
    name: 'Emily Wilson',
    age: 27,
    gender: 'female',
    bloodType: 'AB+',
    medicalHistory: ['Migraine', 'Anemia'],
    dateAdded: '2023-10-12'
  },
  {
    id: '5',
    name: 'Michael Brown',
    age: 52,
    gender: 'male',
    bloodType: 'A+',
    medicalHistory: ['GERD', 'Osteoarthritis'],
    dateAdded: '2023-09-28'
  }
];

// Mock Symptoms for different disease categories
export const mockSymptomInputs: Record<string, SymptomInput[]> = {
  'cardiac': [
    { id: '1', name: 'Chest Pain', value: false, category: 'symptom' },
    { id: '2', name: 'Shortness of Breath', value: false, category: 'symptom' },
    { id: '3', name: 'Fatigue', value: false, category: 'symptom' },
    { id: '4', name: 'Dizziness', value: false, category: 'symptom' },
    { id: '5', name: 'Heart Rate (bpm)', value: 75, category: 'vital' },
    { id: '6', name: 'Blood Pressure Systolic (mmHg)', value: 120, category: 'vital' },
    { id: '7', name: 'Blood Pressure Diastolic (mmHg)', value: 80, category: 'vital' },
    { id: '8', name: 'Cholesterol Level (mg/dL)', value: 180, category: 'lab' },
  ],
  'diabetes': [
    { id: '1', name: 'Frequent Urination', value: false, category: 'symptom' },
    { id: '2', name: 'Excessive Thirst', value: false, category: 'symptom' },
    { id: '3', name: 'Unexpected Weight Loss', value: false, category: 'symptom' },
    { id: '4', name: 'Fasting Blood Glucose (mg/dL)', value: 95, category: 'lab' },
    { id: '5', name: 'HbA1c (%)', value: 5.7, category: 'lab' },
    { id: '6', name: 'BMI', value: 24, category: 'vital' },
  ],
  'respiratory': [
    { id: '1', name: 'Cough', value: false, category: 'symptom' },
    { id: '2', name: 'Shortness of Breath', value: false, category: 'symptom' },
    { id: '3', name: 'Wheezing', value: false, category: 'symptom' },
    { id: '4', name: 'Oxygen Saturation (%)', value: 98, category: 'vital' },
    { id: '5', name: 'Respiratory Rate (breaths/min)', value: 16, category: 'vital' },
    { id: '6', name: 'Temperature (°F)', value: 98.6, category: 'vital' },
  ]
};

// Mock Prediction Results
export const mockPredictionResults: Record<string, PredictionResult[]> = {
  'cardiac': [
    {
      disease: 'Coronary Artery Disease',
      probability: 0.78,
      confidence: 0.85,
      suggestedTests: ['ECG', 'Stress Test', 'Coronary Angiography'],
      riskLevel: 'high'
    },
    {
      disease: 'Hypertensive Heart Disease',
      probability: 0.45,
      confidence: 0.72,
      suggestedTests: ['Echocardiogram', 'Blood Pressure Monitoring'],
      riskLevel: 'medium'
    },
    {
      disease: 'Arrhythmia',
      probability: 0.23,
      confidence: 0.68,
      suggestedTests: ['Holter Monitor', 'Electrophysiology Study'],
      riskLevel: 'low'
    }
  ],
  'diabetes': [
    {
      disease: 'Type 2 Diabetes',
      probability: 0.82,
      confidence: 0.89,
      suggestedTests: ['Oral Glucose Tolerance Test', 'Fasting Insulin Test'],
      riskLevel: 'high'
    },
    {
      disease: 'Prediabetes',
      probability: 0.56,
      confidence: 0.75,
      suggestedTests: ['HbA1c Test', 'Fasting Glucose Test'],
      riskLevel: 'medium'
    },
    {
      disease: 'Gestational Diabetes',
      probability: 0.12,
      confidence: 0.60,
      suggestedTests: ['Glucose Challenge Test'],
      riskLevel: 'low'
    }
  ],
  'respiratory': [
    {
      disease: 'Chronic Obstructive Pulmonary Disease (COPD)',
      probability: 0.67,
      confidence: 0.81,
      suggestedTests: ['Pulmonary Function Test', 'Chest X-ray'],
      riskLevel: 'high'
    },
    {
      disease: 'Asthma',
      probability: 0.52,
      confidence: 0.79,
      suggestedTests: ['Spirometry', 'Methacholine Challenge'],
      riskLevel: 'medium'
    },
    {
      disease: 'Bronchitis',
      probability: 0.34,
      confidence: 0.65,
      suggestedTests: ['Chest X-ray', 'Sputum Culture'],
      riskLevel: 'low'
    }
  ]
};

// Mock Models Metadata
export const mockModels: ModelMetadata[] = [
  {
    id: '1',
    name: 'Cardiac Disease Predictor',
    version: 'v2.1',
    accuracy: 0.89,
    lastUpdated: '2023-09-01',
    diseaseCategory: 'cardiac',
    description: 'Machine learning model trained on 50,000 cardiac patient records to predict heart-related conditions.'
  },
  {
    id: '2',
    name: 'Diabetes Risk Assessment',
    version: 'v1.5',
    accuracy: 0.92,
    lastUpdated: '2023-10-05',
    diseaseCategory: 'diabetes',
    description: 'Neural network model designed to predict diabetes and related conditions based on clinical data.'
  },
  {
    id: '3',
    name: 'Respiratory Condition Analyzer',
    version: 'v1.2',
    accuracy: 0.85,
    lastUpdated: '2023-08-15',
    diseaseCategory: 'respiratory',
    description: 'Ensemble model for diagnosing respiratory diseases using patient symptoms and pulmonary function metrics.'
  }
];

// Mock Model Performance Data
export const mockModelPerformance: Record<string, ModelPerformance> = {
  '1': {
    accuracy: 0.89,
    precision: 0.87,
    recall: 0.85,
    f1Score: 0.86,
    auc: 0.92
  },
  '2': {
    accuracy: 0.92,
    precision: 0.94,
    recall: 0.91,
    f1Score: 0.92,
    auc: 0.96
  },
  '3': {
    accuracy: 0.85,
    precision: 0.83,
    recall: 0.88,
    f1Score: 0.85,
    auc: 0.90
  }
};

// Function to simulate ML prediction
export const predictDisease = (modelId: string, symptoms: SymptomInput[]): Promise<PredictionResult[]> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      const model = mockModels.find(m => m.id === modelId);
      if (!model) {
        resolve([]);
        return;
      }
      
      // Return mock predictions based on the disease category
      resolve(mockPredictionResults[model.diseaseCategory] || []);
    }, 1500);
  });
};
