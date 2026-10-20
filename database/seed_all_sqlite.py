import os
import sys
import re
import json
import sqlite3
from datetime import datetime

DB_PATH = os.path.abspath(os.path.join(r'c:\Users\mishr\OneDrive\Desktop\HealthCaonnect', 'database', 'healthconnect.db'))
DUMP_FILE = os.path.abspath(os.path.join(r'c:\Users\mishr\OneDrive\Desktop\HealthCaonnect', 'database', 'HealthConnect_Live_dump.sql'))

# Remove old DB if exists
if os.path.exists(DB_PATH):
    try:
        os.remove(DB_PATH)
    except Exception:
        pass

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Enable foreign keys
cursor.execute("PRAGMA foreign_keys = OFF;")

# Create all schemas
cursor.executescript("""
CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    experience VARCHAR(100) DEFAULT 'N/A',
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pharmacies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    license_no VARCHAR(100),
    owner VARCHAR(255),
    pharmacist_in_charge VARCHAR(255),
    type VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    website VARCHAR(255),
    gst_no VARCHAR(50),
    drug_license_no VARCHAR(100),
    operating_hours VARCHAR(255),
    services JSON,
    registration_date DATE,
    rating FLOAT DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
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
    file_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    doctor_id INTEGER,
    dispensed_at DATETIME,
    dispensed_by INTEGER,
    FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors (id),
    FOREIGN KEY (dispensed_by) REFERENCES pharmacies (id)
);

CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    date DATE NOT NULL,
    doctor_name VARCHAR(255),
    facility VARCHAR(255),
    type VARCHAR(50),
    title VARCHAR(255),
    diagnosis TEXT,
    file_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    doctor_name VARCHAR(255),
    facility VARCHAR(255),
    date DATE,
    time TIME,
    diagnosis TEXT,
    visit_type VARCHAR(50) DEFAULT 'Follow-up',
    status VARCHAR(50) DEFAULT 'Waiting',
    blood_pressure VARCHAR(50),
    temperature VARCHAR(50),
    pulse VARCHAR(50),
    weight VARCHAR(50),
    spo2 VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hospital_staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    avatar VARCHAR(10),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
""")
conn.commit()

# Parse dump
with open(DUMP_FILE, 'r', encoding='utf-8') as f:
    sql_text = f.read()

insert_pattern = re.compile(r"INSERT INTO [`\"]?(\w+)[`\"]?\s+VALUES\s*(.*?);", re.IGNORECASE | re.DOTALL)
matches = insert_pattern.findall(sql_text)

for table_name, values_str in matches:
    values_str = values_str.strip()
    if values_str.startswith('('):
        values_str = values_str[1:]
    if values_str.endswith(')'):
        values_str = values_str[:-1]

    # Split tuples safely
    rows = re.split(r'\),\s*\(', values_str)

    print(f"Loading table '{table_name}': {len(rows)} rows...")
    inserted_count = 0
    for row in rows:
        row_safe = re.sub(r'\bNULL\b', 'None', row)
        try:
            parsed_tuple = eval(f"({row_safe},)")
        except Exception as e:
            print(f"Warn: Eval failed on {row}: {e}")
            continue

        placeholders = ', '.join(['?'] * len(parsed_tuple))
        try:
            cursor.execute(f"INSERT OR REPLACE INTO {table_name} VALUES ({placeholders})", parsed_tuple)
            inserted_count += 1
        except Exception as e:
            print(f"Error inserting into {table_name}: {e}")

    conn.commit()
    print(f"Successfully inserted {inserted_count} rows into '{table_name}'.")

# Also add sample admin staff if none
cursor.execute("SELECT COUNT(*) FROM hospital_staff;")
if cursor.fetchone()[0] == 0:
    cursor.execute("""
    INSERT INTO hospital_staff (name, role, email, password_hash, department, status)
    VALUES ('Super Admin', 'Administrator', 'admin@healthconnect.com', 'scrypt:32768:8:1$3s3qODF03Oq6trI0$d7ffa1bdfc2e90335c73de2ee8c4391345066e1dc9ff1202bd380696040c44377c077adc36002b80ef2c5d0c47f27948fe3e37fdf3698c9814926629d3ce4d93', 'Operations', 'Active');
    """)
    conn.commit()
    print("Added default Administrator staff.")

conn.close()
print("All tables successfully initialized in SQLite!")
