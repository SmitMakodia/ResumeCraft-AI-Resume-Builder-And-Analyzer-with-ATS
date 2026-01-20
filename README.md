# AI Resume Builder & Analyzer

A professional-grade, full-stack resume builder with AI capabilities.

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas Account (for Database)
- Google Gemini API Key (via Google AI Studio)
- ImageKit Account (for Image Uploads)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. **IMPORTANT:** Edit the `.env` file in `server/` and add your credentials:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   OPENAI_API_KEY=your_gemini_api_key
   IMAGEKIT_PUBLIC_KEY=...
   IMAGEKIT_PRIVATE_KEY=...
   IMAGEKIT_URL_ENDPOINT=...
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **Resume Builder:** Create unlimited resumes with sections for Experience, Education, Projects, and Skills.
- **AI Enhancement:** Use the "Enhance with AI" button in Summary and Experience descriptions to improve your writing (Powered by Gemini).
- **Templates:** Switch between Modern, Minimal, and Classic layouts instantly.
- **Customization:** Change accent colors and toggle visibility.
- **ATS Analysis:** (Backend ready) Analyze your resume against job descriptions.
- **PDF Export:** Native browser print-to-PDF support with optimized CSS.
