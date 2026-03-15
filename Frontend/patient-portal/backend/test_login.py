import requests
import json
import time

base_url = "http://localhost:5000/api/auth"

# 1. Register
reg_data = {
    "name": "Test User",
    "email": f"test_{int(time.time())}@test.com",
    "password": "mypassword123",
    "phone": "1234567890",
    "dob": "1990-01-01"
}

r1 = requests.post(f"{base_url}/register", json=reg_data)
print(f"Register: {r1.status_code}")

# 2. Login
login_data = {
    "email": reg_data["email"],
    "password": "mypassword123"
}

r2 = requests.post(f"{base_url}/login", json=login_data)
print(f"Login: {r2.status_code} - {r2.text}")
