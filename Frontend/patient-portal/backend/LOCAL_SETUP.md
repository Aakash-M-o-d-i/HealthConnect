# HealthConnect Local Backend Setup

To make the backend easy to run locally on your system without installing MySQL, the project is configured to use a local **SQLite database**.

## Prerequisites
- Python 3.8+ installed on your system.

## Setup Instructions
1. Open a terminal in this directory (`backend`).
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Initialize the local database. This script will read the `database_dump.sql` file and prepopulate your local SQLite database with users, doctors, prescriptions, and medical records:
   ```bash
   python init_db.py
   ```
   *You should see a message indicating "Successfully populated SQLite database with sample data."*

4. Run the Flask application:
   ```bash
   python app.py
   ```
   *The server will start locally at http://127.0.0.1:5000*

## Testing
- The dummy credentials from the dump are available. For example: `rahul@gmail.com` with password `hash123` (or depending on the frontend payload, test standard logins) can be used.
- The `init_db.py` can be re-run at any time to reset your local database to its factory state from the SQL dump.
