# ApplyIQ

ApplyIQ is an AI-powered job application intelligence platform. It analyzes the relationship between a candidate's resume and a specific job description to provide deep insights on ATS compatibility, missing skills, and recruiter risks.

## Prerequisites
- **Node.js** (v18+) - verify with `node -v`
- **Python** (v3.9+) - verify with `python3 --version`
- **Docker Desktop** (required to run the local PostgreSQL database)
- **Git** - verify with `git --version`

---

## 🚀 How to Run the Application Locally

You will need to open **two separate terminal tabs** (or three) to run the backend and the frontend concurrently.

### Step 1: Clone the Repository
Clone the repository to a directory of your choice and enter it:
```bash
git clone https://github.com/vaibhav-barman/apply-iq.git
cd apply-iq
```
*(All following commands assume you are running them from the `apply-iq` repository root unless otherwise stated.)*

### Step 2: Start the Database
The backend requires a PostgreSQL database. A Docker Compose file is provided to start it easily.
1. Ensure **Docker Desktop** is running.
2. Start the database service in the background:
```bash
docker-compose up -d
```
*(This starts the PostgreSQL container on port 5432 using credentials `postgres`:`password` and the database `applyiq_dev`.)*

### Step 3: Start the FastAPI Backend (Terminal 1)
1. Navigate to the backend directory:
```bash
cd backend
```
2. Create and activate a Python virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```
*(On Windows, use `venv\Scripts\activate`)*

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
Ensure a `.env` file exists in the `backend` directory (you can copy `.env.example` to `.env`). The database URL should point to your local PostgreSQL instance:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/applyiq_dev
```

5. Run database migrations to set up the schema:
```bash
alembic upgrade head
```

6. Start the FastAPI development server:
```bash
uvicorn app.main:app --reload --port 8000
```
* The backend API is now running at `http://localhost:8000`
* Interactive API documentation (Swagger) is available at `http://localhost:8000/docs`

### Step 4: Start the React Frontend (Terminal 2)
1. Open a new terminal tab and navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the Vite development server:
```bash
npm run dev
```
* The frontend application is now running at `http://localhost:5173`

*(Note: The frontend makes API calls to `http://localhost:8000/api`. This is configured by default in the codebase, so no extra `.env` is typically needed for the frontend.)*

---

## 💡 How to Use the Application

1. **Open the App:** Navigate to `http://localhost:5173` in your browser.
2. **Dashboard:** View the overview of your applications.
3. **Analyze a Job:** 
   - Click "New Analysis" or navigate to `/analyze`.
   - **Step 1:** Upload a resume (PDF or DOCX). It will be securely stored and parsed.
   - **Step 2:** Paste a job description (at least 20 characters), job title, and company name.
   - **Step 3:** Review the paired information and click "Create Application".
4. **Application History:** Go to `/applications` to view a list of all your paired resumes and job descriptions.

### Feature Status
- **Implemented:** Premium Dark Glassmorphic Design System, Resume Parsing & Management, Job Details Intake, Application Tracking Dashboard, PostgreSQL Integration.
- **Under Development (Coming Soon):** Phase 3 (AI Analysis with Gemini API), Phase 4 (Resume Studio), Phase 5 (Actionable Insights & Match Scoring), Phase 6 (Interview Prep).

---

## 🛠️ Troubleshooting

- **Database Connection Error (`psycopg2.OperationalError`)**: Ensure Docker is running and the database container is active (`docker ps`). If the container is stopped, run `docker-compose up -d` in the root directory.
- **Port Conflicts**: If port `8000` or `5173` is in use, find and kill the process using those ports, or change the port using `uvicorn --port 8001` (backend) and update the frontend API base URL accordingly.
- **Database Migration Errors**: If you encounter errors with `alembic upgrade head`, ensure you haven't switched branches with divergent schemas. You may need to drop the database and recreate it.
- **Frontend Fails to Build**: Delete the `node_modules` folder and `package-lock.json` in the `frontend` directory, and run `npm install` again. Ensure you are using Node.js v18+.
- **Missing Dependencies**: Ensure the Python virtual environment is activated (`source venv/bin/activate`) before running the backend.

---

## ⏹️ Stopping and Restarting

**To stop the servers:**
- **Frontend:** Press `Ctrl + C` in the frontend terminal.
- **Backend:** Press `Ctrl + C` in the backend terminal.
- **Database:** Run `docker-compose down` from the repository root to stop the database (data is persisted in a volume).

**To restart later:**
1. Start the database: `docker-compose up -d`
2. Start the backend: `cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000`
3. Start the frontend: `cd frontend && npm run dev`
