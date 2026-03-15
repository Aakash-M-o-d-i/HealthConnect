import requests
import json

base_url = "http://localhost:5000/api/auth"

login_data = {
    "email": "rahul@gmail.com",
    "password": "hash123"
}

r2 = requests.post(f"{base_url}/login", json=login_data)
print(f"Login: {r2.status_code} - {r2.text}")
