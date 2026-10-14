# React + Express + MySQL Mini Project

This project is a small full-stack web app built with React, Express, and MySQL. It demonstrates the basic flow of a web application: the frontend sends a request to the backend, the backend talks to MySQL, and the app is packaged with Docker for easy local development.

## Architecture

- Frontend: React app served on port 3000
- Backend: Express API served on port 8081 in host mode, and internally on port 80 in Docker
- Database: MySQL 8.4 running in a Docker container
- Data: named Docker volume for database persistence

## Project structure

- backend/: Node.js Express backend and API logic
- frontend/: React frontend and proxy config
- db/: secret file and local database setup inputs
- compose.yaml: Docker Compose stack for development and demo use
- Jenkinsfile: Jenkins pipeline template for Windows + Docker Desktop
- .env.example: environment variable template
- .dockerignore: prevents sending unnecessary files to Docker

## Prerequisites

Before you run the project, install:

- Docker Desktop on Windows 11
- Node.js 22 or 24
- npm
- Git
- A browser such as Chrome or Edge

## Local setup without Docker

1. Open a terminal in the project root.
2. Install backend dependencies:
   npm.cmd --prefix backend install --no-audit --no-fund
3. Install frontend dependencies:
   npm.cmd --prefix frontend install --no-audit --no-fund
4. Start the backend with environment variables. Example:
   $env:DATABASE_HOST = 'localhost'
   $env:DATABASE_PORT = '3306'
   $env:DATABASE_DB = 'example'
   $env:DATABASE_USER = 'app'
   $env:DATABASE_PASSWORD_FILE = 'db/password.txt'
   npm.cmd --prefix backend run start
5. Start the frontend in another terminal:
   $env:API_PROXY_TARGET = 'http://localhost:8080'
   npm.cmd --prefix frontend start
6. Open http://localhost:3000

## Docker Compose setup

This project uses Docker Compose to start the database, backend, and frontend together.

Run:

docker compose -f compose.yaml up --build -d

Then open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8081/
- Backend health: http://localhost:8081/readyz

To stop the containers:

docker compose -f compose.yaml down

To stop and remove all volumes used by the stack, use:

docker compose -f compose.yaml down -v

> This is destructive and should only be used when you intentionally want to remove database data.

## Environment configuration

Use the file .env.example as a safe template. Do not commit real secrets.

Example values:

- DATABASE_HOST=db
- DATABASE_PORT=3306
- DATABASE_DB=example
- DATABASE_USER=app
- DATABASE_PASSWORD_FILE=/run/secrets/db-password
- API_PROXY_TARGET=http://backend:80

The Compose file reads the database password from `db/password.txt`. This file is ignored by Git and is not included in the public repository; create it locally before starting Compose. Never commit a real database password.

The AWS task definition under `.aws/` and the AWS deployment workflow are intentionally excluded from this public repository. The included GitHub Actions workflow runs tests and a frontend build only.

## API and health checks

The backend exposes:

- GET / returns the current database version in JSON format
- GET /readyz returns a readiness status and fails with HTTP 503 if the database is unavailable
- GET /healthz returns a basic health response

## Troubleshooting

### Frontend is blank

- Confirm Docker containers are running.
- Check that port 3000 is free.
- Confirm the frontend proxy points to the backend.

### Backend cannot connect to MySQL

- Check that the MySQL container is healthy.
- Confirm the database credentials in the secret file match the Compose environment.
- Review the logs with:
  docker compose -f compose.yaml logs --tail=200

### Docker build fails

- Ensure Docker Desktop is running.
- Check your network connection and npm registry reachability.
- Re-run the build with:
  docker compose -f compose.yaml up --build -d

### Jenkins is not reachable

- Check that the Jenkins Windows service is running and that http://localhost:8080 responds.
- The Jenkins agent needs Node.js and npm on its PATH and the Jenkins PowerShell plugin.

## Git workflow

The default branch is `main`. The public GitHub repository is `https://github.com/sudalai008/web_creating`. From the project root, check the remote and push changes with:

```powershell
git remote -v
git add .
git status --short
git commit -m "Describe the change"
git push -u origin main
```

Before committing, verify `db/password.txt` and `.aws/` are absent from `git status`. Do not force-push or overwrite someone else's history.

## Jenkins CI

The Jenkinsfile runs backend tests, frontend tests, and a frontend production build. It does not deploy the application; deploy manually after the pipeline passes. Run Jenkins on a Windows agent with Node.js/npm available to the Jenkins service account and the Jenkins PowerShell plugin installed.

Configure Jenkins as follows:

1. Open Jenkins at http://localhost:8080
2. Create a new Pipeline job.
3. Select **Pipeline script from SCM**, then **Git**.
4. Set the repository URL to `https://github.com/sudalai008/web_creating.git` and branch to `*/main`.
5. Set the script path to `Jenkinsfile`, save, and run the job.
6. For private repositories, configure Jenkins Git credentials; do not put a token in the Jenkinsfile or repository URL.

## Demo explanation for college

This project shows how a web application is built using React on the frontend, Express on the backend, and MySQL for data storage. It also demonstrates Docker containerization and deployment automation. In a real DevOps workflow, developers use version control, CI tools, and container orchestration to build, test, and deliver software more reliably.

## Credits

The project was adapted from the existing sample repository and updated for a working local stack, Docker configuration, and straightforward coursework documentation.