# ResumeCraft - AI-Powered Resume Builder & ATS Analyzer

**Live URL:** [https://resumecraft-smit.vercel.app/](https://resumecraft-smit.vercel.app/)  
**Repository:** [GitHub Link]  
**Status:** Production / Live  

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
*   **AI Engine:** Google Gemini 1.5 Flash (via OpenAI SDK compatibility layer)
*   **File Processing:** `pdf-parse` (Custom CJS Utility wrapper) for extracting text from PDFs.
*   **Storage:** ImageKit (for User Profile Photos)
*   **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing.

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
*   **Issue:** The `pdf-parse` library is a CommonJS module, which caused "is not a function" errors in our ES Module backend.
*   **Solution:** Created a dedicated isolation layer (`server/utils/pdfParser.cjs`) using `require` syntax and imported it into the ESM controller using a custom utility pattern.

### **Challenge 2: Infinite Preview vs. Fixed Page Size**
*   **Issue:** HTML content grows infinitely, but resumes need to fit on physical paper (A4).
*   **Solution:** Implemented a `TemplateRenderer` that enforces specific dimensions (210mm width) and added visual "Page Break" markers in the UI so users know exactly when they are exceeding one page. Refined CSS transforms to ensure high-quality scaling in preview but 1:1 scale during print.

### **Challenge 3: Complex State Synchronization**
*   **Issue:** Keeping the local form state, Redux store, and Database in sync without excessive API calls.
*   **Solution:** Implemented a local state buffer for immediate UI feedback (typing speed) and a manual "Save" trigger to persist to MongoDB. Used `useEffect` hooks to hydrate local state from Redux only on initial load to prevent overwriting user changes.

---

## 5. Future Implementations (Roadmap)

1.  **Multiple Resumes Versioning:** Allow users to clone resumes to target different industries (e.g., "Frontend Resume" vs "Backend Resume").
2.  **Cover Letter Generator:** Use the Resume + Job Description to generate a tailored cover letter.
3.  **Social Sharing:** A public "View Only" link for users to share their resume directly with recruiters.
4.  **Analytics:** Track how many times a public resume link has been opened.

## 6. Installation & Setup

### **Prerequisites**
*   Node.js v18+
*   MongoDB Atlas URI
*   Google Gemini API Key
*   ImageKit API Keys

### **Steps**
1.  **Clone Repo:** `git clone [repo_url]`
2.  **Backend:**
    *   `cd server`
    *   `npm install`
    *   Create `.env` (MONGO_URI, JWT_SECRET, OPENAI_API_KEY...)
    *   `npm start`
3.  **Frontend:**
    *   `cd client`
    *   `npm install`
    *   `npm run dev`

---

*Authored by Smit Makodia*
