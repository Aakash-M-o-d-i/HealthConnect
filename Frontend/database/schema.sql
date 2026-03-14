CREATE DATABASE HealthConnect_Live;
USE HealthConnect_Live;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    dob DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(5),
    govt_id VARCHAR(50),
    health_id VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    emergency_contact TEXT,
    allergies JSON,
    chronic_conditions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    email VARCHAR(255) UNIQUE
);

CREATE TABLE medical_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    date DATE NOT NULL,
    doctor_name VARCHAR(255),
    facility VARCHAR(255),
    type VARCHAR(50),
    title VARCHAR(255),
    diagnosis TEXT,
    file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    rx_code VARCHAR(20) UNIQUE NOT NULL,
    doctor_name VARCHAR(255),
    facility VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    diagnosis TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    medicines JSON,
    pharmacy_note TEXT,
    transaction_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_name VARCHAR(255),
    facility VARCHAR(255),
    date DATE,
    time TIME,
    diagnosis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);