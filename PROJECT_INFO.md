# ResumeCraft - AI-Powered Resume Builder & ATS Analyzer

**Live URL (frontend):** [https://resumecraft-smit.vercel.app/](https://resumecraft-smit.vercel.app/)  
**Repository:** [https://github.com/SmitMakodia/ResumeCraft-AI-Resume-Builder-And-Analyzer-with-ATS](https://github.com/SmitMakodia/ResumeCraft-AI-Resume-Builder-And-Analyzer-with-ATS)  
**Status (verified 2026-07-26):** Frontend deployed on Vercel and serving. API deployed on Render
but currently unreachable — the MongoDB Atlas cluster it references no longer resolves, so the
hosted demo cannot authenticate or analyse until a new cluster is provisioned. Runs fully when
configured locally.  

## 1. Project Overview
ResumeCraft is a professional-grade, full-stack web application designed to bridge the gap between job seekers and Applicant Tracking Systems (ATS). Unlike standard text editors, ResumeCraft treats a resume as structured data, allowing users to build, format, and optimize their CVs dynamically. The core differentiator is the integrated **ATS Analyzer**, which uses Generative AI (Google Gemini) to score a resume against a specific job description, providing actionable feedback on keywords, tone, and structure.

## 2. Technical Architecture & Stack

### **Frontend (Client)**
*   **Framework:** React 18 (Vite)
*   **Language:** TypeScript (Strict Mode)
*   **State Management:** Redux Toolkit (Centralized store for Auth & Resume Data)
*   **Styling:** Tailwind CSS v3, CSS Modules (for Print media), Framer Motion (Animations)
*   **UI Components:** Custom reusable component library (Buttons, Inputs, Modals)
*   **Key Libraries:** 
    *   `@dnd-kit/core`: For drag-and-drop section reordering.
    *   `react-color`: For custom accent color selection.
    *   `react-router-dom`: SPA Routing.
    *   `axios`: HTTP Requests with Interceptors.

### **Backend (Server)**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB Atlas (Mongoose ODM)
*   **AI Engine:** Google Gemini (`gemini-2.5-flash` default, overridable via `OPENAI_MODEL`) via the OpenAI SDK compatibility layer
*   **File Processing:** `pdf2json`, wrapped in a CommonJS isolation module (`server/utils/pdfParser.cjs`) for extracting text from PDFs
*   **Storage:** ImageKit (for User Profile Photos)
*   **Authentication:** JWT (JSON Web Tokens, 30-day expiry) with Bcrypt password hashing
*   **Abuse control:** `express-rate-limit` on `/api/auth/*` (20 per 15 min) and `/api/ai/*` (30 per 15 min)
*   **Resilience:** database connection retries with capped backoff; the HTTP server stays up during a database outage and `/health` reports both states

### **Deployment Pipeline**
*   **Frontend:** Vercel (Edge Network deployment, SPA Rewrite rules configured).
*   **Backend:** Render (Web Service, Node environment).
*   **Version Control:** Git & GitHub.

---

## 3. Key Features

### **A. Advanced Resume Builder**
*   **Dynamic Sections:** Users can add unlimited entries for Experience, Education, Projects, and Skills.
*   **Skill Groups:** Revolutionary skill management allowing users to categorize skills (e.g., "Languages", "Tools") or list them flat.
*   **Rich Editing:** Custom `BulletListEditor` for managing bullet points intuitively.
*   **Design Studio:**
    *   **Live Preview:** Split-screen view updating in real-time.
    *   **Customization:** Font selection (Inter, Roboto, Serif), Font Sizing, Line Height, and Margins control.
    *   **Ordering:** Drag-and-drop interface to rearrange section order (e.g., move Education above Experience).
    *   **Visual Toggles:** Option to show/hide icons for a cleaner look.

### **B. Intelligent ATS Analyzer**
*   **Dual Input:** Accepts PDF Uploads OR selection of an existing resume from the dashboard.
*   **Contextual Analysis:** Takes a target "Job Description" to perform a gap analysis.
*   **Scoring Engine:** Generates a 0-100 compatibility score based on 4 pillars: Tone, Content, Structure, and Skills.
*   **Keyword Matcher:** Identifies "Missing Keywords" (hard skills present in JD but missing in Resume) and "Present Keywords".
*   **Actionable Feedback:** Provides specific "Key Improvements" (Critical fixes) and "Expert Suggestions" (Bonus optimizations).

### **C. AI Content Enhancement**
*   **Generative Rewriting:** "Enhance with AI" buttons embedded in text fields.
*   **Context Awareness:** Rewrites vague job descriptions into metric-driven, action-oriented bullet points (e.g., "Did sales" -> "Increased sales revenue by 20%...").

### **D. PDF Generation**
*   **Print-Perfect CSS:** Custom `@media print` logic ensures the resume renders perfectly on A4/Letter paper without UI clutter.
*   **Visual Page Breaks:** The editor shows visual markers where a page break will occur, allowing users to adjust content length accordingly.

---

## 4. Challenges & Solutions

### **Challenge 1: PDF Parsing in Node.js ESM**
*   **Issue:** The PDF text-extraction library (`pdf2json`) is a CommonJS module, which caused "is not a function" errors in our ES Module backend.
*   **Solution:** Created a dedicated isolation layer (`server/utils/pdfParser.cjs`) using `require` syntax and imported it into the ESM controller. `pdf2json` signals completion via events rather than returning a promise, so the wrapper adapts it to a promise and enforces a 20-second timeout — otherwise a malformed PDF could leave the request hanging indefinitely.

### **Challenge 2: Infinite Preview vs. Fixed Page Size**
*   **Issue:** HTML content grows infinitely, but resumes need to fit on physical paper (A4).
*   **Solution:** Implemented a `TemplateRenderer` that enforces specific dimensions (210mm width) and added visual "Page Break" markers in the UI so users know exactly when they are exceeding one page. Refined CSS transforms to ensure high-quality scaling in preview but 1:1 scale during print.

### **Challenge 3: Complex State Synchronization**
*   **Issue:** Keeping the local form state, Redux store, and Database in sync without excessive API calls.
*   **Solution:** Implemented a local state buffer for immediate UI feedback (typing speed) and a manual "Save" trigger to persist to MongoDB. Used `useEffect` hooks to hydrate local state from Redux only on initial load to prevent overwriting user changes.

### **Challenge 4: Trusting Structured Output From a Language Model**
*   **Issue:** The ATS analysis depends on the model returning a precise JSON shape, but a language model is not a contract. It may wrap output in Markdown code fences, or return a shape the UI cannot render — and `AnalysisResult.tsx` reads nested fields directly, so a missing key throws.
*   **Solution:** Strip code fences before parsing, then validate the parsed object structurally (`isValidAnalysis`) before returning it: score must be a number within 0–100, `categories` must be an object, and both keyword lists must be arrays. Malformed output yields a clean error instead of a broken screen. An earlier truthiness check (`!analysis.score`) rejected a legitimate score of **0** — the single most important score to be able to show a user — which is now covered by a regression test.

### **Challenge 5: A Database Outage Taking Down the Whole API**
*   **Issue:** `connectDB()` originally called `process.exit(1)` when MongoDB was unreachable. Because the connection is attempted asynchronously just after the HTTP listener binds, the process would report "Server running on port N" and then die milliseconds later. On a managed host this becomes a restart loop, and the platform router — having no healthy instance — leaves every request hanging with **zero bytes** rather than returning an error, which is far harder to diagnose than a plain 500.
*   **Solution:** Retry the connection with capped backoff (1s → 2s → 5s → 10s → 30s) and never exit. The HTTP server stays up, `GET /health` reports process liveness and database state independently, and database-backed routes fail fast with `503` instead of waiting out the driver's server-selection timeout. Verified: with an unreachable cluster, `/health` answers in ~5 ms and `/api/resumes` returns 503 in ~1 ms.

---

## 5. Future Implementations (Roadmap)

1.  **Resume Cloning:** Duplicate an existing resume to target a different industry (e.g. "Frontend Resume" vs "Backend Resume"). *Note: holding multiple separate resumes per account is already implemented; only one-click cloning is outstanding.*
2.  **Cover Letter Generator:** Use the Resume + Job Description to generate a tailored cover letter.
3.  **Social Sharing — share link outstanding:** publishing already works end to end (Public/Private toggle in the builder toolbar plus `GET /api/resumes/public/:id`). What is missing is a UI that displays and copies the resulting share URL, so a user can publish a resume but has no in-app way to get its link.
4.  **Analytics:** Track how many times a public resume link has been opened.
5.  **Content-measured page breaks:** the preview currently draws page-break markers at fixed intervals rather than measuring rendered content height.
6.  **CI pipeline:** the smoke test suite (`cd server && npm test`) runs locally; it is not yet wired to GitHub Actions.

## 6. Installation & Setup

### **Prerequisites**
*   Node.js v18+
*   MongoDB Atlas URI
*   Google Gemini API Key
*   ImageKit API Keys

### **Steps**
1.  **Clone Repo:** `git clone https://github.com/SmitMakodia/ResumeCraft-AI-Resume-Builder-And-Analyzer-with-ATS.git`
2.  **Backend:**
    *   `cd server`
    *   `npm install`
    *   `cp .env.example .env`, then fill in your own values (`.env` is gitignored and never committed; `.env.example` documents every variable)
    *   `npm start`
    *   `npm test` — 7 smoke tests, no database or API keys required
3.  **Frontend:**
    *   `cd client`
    *   `npm install`
    *   `npm run dev`
    *   Set `VITE_API_URL` if the API is not at `http://localhost:5000/api`

---

*Authored by Smit Makodia*
