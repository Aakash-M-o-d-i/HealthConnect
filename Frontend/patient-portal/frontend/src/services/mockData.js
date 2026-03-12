// Dummy in-memory database for development
export const MOCK_USERS = [
    {
        id: 1,
        name: 'Aakash Modi',
        email: 'aakash@example.com',
        password: 'password123',
        phone: '+91 98765 43210',
        dob: '1992-05-15',
        gender: 'Male',
        govt_id: 'XXXX-XXXX-4567',
        health_id: 'HID-A7B3-K9M2',
        blood_group: 'B+',
        address: '24/B, Garden Residency, Satellite',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        allergies: ['Penicillin', 'Dust'],
        chronic_conditions: ['None'],
        emergency_contact: 'Priya Modi (Wife) +91 98989 12345',
        role: 'patient',
    },
];

export const MOCK_RECORDS = [
    {
        id: 1,
        patient_id: 1,
        date: '2023-10-12',
        doctor: 'Dr. Sarah Jenkins',
        facility: 'City Lab & Diagnostics',
        type: 'LAB',
        title: 'Complete Blood Count (CBC)',
        diagnosis: 'All parameters within normal range',
    },
    {
        id: 2,
        patient_id: 1,
        date: '2023-09-28',
        doctor: 'Dr. Robert Chen',
        facility: 'Metro General Hospital',
        type: 'SCAN',
        title: 'Chest X-Ray PA View',
        diagnosis: 'Normal chest X-ray, no abnormalities detected',
    },
    {
        id: 3,
        patient_id: 1,
        date: '2023-08-15',
        doctor: 'Dr. Alan Vance',
        facility: "St. Mary's Surgical Center",
        type: 'DISCHARGE',
        title: 'Discharge Summary – Appendectomy',
        diagnosis: 'Successful laparoscopic appendectomy, patient recovering well',
    },
    {
        id: 4,
        patient_id: 1,
        date: '2023-08-15',
        doctor: 'Dr. Alan Vance',
        facility: "St. Mary's Surgical Center",
        type: 'SCRIPT',
        title: 'Post-Op Medication Plan',
        diagnosis: 'Post-operative analgesics and antibiotics prescribed',
    },
    {
        id: 5,
        patient_id: 1,
        date: '2023-01-08',
        doctor: 'Nurse Brenda Lee',
        facility: 'Community Health Clinic',
        type: 'VACCINE',
        title: 'Annual Influenza Vaccine',
        diagnosis: 'Influenza vaccination administered, no adverse reactions',
    },
    {
        id: 6,
        patient_id: 1,
        date: '2023-12-10',
        doctor: 'Dr. Sarah Jenkins',
        facility: 'City Lab & Diagnostics',
        type: 'LAB',
        title: 'Lipid Profile & Glucose',
        diagnosis: 'Lipid levels slightly elevated, dietary changes recommended',
    },
];

export const MOCK_PRESCRIPTIONS = [
    {
        id: 1,
        patient_id: 1,
        rx_code: 'RX-F702-P4K0',
        doctor: 'Dr. Michael Chen',
        facility: "St. Mary's General",
        issue_date: '2026-03-08',
        expiry_date: '2026-04-07',
        diagnosis: 'Viral Fever',
        status: 'pending',
        medicines: [
            { name: 'Paracetamol 500mg', dosage: '1 tablet TDS' },
            { name: 'Azithromycin 500mg', dosage: '1 tablet OD' },
        ],
        pharmacy_note: 'Awaiting pharmacy dispensing',
    },
    {
        id: 2,
        patient_id: 1,
        rx_code: 'RX-A7B3-K9M2',
        doctor: 'Dr. Sarah Jenkins',
        facility: 'City Hospital',
        issue_date: '2026-02-12',
        expiry_date: '2026-03-12',
        diagnosis: 'Seasonal Allergy',
        status: 'dispensed',
        medicines: [{ name: 'Cetirizine 10mg', dosage: '1 tablet OD (night)' }],
        pharmacy_note: 'Dispensed by City Medical Store on 20 Mar 2026',
        transaction_id: 'TXN-8834',
    },
    {
        id: 3,
        patient_id: 1,
        rx_code: 'RX-1991-RV9',
        doctor: 'Dr. Robert Wilson',
        facility: 'Metro Radiology',
        issue_date: '2026-01-05',
        expiry_date: '2026-02-05',
        diagnosis: 'Routine Checkup',
        status: 'expired',
        medicines: [{ name: 'Multivitamins', dosage: '1 tablet OD (morning)' }],
        pharmacy_note: 'This prescription has expired',
    },
];

export const MOCK_VISITS = [
    {
        id: 1,
        patient_id: 1,
        doctor: 'Dr. Sarah Johnson',
        facility: "St. Mary's General Hospital",
        date: '2023-10-12',
        time: '10:30 AM',
        diagnosis: 'Seasonal Allergy',
    },
    {
        id: 2,
        patient_id: 1,
        doctor: 'Dr. Michael Chen',
        facility: 'Cardiology Wellness Center',
        date: '2023-09-20',
        time: '02:15 PM',
        diagnosis: 'Routine Heart Checkup',
    },
    {
        id: 3,
        patient_id: 1,
        doctor: 'Dr. Elena Rodriguez',
        facility: 'City Medical Plaza',
        date: '2023-08-15',
        time: '11:00 AM',
        diagnosis: 'General Physician Follow-up',
    },
];

export const MOCK_STATS = {
    medical_records: 8,
    prescriptions: 5,
    upcoming_visits: 2,
    health_score: 85,
};

// Simulate a delay for API responses
export const simulateDelay = (ms = 500) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// Generate a random UHID
export const generateUHID = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const part1 = Array.from({ length: 4 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    const part2 = Array.from({ length: 4 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    return `HID-${part1}-${part2}`;
};
