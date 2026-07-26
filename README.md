# ResumeCraft — AI Resume Builder & ATS Analyzer

A full-stack application that treats a resume as structured data: build and format it in a live
split-screen editor, then score it against a specific job description using an AI-powered ATS
(Applicant Tracking System) analyzer.

**Live frontend:** https://resumecraft-smit.vercel.app/

> **Current status (2026-07-26):** the Vercel frontend is deployed and serving. The Render-hosted
> API is **not currently reachable** because the MongoDB Atlas cluster it points at no longer
> exists, so sign-in and analysis are unavailable on the hosted demo until a new cluster is
> provisioned and `MONGO_URI` is updated. The application runs fully when configured locally — see
> setup below.

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript (strict), Vite 7, Redux Toolkit, Tailwind CSS 3, React Router 7 |
| Backend | Node.js, Express 5 (ESM) |
| Database | MongoDB Atlas via Mongoose 9 |
| AI | Google Gemini (`gemini-2.5-flash` by default) through its OpenAI-compatible endpoint, using the official `openai` SDK |
| PDF text extraction | `pdf2json`, isolated in a CommonJS wrapper (`server/utils/pdfParser.cjs`) |
| Image storage | ImageKit (profile photos, with face-crop transformations) |
| Auth | JWT (30-day expiry) with bcrypt password hashing |
| Hosting | Frontend on Vercel, API on Render |

## Features

**Resume builder** — unlimited resumes per account, each with Personal Info, Summary, Experience,
Education, Projects and grouped Skills. Live split-screen preview, three templates (Classic,
Modern, Minimal), drag-and-drop section reordering (`@dnd-kit`), accent colour picker, and controls
for font family, size, line height, section spacing, margins and paper size (A4/Letter).

**ATS analyzer** — upload a PDF *or* pick a saved resume, paste a target job description, and
receive a 0–100 compatibility score broken down across four categories (tone/style, content,
structure, skills), plus present/missing keyword lists, critical improvements and optional
expert suggestions. Fully wired end to end.

**AI content enhancement** — "Enhance with AI" on the professional summary and on each experience
entry's description, rewriting text toward achievement- and metric-oriented bullet points.

**PDF export** — native browser print-to-PDF driven by a dedicated `@media print` stylesheet that
hides the editor chrome and renders the resume at 1:1 scale.

## Prerequisites

- Node.js v18+ (developed on v24)
- A MongoDB Atlas cluster (or any MongoDB instance)
- A Google Gemini API key from Google AI Studio
- An ImageKit account — only needed for profile-photo uploads

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env    # then fill in your own values
npm start               # http://localhost:5000
```

`server/.env.example` documents every required variable. `.env` itself is gitignored and is never
committed.

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Signing secret for auth tokens |
| `OPENAI_API_KEY` | Gemini API key (this name is what the `openai` SDK reads) |
| `OPENAI_MODEL` | Optional; defaults to `gemini-2.5-flash` |
| `IMAGEKIT_PUBLIC_KEY` / `IMAGEKIT_PRIVATE_KEY` / `IMAGEKIT_URL_ENDPOINT` | Image uploads |
| `PORT` | Optional; defaults to `5000` |
| `CORS_ORIGIN` | Comma-separated allowed origins. Unset allows all — local development only |

The API stays up even when the database is unreachable: `GET /health` reports process and database
status independently, and database-backed routes return `503` rather than hanging.

### 2. Frontend

```bash
cd client
npm install
npm run dev             # http://localhost:5173
```

Set `VITE_API_URL` if the API is not on `http://localhost:5000/api`.

### 3. Tests

```bash
cd server
npm test
```

Seven smoke tests using Node's built-in test runner — no test framework, no database, no network,
no API keys required. Covers health reporting, unauthenticated access rejection, JSON 404
handling, AI rate limiting, and validation of the model's analysis response.

## API

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/health` | — | Liveness plus database connection state |
| `POST` | `/api/auth/register` | — | Create an account, returns a JWT |
| `POST` | `/api/auth/login` | — | Sign in, returns a JWT |
| `GET` | `/api/resumes` | JWT | List the caller's resumes |
| `POST` | `/api/resumes/create` | JWT | Create a resume |
| `GET` | `/api/resumes/:id` | JWT | Fetch one owned resume |
| `PUT` | `/api/resumes/update` | JWT | Update a resume; optional profile-image upload |
| `DELETE` | `/api/resumes/:id` | JWT | Delete an owned resume |
| `GET` | `/api/resumes/public/:id` | — | Fetch a resume the owner marked public via the builder toggle |
| `POST` | `/api/ai/analyze` | JWT | ATS analysis from a PDF upload or resume text |
| `POST` | `/api/ai/enhance-summary` | JWT | Rewrite a professional summary |
| `POST` | `/api/ai/enhance-job-description` | JWT | Rewrite an experience description into bullets |

`/api/auth/*` is rate limited to 20 requests per 15 minutes per IP, `/api/ai/*` to 30, so the
metered model endpoint cannot be called without bound.

## Known limitations

- Resume sharing works (Public/Private toggle in the builder, served by `GET /api/resumes/public/:id`),
  but no UI displays or copies the share URL, so the link is not discoverable in-app.
- The `Classic` template does not honour custom section ordering; `Modern` and `Minimal` do.
- Page-break markers in the preview are positioned at fixed intervals rather than measured from
  content height.
- ATS scores are model judgements, not calibrated against any real ATS product, and are
  non-deterministic (`temperature: 0.7`).
- No CI pipeline; tests are run locally.

## Roadmap

- UI for the existing public-resume sharing endpoint
- Cover-letter generation from a resume plus job description
- Resume cloning to target different roles
- Content-measured page-break markers

## Author

Smit Makodia — sole author of this repository.

## Licence

No licence file is currently present; all rights reserved by default.
