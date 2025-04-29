
-- SQL Server Database Schema for Medical Diagnosis Application

-- Users table for authentication
CREATE TABLE users (
    id NVARCHAR(36) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL CHECK (role IN ('doctor', 'admin', 'researcher', 'patient')),
    patient_id NVARCHAR(36) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Patients table
CREATE TABLE patients (
    id NVARCHAR(36) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender NVARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    blood_type NVARCHAR(5) NULL,
    medical_history NVARCHAR(MAX) NULL, -- Stored as JSON array
    date_added DATE NOT NULL,
    email NVARCHAR(100) NULL,
    user_id NVARCHAR(36) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Foreign key from users to patients for patient accounts
ALTER TABLE users
ADD CONSTRAINT FK_Users_Patients FOREIGN KEY (patient_id) REFERENCES patients(id);

-- AI Models table
CREATE TABLE models (
    id NVARCHAR(36) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    version NVARCHAR(20) NOT NULL,
    disease_category NVARCHAR(50) NOT NULL,
    accuracy FLOAT NOT NULL,
    description NVARCHAR(MAX) NULL,
    file_path NVARCHAR(255) NULL,
    created_by NVARCHAR(36) NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    last_updated DATE NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Model Performance metrics
CREATE TABLE model_performance (
    id NVARCHAR(36) PRIMARY KEY,
    model_id NVARCHAR(36) NOT NULL,
    accuracy FLOAT NOT NULL,
    precision_value FLOAT NOT NULL, -- 'precision' is a reserved keyword in SQL
    recall FLOAT NOT NULL,
    f1_score FLOAT NOT NULL,
    auc FLOAT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (model_id) REFERENCES models(id)
);

-- Symptom definitions
CREATE TABLE symptoms (
    id NVARCHAR(36) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    category NVARCHAR(50) NOT NULL,
    value_type NVARCHAR(20) NOT NULL CHECK (value_type IN ('numeric', 'boolean', 'categorical')),
    min_value FLOAT NULL,
    max_value FLOAT NULL,
    default_value NVARCHAR(50) NULL, -- Stored as string and converted as needed
    options NVARCHAR(MAX) NULL, -- JSON array of options for categorical values
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Diagnoses/Predictions
CREATE TABLE diagnoses (
    id NVARCHAR(36) PRIMARY KEY,
    patient_id NVARCHAR(36) NOT NULL,
    model_id NVARCHAR(36) NOT NULL,
    disease NVARCHAR(100) NOT NULL,
    probability FLOAT NOT NULL,
    confidence FLOAT NOT NULL,
    risk_level NVARCHAR(10) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    suggested_tests NVARCHAR(MAX) NULL, -- JSON array
    notes NVARCHAR(MAX) NULL,
    doctor_id NVARCHAR(36) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (model_id) REFERENCES models(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- Symptom inputs for specific diagnoses
CREATE TABLE diagnosis_symptoms (
    id NVARCHAR(36) PRIMARY KEY,
    diagnosis_id NVARCHAR(36) NOT NULL,
    symptom_id NVARCHAR(36) NOT NULL,
    value NVARCHAR(255) NOT NULL, -- String representation of the value
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(id),
    FOREIGN KEY (symptom_id) REFERENCES symptoms(id)
);

-- Appointments
CREATE TABLE appointments (
    id NVARCHAR(36) PRIMARY KEY,
    patient_id NVARCHAR(36) NOT NULL,
    doctor_id NVARCHAR(36) NOT NULL,
    appointment_date DATETIME2 NOT NULL,
    purpose NVARCHAR(255) NULL,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    notes NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- Medical records
CREATE TABLE medical_records (
    id NVARCHAR(36) PRIMARY KEY,
    patient_id NVARCHAR(36) NOT NULL,
    record_type NVARCHAR(50) NOT NULL,
    file_path NVARCHAR(255) NOT NULL,
    uploaded_by NVARCHAR(36) NOT NULL,
    upload_date DATE NOT NULL,
    description NVARCHAR(255) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IX_Users_Email ON users(email);
CREATE INDEX IX_Users_Role ON users(role);
CREATE INDEX IX_Patients_UserId ON patients(user_id);
CREATE INDEX IX_Models_Category ON models(disease_category);
CREATE INDEX IX_Diagnoses_PatientId ON diagnoses(patient_id);
CREATE INDEX IX_Diagnoses_ModelId ON diagnoses(model_id);
CREATE INDEX IX_Appointments_PatientId ON appointments(patient_id);
CREATE INDEX IX_Appointments_DoctorId ON appointments(doctor_id);
CREATE INDEX IX_MedicalRecords_PatientId ON medical_records(patient_id);
