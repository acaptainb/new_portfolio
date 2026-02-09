# Portfolio Website (React)

A modern, full-stack portfolio website built with React, Node.js, Express, and SQLite.

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)

### Installation and Running

Terminal 1 - Backend:
```bash
cd backend
npm install
npm run seed   # First time only
npm run dev
```
Backend runs at `http://localhost:3000`

Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## Project Structure

```
secret_portfolio/
├── backend/                      # Express + SQLite API
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.js       # sql.js connection
│   │   │   ├── schema.sql        # Tables
│   │   │   └── seed.js           # Sample data
│   │   ├── routes/
│   │   │   ├── projects.js
│   │   │   ├── experience.js
│   │   │   └── contact.js
│   │   └── server.js
│   └── package.json
├── frontend/                     # Vite + React
│   ├── src/
│   │   ├── api/api.js            # API client
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── ExperienceItem.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   ├── ExperiencePage.jsx
│   │   │   └── ContactPage.jsx
│   │   ├── styles/styles.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/projects` | Get all projects |
| GET | `/api/experience` | Get experience (grouped) |
| POST | `/api/contact` | Submit contact form |

---

## Internal Features (Secret Passage)

This portfolio includes a "secret passage" system:
- Locked by Default: The route `/x` returns a 404 unless unlocked.
- Lazy Loaded: Code for the secret page is not included in the main bundle.
- Internal Dashboard: A futuristic "Cyber Vault" at `/x` (unlocked via secret trigger).
  - Intelligence: Integrated viewer for contact messages.
  - Notes: Encrypted-style log storage.
  - Vault: Secure file and media uploads (ZIPs, images).
  - Spaceship UI: Completely isolated, dark-themed dashboard layout.

---

## Security

- Rate Limiting: 5 contact submissions per IP per 15 minutes
- Honeypot: Hidden field catches bots
- Parameterized Queries: SQL injection prevention

---

## Deployment (GitHub Pages + External Backend)

GitHub Pages only hosts static frontend files. Your backend must be deployed separately (Render/Railway/Fly.io, etc).

### 1) Deploy backend first
- Deploy `backend/` to your server provider.
- Set these environment variables on backend host:
  - `PORT` (provider usually sets this automatically)
  - `FRONTEND_URL` = your GitHub Pages URL (for CORS), example:
    `https://<your-user>.github.io/<your-repo>/`
- Verify backend health endpoint:
  - `https://<your-backend-domain>/api/health`

### 2) Configure GitHub Pages frontend build
A workflow is included at `.github/workflows/deploy-frontend.yml`.

In GitHub repo settings:
- Go to `Settings -> Pages` and set source to `GitHub Actions`.
- Go to `Settings -> Secrets and variables -> Actions -> Variables`.
- Add repository variable:
  - `VITE_API_BASE_URL` = `https://<your-backend-domain>/api`

### 3) Push to main
- Push your code to the `main` branch.
- GitHub Actions will build and deploy frontend automatically.

---

## Building for Production Locally

```bash
cd frontend
npm run build
```
Built files will be in `frontend/dist/`.