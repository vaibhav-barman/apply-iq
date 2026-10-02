# ApplyIQ

ApplyIQ is an AI-powered job application intelligence platform. It analyzes the relationship between a candidate's resume and a specific job description to provide deep insights on ATS compatibility, missing skills, and recruiter risks.

## Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **Docker** (for the local PostgreSQL database)

---

## 🚀 How to Run the Application Locally

You will need to open **three separate terminal tabs** to run the database, the backend, and the frontend concurrently.

### Step 1: Start the Database (Terminal 1)
We use a Docker container to host the local PostgreSQL database.

1. Ensure Docker Desktop is running on your machine.
2. Run the following command:
```bash
docker run --name applyiq-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=applyiq_dev -p 5432:5432 -d postgres:15-alpine
```
*(Note: If you've already created this container in the past and it is stopped, you can just run `docker start applyiq-db`)*

### Step 2: Start the FastAPI Backend (Terminal 2)
The backend is a Python FastAPI application that connects to the database and serves the API.

1. Navigate to the absolute backend directory:
```bash
cd /Users/vaibhavbarman/Desktop/Projects/apply-iq/backend
```

2. Activate the virtual environment:
```bash
source venv/bin/activate
```

3. (Optional) If you haven't run database migrations yet, initialize the database:
```bash
alembic upgrade head
```

4. Start the FastAPI development server:
```bash
uvicorn app.main:app --reload --port 8000
```
*The backend API is now running at http://localhost:8000*
*You can view the interactive API documentation at http://localhost:8000/docs*

### Step 3: Start the React Frontend (Terminal 3)
The frontend is a React SPA built with Vite, TailwindCSS, and shadcn/ui.

1. Navigate to the absolute frontend directory:
```bash
cd /Users/vaibhavbarman/Desktop/Projects/apply-iq/frontend
```

2. Install dependencies (if you haven't already):
```bash
npm install
```

3. Start the Vite development server:
```bash
npm run dev
```
*The frontend application is now running at http://localhost:5173*

---

## 🛠️ Troubleshooting

- **Database Connection Error**: Ensure your Docker container is running (`docker ps`). The backend expects PostgreSQL to be available at `postgresql://postgres:password@localhost:5432/applyiq_dev`.
- **Frontend Fails to Build**: Ensure you are using a recent version of Node.js and have run `npm install` inside the `frontend` directory.
- **Port Conflicts**: Ensure ports `8000` (backend) and `5173` (frontend) are not being used by other applications.
