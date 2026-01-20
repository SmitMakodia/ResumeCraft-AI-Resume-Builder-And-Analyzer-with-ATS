# 📘 AI Resume Builder & Analyzer – Source Code Reference

> **Auto-generated source code documentation**  
> Generated on: `2026-01-20 18:03:25`

---

## 📄 1. `server.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\server.js`

```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```

---

## 📄 2. `db.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\config\db.js`

```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

```

---

## 📄 3. `ai.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\config\ai.js`

```javascript
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

export default ai;

```

---

## 📄 4. `imagekit.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\config\imagekit.js`

```javascript
import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export default imagekit;

```

---

## 📄 5. `User.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\models\User.js`

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

```

---

## 📄 6. `Resume.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\models\Resume.js`

```javascript
import mongoose from 'mongoose';

const linkSchema = mongoose.Schema({
  name: String,
  url: String
});

const experienceSchema = mongoose.Schema({
  id: String,
  company: String,
  position: String,
  startDate: { month: String, year: String },
  endDate: { month: String, year: String },
  isCurrent: Boolean,
  description: [String], 
  achievements: [String]
});

const educationSchema = mongoose.Schema({
  id: String,
  institution: String,
  degree: String,
  field: String,
  startDate: String,
  endDate: String,
  location: String,
  gpa: String,
  achievements: [String]
});

const projectSchema = mongoose.Schema({
  id: String,
  name: String,
  tools: [String],
  date: String,
  description: [String], 
  link: String
});

// New Skills Schema: Flexible Lines
const skillLineSchema = mongoose.Schema({
  heading: String, // Optional: "Languages", "Frameworks", or empty
  items: [String]  // ["Java", "Python"]
});

const formattingSchema = mongoose.Schema({
  fontFamily: { type: String, default: 'Inter' },
  fontSize: { type: String, default: 'medium' },
  lineHeight: { type: Number, default: 1.5 },
  sectionSpacing: { type: Number, default: 24 },
  itemSpacing: { type: Number, default: 12 },
  sectionOrder: { 
    type: [String], 
    default: ['summary', 'experience', 'education', 'skills', 'projects'] 
  },
  margins: { type: Number, default: 32 },
  paperSize: { type: String, default: 'a4' }
});

const resumeSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled Resume' },
  template: { 
    type: String, 
    enum: ['classic', 'modern', 'minimal', 'minimal-image', 'tech-focused'], 
    default: 'classic' 
  },
  accentColor: { type: String, default: '#10b981' },
  
  personalInfo: {
    fullName: { type: String, default: '' },
    profession: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    image: { type: String, default: '' },
    links: [linkSchema],
    showIcons: { type: Boolean, default: true }
  },
  
  professionalSummary: { type: String, default: '' },
  
  experience: [experienceSchema],
  education: [educationSchema],
  projects: [projectSchema],
  
  // Replaced previous skills with unified structure
  skills: [skillLineSchema],
  
  formatting: { type: formattingSchema, default: () => ({}) },
  
  public: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
```

---

## 📄 7. `authController.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\controllers\authController.js`

```javascript
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

```

---

## 📄 8. `resumeController.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\controllers\resumeController.js`

```javascript
import Resume from '../models/Resume.js';
import imagekit from '../config/imagekit.js';

export const createResume = async (req, res) => {
  try {
    const { title } = req.body;
    const resume = new Resume({
      userId: req.userId,
      title: title || 'Untitled Resume',
      personalInfo: {
        fullName: req.user.name,
        email: req.user.email
      }
    });

    const createdResume = await resume.save();
    res.status(201).json(createdResume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).select('-__v');
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (resume) {
      res.json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (resume && resume.public) {
      res.json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found or private' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    let { resumeData, removeBackground } = req.body;
    
    // Parse resumeData if it comes as a string (FormData case)
    if (typeof resumeData === 'string') {
      try {
        resumeData = JSON.parse(resumeData);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid resume data format' });
      }
    }

    // Clean data: remove _id and userId to prevent immutable field errors
    delete resumeData._id;
    delete resumeData.userId;
    delete resumeData.createdAt;
    delete resumeData.updatedAt;

    // Handle Image Upload if file exists
    if (req.file) {
      const transformation = removeBackground === 'true' 
        ? { pre: 'w-400,h-400,fo-face,z-2,bg-remove' }
        : { pre: 'w-400,h-400,fo-face,z-2' };

      try {
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: `resume-${Date.now()}-${req.file.originalname}`,
          folder: '/resumes',
          transformation
        });

        // Update image URL in personalInfo
        if (!resumeData.personalInfo) resumeData.personalInfo = {};
        resumeData.personalInfo.image = uploadResponse.url;
      } catch (uploadError) {
        console.error('ImageKit Upload Error:', uploadError);
      }
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: req.body.resumeId || req.params.id, userId: req.userId }, 
      { $set: resumeData },
      { new: true, runValidators: true } // Added runValidators
    );

    if (updatedResume) {
      res.json({ message: 'Resume updated successfully', resume: updatedResume });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (resume) {
      res.json({ message: 'Resume removed' });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## 📄 9. `aiController.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\controllers\aiController.js`

```javascript
import ai from '../config/ai.js';
import parsePDF from '../utils/pdfParser.cjs';

const cleanJson = (text) => {
  if (!text) return '{}';
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const enhanceProfessionalSummary = async (req, res) => {
  const { currentSummary } = req.body;
  if (!currentSummary) return res.status(400).json({ message: 'Content is required' });

  try {
    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-1.5-flash",
      messages: [
        { role: "system", content: "You are an expert resume consultant. Rewrite the following professional summary to be more impactful, concise, and ATS-friendly. Return plain text." },
        { role: "user", content: currentSummary }
      ],
    });

    res.json({ enhancedContent: completion.choices[0].message.content });
  } catch (error) {
    console.error('Summary Enhance Error:', error);
    res.status(500).json({ message: 'AI Enhancement failed' });
  }
};

export const enhanceJobDescription = async (req, res) => {
  const { description, role, company } = req.body;
  const inputDesc = Array.isArray(description) ? description.join('\n') : description;
  
  if (!inputDesc) return res.status(400).json({ message: 'Description is required' });

  try {
    const prompt = `Rewrite the following job description for the role of ${role} at ${company}. 
    Focus on achievements and metrics. 
    Return the result as a JSON array of strings, where each string is a bullet point. 
    Example: ["Increased sales by 20%", "Managed team of 5"]`;

    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-1.5-flash",
      messages: [
        { role: "system", content: "You are an expert resume writer. Output ONLY JSON." },
        { role: "user", content: `${prompt}\n\n${inputDesc}` }
      ],
    });

    const enhancedContent = JSON.parse(cleanJson(completion.choices[0].message.content));
    res.json({ enhancedContent });
  } catch (error) {
    console.error('Job Enhance Error:', error);
    res.status(500).json({ message: 'AI Enhancement failed' });
  }
};

export const analyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    let resumeText = '';

    // Handle PDF Upload
    if (req.file) {
      console.log('Processing PDF file:', req.file.originalname, 'Size:', req.file.size);
      try {
        // Use the CJS utility
        const pdfData = await parsePDF(req.file.buffer);
        resumeText = pdfData.text;
        console.log('PDF Text Extracted, length:', resumeText.length);
      } catch (parseError) {
        console.error('PDF Parse Error:', parseError);
        return res.status(500).json({ message: 'Failed to read PDF file: ' + parseError.message });
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
      console.log('Using provided resume text, length:', resumeText.length);
    } else {
      return res.status(400).json({ message: 'Resume file (PDF) or text is required' });
    }

    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    // Limit text length to avoid token limits
    const truncatedResume = resumeText.slice(0, 15000); 
    const truncatedJob = jobDescription.slice(0, 5000);

    const systemPrompt = `You are an advanced ATS (Applicant Tracking System) simulator.
    Analyze the provided RESUME against the JOB DESCRIPTION.
    
    Return a detailed JSON object with this structure:
    {
      "score": <number 0-100>,
      "summary": "<string>",
      "categories": {
        "tone_style": { "score": <number>, "feedback": ["string"] },
        "content": { "score": <number>, "feedback": ["string"] },
        "structure": { "score": <number>, "feedback": ["string"] },
        "skills": { "score": <number>, "feedback": ["string"] }
      },
      "keywords": {
        "missing": ["string"],
        "present": ["string"]
      },
      "improvements": ["string"]
    }`;

    console.log('Sending to Gemini...');
    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gemini-1.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `JOB DESCRIPTION:\n${truncatedJob}\n\nRESUME TEXT:\n${truncatedResume}` }
      ],
    });

    const responseContent = completion.choices[0].message.content;
    console.log('Gemini Response received');
    
    const analysis = JSON.parse(cleanJson(responseContent));
    res.json(analysis);

  } catch (error) {
    console.error('Analysis Error:', error);
    const msg = error.response ? JSON.stringify(error.response.data) : error.message;
    res.status(500).json({ message: 'Analysis failed: ' + msg });
  }
};
```

---

## 📄 10. `authRoutes.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\routes\authRoutes.js`

```javascript
import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;

```

---

## 📄 11. `resumeRoutes.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\routes\resumeRoutes.js`

```javascript
import express from 'express';
import {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  getPublicResumeById
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/create', protect, createResume);
router.get('/', protect, getUserResumes); // Get all for user
router.get('/:id', protect, getResumeById);
router.get('/public/:id', getPublicResumeById);
router.put('/update', protect, upload.single('image'), updateResume);
router.delete('/:id', protect, deleteResume);

export default router;

```

---

## 📄 12. `aiRoutes.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\routes\aiRoutes.js`

```javascript
import express from 'express';
import {
  enhanceProfessionalSummary,
  enhanceJobDescription,
  analyzeResume
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/enhance-summary', protect, enhanceProfessionalSummary);
router.post('/enhance-job-description', protect, enhanceJobDescription);
router.post('/analyze', protect, upload.single('resume'), analyzeResume); // Added upload middleware

export default router;
```

---

## 📄 13. `authMiddleware.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\middleware\authMiddleware.js`

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');
      req.userId = decoded.userId;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };

```

---

## 📄 14. `upload.js`

**📍 Location:** `D:\codes\AI_Resume_Project\server\middleware\upload.js`

```javascript
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter
});

export default upload;

```

---

## 📄 15. `pdfParser.cjs`

**📍 Location:** `D:\codes\AI_Resume_Project\server\utils\pdfParser.cjs`

```javascript
const pdf = require('pdf-parse');

async function parsePDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data;
  } catch (error) {
    throw new Error('PDF Parsing failed: ' + error.message);
  }
}

module.exports = parsePDF;

```

---

## 📄 16. `main.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
```

---

## 📄 17. `App.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\App.tsx`

```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { Analyzer } from './pages/Analyzer';
import { Layout } from './components/layout/Layout';

// Simple Home Page
const Home = () => (
  <Layout>
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Build your professional resume in minutes
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          AI-powered resume builder that helps you land your dream job. 
          ATS-friendly templates, real-time preview, and smart suggestions.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a href="/register" className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
            Get started
          </a>
          <a href="/login" className="text-sm font-semibold leading-6 text-gray-900">
            Log in <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </Layout>
);

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/builder/:id" 
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analyzer" 
          element={
            <ProtectedRoute>
              <Analyzer />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

```

---

## 📄 18. `index.ts`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\types\index.ts`

```typescript
export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface Link {
  name: string;
  url: string;
}

export interface Experience {
  _id?: string;
  id: string;
  company: string;
  position: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  isCurrent: boolean;
  description: string[];
  achievements: string[];
}

export interface Education {
  _id?: string;
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa: string;
  achievements: string[];
}

export interface Project {
  _id?: string;
  id: string;
  name: string;
  tools: string[];
  date: string;
  description: string[];
  link: string;
}

export interface PersonalInfo {
  fullName: string;
  profession: string;
  email: string;
  phone: string;
  location: string;
  image: string;
  links: Link[];
  showIcons: boolean;
}

export interface SkillLine {
  heading: string;
  items: string[];
}

export interface Formatting {
  fontFamily: string;
  fontSize: string;
  lineHeight: number;
  sectionSpacing: number;
  itemSpacing: number;
  sectionOrder: string[];
  margins: number;
  paperSize: 'a4' | 'letter';
}

export interface Resume {
  _id?: string;
  userId?: string;
  title: string;
  template: 'classic' | 'modern' | 'minimal' | 'minimal-image' | 'tech-focused';
  accentColor: string;
  personalInfo: PersonalInfo;
  professionalSummary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillLine[];
  formatting: Formatting;
  public: boolean;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}
```

---

## 📄 19. `axios.ts`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\lib\axios.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this in production
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

```

---

## 📄 20. `index.ts`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\store\index.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import resumeReducer from './slices/resumeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

```

---

## 📄 21. `authSlice.ts`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\store\slices\authSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import api from '../../lib/axios';

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    loadUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, loadUser } = authSlice.actions;
export default authSlice.reducer;

```

---

## 📄 22. `resumeSlice.ts`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\store\slices\resumeSlice.ts`

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ResumeState, Resume } from '../../types';
import api from '../../lib/axios';

export const fetchResumes = createAsyncThunk('resume/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/resumes');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const fetchResumeById = createAsyncThunk('resume/fetchOne', async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const createResume = createAsyncThunk('resume/create', async (title: string, { rejectWithValue }) => {
  try {
    const response = await api.post('/resumes/create', { title });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const updateResume = createAsyncThunk('resume/update', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await api.put('/resumes/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.resume;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const deleteResume = createAsyncThunk('resume/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/resumes/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const initialState: ResumeState = {
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,
  isSaving: false,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updateCurrentResumeLocal: (state, action: PayloadAction<Partial<Resume>>) => {
      if (state.currentResume) {
        state.currentResume = { ...state.currentResume, ...action.payload };
      }
    },
    clearCurrentResume: (state) => {
        state.currentResume = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchResumes.pending, (state) => { state.isLoading = true; })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch One
      .addCase(fetchResumeById.pending, (state) => { state.isLoading = true; })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResume = action.payload;
      })
      // Update
      .addCase(updateResume.pending, (state) => { state.isSaving = true; })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentResume = action.payload;
        // Update in list as well
        const index = state.resumes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.resumes[index] = action.payload;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createResume.fulfilled, (state, action) => {
        state.resumes.push(action.payload);
      })
      // Delete
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter(r => r._id !== action.payload);
      });
  },
});

export const { updateCurrentResumeLocal, clearCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;

```

---

## 📄 23. `Dashboard.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\pages\Dashboard.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchResumes, createResume, deleteResume } from '../store/slices/resumeSlice';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Plus, Trash2, FileText, Edit, MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { resumes, isLoading } = useSelector((state: RootState) => state.resume);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleCreate = async () => {
    if (!newResumeTitle.trim()) return;
    const result = await dispatch(createResume(newResumeTitle));
    if (createResume.fulfilled.match(result)) {
      setIsModalOpen(false);
      setNewResumeTitle('');
      navigate(`/builder/${result.payload._id}`);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link click
    if (confirm('Are you sure you want to delete this resume?')) {
      dispatch(deleteResume(id));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Create New Resume
          </Button>
        </div>

        {isLoading && resumes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Link
                to={`/builder/${resume._id}`}
                key={resume._id}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden flex flex-col h-64"
              >
                {/* Preview Placeholder */}
                <div className="flex-1 bg-gray-50 flex items-center justify-center border-b border-gray-100 group-hover:bg-gray-100 transition-colors">
                  <FileText size={48} className="text-gray-300 group-hover:text-primary-400 transition-colors" />
                </div>
                
                {/* Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Updated {format(new Date(resume.updatedAt || Date.now()), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(resume._id!, e)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Empty State / Create New Card */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-64 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50/50 transition-all gap-2"
            >
              <Plus size={32} />
              <span className="font-medium">Create New Resume</span>
            </button>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Resume"
        >
          <div className="space-y-4">
            <Input
              label="Resume Title"
              placeholder="e.g. Software Engineer 2026"
              value={newResumeTitle}
              onChange={(e) => setNewResumeTitle(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newResumeTitle.trim()}>Create</Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

```

---

## 📄 24. `ResumeBuilder.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\pages\ResumeBuilder.tsx`

```tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchResumeById, updateResume, updateCurrentResumeLocal } from '../store/slices/resumeSlice';
import { SectionSidebar } from '../components/builder/SectionSidebar';
import { TemplateRenderer } from '../components/resume-templates/TemplateRenderer';
import { PersonalInfoForm } from '../components/builder/sections/PersonalInfo';
import { SummaryForm } from '../components/builder/sections/Summary';
import { ExperienceForm } from '../components/builder/sections/Experience';
import { EducationForm } from '../components/builder/sections/Education';
import { ProjectsForm } from '../components/builder/sections/Projects';
import { SkillsForm } from '../components/builder/sections/Skills';
import { FormattingForm } from '../components/builder/sections/Formatting';
import { Button } from '../components/ui/Button';
import { Save, Download, Eye, Palette, LayoutTemplate } from 'lucide-react';
import { Resume } from '../types';
import toast from 'react-hot-toast';
import { Modal } from '../components/ui/Modal';

export const ResumeBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentResume, isLoading, isSaving } = useSelector((state: RootState) => state.resume);
  const [activeSection, setActiveSection] = useState('personal');
  const [scale, setScale] = useState(0.8);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  
  const [localResume, setLocalResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchResumeById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentResume) {
      setLocalResume(currentResume);
    }
  }, [currentResume]);

  const handleSave = async () => {
    if (!localResume || !id) return;
    
    const cleanResume = {
        ...localResume,
        skills: Array.isArray(localResume.skills) ? localResume.skills : [],
        experience: Array.isArray(localResume.experience) ? localResume.experience : [],
        projects: Array.isArray(localResume.projects) ? localResume.projects : [],
        education: Array.isArray(localResume.education) ? localResume.education : []
    };

    const formData = new FormData();
    formData.append('resumeId', id);
    formData.append('resumeData', JSON.stringify(cleanResume));
    
    const result = await dispatch(updateResume(formData));
    if (updateResume.fulfilled.match(result)) {
      toast.success('Resume saved successfully');
    } else {
      toast.error('Failed to save resume');
    }
  };

  const handleLocalUpdate = (newData: Partial<Resume>) => {
    if (localResume) {
      const updated = { ...localResume, ...newData };
      setLocalResume(updated);
      dispatch(updateCurrentResumeLocal(updated));
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!localResume || !id) return;
    const formData = new FormData();
    formData.append('resumeId', id);
    formData.append('resumeData', JSON.stringify(localResume));
    formData.append('image', file);
    formData.append('removeBackground', 'true');

    const promise = dispatch(updateResume(formData));
    toast.promise(promise, {
      loading: 'Uploading and processing image...',
      success: 'Image updated!',
      error: 'Failed to upload image'
    });
  };

  const handleDownload = () => {
    window.print();
  };

  if (isLoading && !localResume) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!localResume) return <div>Resume not found</div>;

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm 
          data={localResume.personalInfo} 
          onChange={(data) => handleLocalUpdate({ personalInfo: { ...localResume.personalInfo, ...data } })} 
          onImageUpload={handleImageUpload}
        />;
      case 'summary':
        return <SummaryForm 
          value={localResume.professionalSummary} 
          onChange={(val) => handleLocalUpdate({ professionalSummary: val })} 
        />;
      case 'experience':
        return <ExperienceForm 
          items={localResume.experience} 
          onChange={(items) => handleLocalUpdate({ experience: items })} 
        />;
      case 'education':
        return <EducationForm 
          items={localResume.education} 
          onChange={(items) => handleLocalUpdate({ education: items })} 
        />;
      case 'projects':
        return <ProjectsForm 
          items={localResume.projects} 
          onChange={(items) => handleLocalUpdate({ projects: items })} 
        />;
      case 'skills':
        return <SkillsForm 
          skills={localResume.skills || []} 
          onChange={(skills) => handleLocalUpdate({ skills })} 
        />;
      case 'formatting':
        return <FormattingForm 
          data={localResume} 
          onChange={handleLocalUpdate}
          onFormattingChange={(fmt) => handleLocalUpdate({ formatting: { ...localResume.formatting, ...fmt } })}
        />;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden builder-layout">
      {/* Top Toolbar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 toolbar">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>&larr; Dashboard</Button>
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <h1 className="font-bold text-gray-700 truncate max-w-[200px]">{localResume.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4 border-r pr-4 border-gray-200">
             <button 
               onClick={() => setIsTemplateModalOpen(true)}
               className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50"
             >
               <LayoutTemplate size={18} /> Template
             </button>
             <button 
               onClick={() => setActiveSection('formatting')}
               className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50"
             >
               <Palette size={18} /> Design
             </button>
          </div>

          <Button variant="outline" onClick={() => handleLocalUpdate({ public: !localResume.public })}>
             {localResume.public ? <Eye size={18} className="mr-2 text-green-500" /> : <Eye size={18} className="mr-2 text-gray-400" />}
             {localResume.public ? 'Public' : 'Private'}
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download size={18} className="mr-2" /> PDF
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save size={18} className="mr-2" /> Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden main-content">
        {/* Left Sidebar */}
        <div className="sidebar-container">
           <SectionSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </div>

        {/* Middle - Form Area */}
        <div className="w-[600px] flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto p-8 shadow-inner z-10 custom-scrollbar form-panel">
          {renderSection()}
        </div>

        {/* Right - Preview Area */}
        <div className="flex-1 bg-gray-100 overflow-hidden relative flex flex-col items-center justify-center p-8 preview-area">
           {/* Zoom Controls */}
           <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1 zoom-controls">
              <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1.5 hover:bg-gray-100 rounded text-gray-600">-</button>
              <span className="text-xs font-medium w-8 flex items-center justify-center text-gray-600">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(s => Math.min(1.5, s + 0.1))} className="p-1.5 hover:bg-gray-100 rounded text-gray-600">+</button>
           </div>
           
           <div className="overflow-auto w-full h-full flex items-start justify-center custom-scrollbar">
              <TemplateRenderer data={localResume} scale={scale} />
           </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} title="Choose Template">
         <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'classic', name: 'Classic Sidebar', desc: 'Professional & Visual' },
              { id: 'modern', name: 'Modern', desc: 'Clean Single Column' },
              { id: 'minimal', name: 'Minimal', desc: 'ATS Optimized' }
            ].map(t => (
               <button 
                 key={t.id}
                 onClick={() => { handleLocalUpdate({ template: t.id as any }); setIsTemplateModalOpen(false); }}
                 className={`p-4 rounded-xl border-2 text-left transition-all ${localResume.template === t.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
               >
                  <div className="font-bold capitalize mb-1">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.desc}</div>
               </button>
            ))}
         </div>
      </Modal>

      {/* Print Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        @media print {
          @page { margin: 0; size: auto; }
          html, body {
            margin: 0;
            padding: 0;
            background: white;
            width: 100%;
            height: 100%;
            overflow: visible;
          }
          
          /* Hide UI Elements */
          .toolbar, .sidebar-container, .form-panel, .zoom-controls, .builder-layout > div:not(.main-content) {
            display: none !important;
          }
          
          /* Reset Layout */
          .builder-layout, .main-content, .preview-area {
            display: block !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Force Resume Page to be normal */
          .resume-preview-wrapper {
            transform: none !important; /* Reset scale */
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }

          .resume-page {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            /* Ensure page breaks if needed */
            break-inside: auto;
          }
        }
      `}</style>
    </div>
  );
};

```

---

## 📄 25. `Analyzer.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\pages\Analyzer.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Upload, FileText, Search, ChevronDown } from 'lucide-react';
import api from '../lib/axios';
import { AnalysisResult, AnalysisData } from '../components/analyzer/AnalysisResult';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchResumes } from '../store/slices/resumeSlice';
import { Resume } from '../types';

export const Analyzer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { resumes } = useSelector((state: RootState) => state.resume);
  
  const [file, setFile] = useState<File | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setSelectedResumeId(''); // Clear selection
    }
  };

  const resumeToString = (r: Resume) => {
    return `
      Name: ${r.personalInfo.fullName}
      Role: ${r.personalInfo.profession}
      Summary: ${r.professionalSummary}
      
      Experience:
      ${r.experience.map(e => `${e.position} at ${e.company} (${e.startDate.year}-${e.endDate.year}). ${e.description.join('. ')}`).join('\n')}
      
      Education:
      ${r.education.map(e => `${e.degree} in ${e.field} at ${e.institution}`).join('\n')}
      
      Projects:
      ${r.projects.map(p => `${p.name}: ${p.description.join('. ')}`).join('\n')}
      
      Skills:
      ${r.skills.map(s => `${s.heading ? s.heading + ': ' : ''}${s.items.join(', ')}`).join('\n')}
    `;
  };

  const handleAnalyze = async () => {
    if ((!file && !selectedResumeId) || !jobDescription.trim()) {
      toast.error('Please provide a resume (upload or select) and a job description.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let payload: any;
      let headers = {};

      if (file) {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);
        payload = formData;
        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        const selectedResume = resumes.find(r => r._id === selectedResumeId);
        if (!selectedResume) throw new Error('Selected resume not found');
        
        payload = {
          resumeText: resumeToString(selectedResume),
          jobDescription
        };
        headers = { 'Content-Type': 'application/json' };
      }

      const response = await api.post('/ai/analyze', payload, { headers });
      setResult(response.data);
      toast.success('Analysis complete!');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Analysis failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ATS Resume Analyzer</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check your resume score against a job description.
            </p>
          </div>

          {!result ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Left: Input */}
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                      <h2 className="text-xl font-bold">Provide Resume</h2>
                    </div>

                    {/* Option A: Upload */}
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors relative ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {file ? (
                        <div className="flex flex-col items-center text-green-700">
                          <FileText size={32} className="mb-2" />
                          <p className="font-medium truncate max-w-full">{file.name}</p>
                          <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="text-xs underline mt-2">Remove</button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <Upload size={32} className="mb-2" />
                          <p className="font-medium">Upload PDF</p>
                        </div>
                      )}
                    </div>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                      <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div>
                    </div>

                    {/* Option B: Select */}
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Select from Dashboard</label>
                       <div className="relative">
                         <select
                           value={selectedResumeId}
                           onChange={(e) => { setSelectedResumeId(e.target.value); setFile(null); }}
                           className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           disabled={!!file}
                         >
                           <option value="">-- Choose a Resume --</option>
                           {resumes.map(r => (
                             <option key={r._id} value={r._id}>{r.title}</option>
                           ))}
                         </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                           <ChevronDown size={16} />
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Right: Job Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                    <h2 className="text-xl font-bold">Job Description</h2>
                  </div>
                  
                  <textarea 
                    className="w-full h-80 rounded-xl border border-gray-300 bg-gray-50 p-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none shadow-inner"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button 
                  size="lg" 
                  onClick={handleAnalyze} 
                  isLoading={isAnalyzing}
                  disabled={(!file && !selectedResumeId) || !jobDescription}
                  className="px-8 shadow-lg shadow-primary-200"
                >
                  <Search size={20} className="mr-2" />
                  Analyze Resume
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex justify-start">
                 <Button variant="outline" onClick={() => setResult(null)}>
                   &larr; Analyze Another
                 </Button>
               </div>
               <AnalysisResult data={result} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
```

---

## 📄 26. `SectionSidebar.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\builder\SectionSidebar.tsx`

```tsx
import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code, FolderGit2, Award, FileText, Palette, MonitorCheck } from 'lucide-react';
import { cn } from '../ui/Button';

interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', icon: Code },
];

export const SectionSidebar: React.FC<Props> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Content</h2>
        <div className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg",
                activeSection === section.id 
                  ? "bg-primary-50 text-primary-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <section.icon size={18} />
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customize</h2>
        <div className="space-y-1">
          <button
            onClick={() => onSectionChange('formatting')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg",
              activeSection === 'formatting' 
                ? "bg-purple-50 text-purple-700" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Palette size={18} />
            Design & Formatting
          </button>
          <button
             onClick={() => window.open('/analyzer', '_blank')}
             className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
          >
             <MonitorCheck size={18} />
             ATS Check
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## 📄 27. `PersonalInfo.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\builder\sections\PersonalInfo.tsx`

```tsx
import React from 'react';
import { Resume } from '../../../types';
import { Input } from '../../ui/Input';
import { Upload, X } from 'lucide-react';
import { DynamicLinks } from '../../ui/DynamicLinks';

interface Props {
  data: Resume['personalInfo'];
  onChange: (data: Partial<Resume['personalInfo']>) => void;
  onImageUpload: (file: File) => void;
}

export const PersonalInfoForm: React.FC<Props> = ({ data, onChange, onImageUpload }) => {
  const handleChange = (field: keyof Resume['personalInfo'], value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold">Personal Information</h2>
      </div>
      
      {/* Image Upload */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shadow-sm">
            {data.image ? (
               <img src={data.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <Upload className="text-gray-300" size={32} />
            )}
          </div>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            accept="image/*"
            onChange={handleFileChange}
          />
          {data.image && (
             <button 
               onClick={() => handleChange('image', '')}
               className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 z-20 shadow-md hover:bg-red-600"
             >
               <X size={12} />
             </button>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Profile Photo</p>
          <p className="text-sm text-gray-500 mb-2">Recommended: Square JPG/PNG, max 2MB.</p>
          <div className="flex gap-2">
            <label className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm">
               Upload New
               <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Full Name" 
          value={data.fullName} 
          onChange={(e) => handleChange('fullName', e.target.value)} 
          placeholder="John Doe"
        />
        <Input 
          label="Job Title / Profession" 
          value={data.profession} 
          onChange={(e) => handleChange('profession', e.target.value)} 
          placeholder="Software Engineer"
        />
        <Input 
          label="Email" 
          value={data.email} 
          onChange={(e) => handleChange('email', e.target.value)} 
          placeholder="john@example.com"
        />
        <Input 
          label="Phone" 
          value={data.phone} 
          onChange={(e) => handleChange('phone', e.target.value)} 
          placeholder="+1 (555) 000-0000"
        />
        <div className="md:col-span-2">
           <Input 
             label="Location" 
             value={data.location} 
             onChange={(e) => handleChange('location', e.target.value)} 
             placeholder="New York, NY"
           />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Dynamic Links */}
      <DynamicLinks 
        links={data.links || []} 
        onChange={(links) => handleChange('links', links)} 
      />
    </div>
  );
};
```

---

## 📄 28. `Summary.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Summary.tsx`

```tsx
import React, { useState } from 'react';
import { Resume } from '../../../types';
import { Button } from '../../ui/Button';
import { Sparkles } from 'lucide-react';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SummaryForm: React.FC<Props> = ({ value, onChange }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!value.trim()) {
      toast.error('Please write something first for AI to enhance.');
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await api.post('/ai/enhance-summary', { currentSummary: value });
      onChange(response.data.enhancedContent);
      toast.success('Summary enhanced!');
    } catch (error) {
      toast.error('Failed to enhance summary.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Professional Summary</h2>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleEnhance} 
          isLoading={isEnhancing}
          className="text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200"
        >
          <Sparkles size={16} className="mr-2" />
          AI Enhance
        </Button>
      </div>
      
      <textarea
        className="w-full h-48 rounded-lg border border-gray-300 p-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
        placeholder="Briefly describe your professional background and key achievements..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-gray-500 text-right">{value.length} characters</p>
    </div>
  );
};

```

---

## 📄 29. `Experience.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Experience.tsx`

```tsx
import React, { useState } from 'react';
import { Experience } from '../../../types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { BulletListEditor } from '../../ui/BulletListEditor';

interface Props {
  items: Experience[];
  onChange: (items: Experience[]) => void;
}

export const ExperienceForm: React.FC<Props> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  // Ensure items is an array
  const safeItems = Array.isArray(items) ? items : [];

  const handleAdd = () => {
    const newExp: Experience = {
      id: uuidv4(),
      company: '',
      position: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      isCurrent: false,
      description: [], // Bullets
      achievements: []
    };
    onChange([newExp, ...safeItems]);
    setExpandedId(newExp.id);
  };

  const handleUpdate = (id: string, field: keyof Experience, value: any) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDateUpdate = (id: string, type: 'start' | 'end', field: 'month' | 'year', value: string) => {
    onChange(safeItems.map(item => {
      if (item.id !== id) return item;
      const dateKey = type === 'start' ? 'startDate' : 'endDate';
      return { ...item, [dateKey]: { ...item[dateKey], [field]: value } };
    }));
  };

  const handleRemove = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  const handleEnhance = async (exp: Experience) => {
    if (!exp.position || !exp.company) {
        toast.error('Please fill Position and Company first.');
        return;
    }
    setEnhancingId(exp.id);
    try {
      const response = await api.post('/ai/enhance-job-description', {
        description: exp.description,
        role: exp.position,
        company: exp.company
      });
      // AI now returns array of strings
      handleUpdate(exp.id, 'description', response.data.enhancedContent);
      toast.success('Description enhanced with bullets!');
    } catch (error) {
      toast.error('Failed to enhance description.');
    } finally {
      setEnhancingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Work Experience</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus size={16} className="mr-2" /> Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {safeItems.map((exp) => (
          <div key={exp.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div 
              className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            >
              <div>
                <h3 className="font-semibold text-gray-900">{exp.position || '(No Position)'}</h3>
                <p className="text-sm text-gray-500">{exp.company || '(No Company)'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemove(exp.id); }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                {expandedId === exp.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>
            </div>

            {expandedId === exp.id && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Position / Job Title" 
                    value={exp.position} 
                    onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)}
                  />
                  <Input 
                    label="Company Name" 
                    value={exp.company} 
                    onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                     <div className="flex gap-2">
                       <Input placeholder="Month" value={exp.startDate.month} onChange={(e) => handleDateUpdate(exp.id, 'start', 'month', e.target.value)} />
                       <Input placeholder="Year" value={exp.startDate.year} onChange={(e) => handleDateUpdate(exp.id, 'start', 'year', e.target.value)} />
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                     <div className="flex gap-2">
                       <Input 
                         placeholder="Month" 
                         value={exp.endDate.month} 
                         onChange={(e) => handleDateUpdate(exp.id, 'end', 'month', e.target.value)}
                         disabled={exp.isCurrent}
                       />
                       <Input 
                         placeholder="Year" 
                         value={exp.endDate.year} 
                         onChange={(e) => handleDateUpdate(exp.id, 'end', 'year', e.target.value)}
                         disabled={exp.isCurrent}
                       />
                     </div>
                     <label className="flex items-center gap-2 mt-2 text-sm text-gray-600 cursor-pointer select-none">
                       <input 
                         type="checkbox" 
                         checked={exp.isCurrent} 
                         onChange={(e) => handleUpdate(exp.id, 'isCurrent', e.target.checked)}
                         className="rounded text-primary-600 focus:ring-primary-500"
                       />
                       I currently work here
                     </label>
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Description (Bullet Points)</label>
                      <button 
                        onClick={() => handleEnhance(exp)}
                        disabled={enhancingId === exp.id}
                        className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium px-2 py-1 bg-purple-50 rounded-md transition-colors"
                      >
                         <Sparkles size={12} />
                         {enhancingId === exp.id ? 'Enhancing...' : 'Enhance with AI'}
                      </button>
                   </div>
                   <BulletListEditor 
                      items={exp.description || []}
                      onChange={(bullets) => handleUpdate(exp.id, 'description', bullets)}
                      placeholder="Add an achievement or responsibility..."
                   />
                </div>
              </div>
            )}
          </div>
        ))}
        {safeItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            No experience added yet.
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 📄 30. `Education.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Education.tsx`

```tsx
import React, { useState } from 'react';
import { Education } from '../../../types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { BulletListEditor } from '../../ui/BulletListEditor';

interface Props {
  items: Education[];
  onChange: (items: Education[]) => void;
}

export const EducationForm: React.FC<Props> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const safeItems = Array.isArray(items) ? items : [];

  const handleAdd = () => {
    const newEdu: Education = {
      id: uuidv4(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      location: '',
      gpa: '',
      achievements: []
    };
    onChange([newEdu, ...safeItems]);
    setExpandedId(newEdu.id);
  };

  const handleUpdate = (id: string, field: keyof Education, value: any) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemove = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Education</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus size={16} className="mr-2" /> Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {safeItems.map((edu) => (
          <div key={edu.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div 
              className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
            >
              <div>
                <h3 className="font-semibold text-gray-900">{edu.institution || '(No Institution)'}</h3>
                <p className="text-sm text-gray-500">{edu.degree || '(No Degree)'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemove(edu.id); }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                {expandedId === edu.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>
            </div>

            {expandedId === edu.id && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <Input 
                  label="Institution / School" 
                  value={edu.institution} 
                  onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                />
                <Input 
                  label="Location" 
                  value={edu.location} 
                  onChange={(e) => handleUpdate(edu.id, 'location', e.target.value)}
                  placeholder="City, State"
                />
                <div className="grid grid-cols-2 gap-4">
                   <Input 
                     label="Degree" 
                     value={edu.degree} 
                     onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                     placeholder="Bachelor of Science"
                   />
                   <Input 
                     label="Field of Study" 
                     value={edu.field} 
                     onChange={(e) => handleUpdate(edu.id, 'field', e.target.value)}
                     placeholder="Computer Science"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <Input 
                     label="Start Year" 
                     value={edu.startDate} 
                     onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                     placeholder="2020"
                   />
                   <Input 
                     label="End Year" 
                     value={edu.endDate} 
                     onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                     placeholder="2024"
                   />
                </div>
                <Input 
                   label="GPA (Optional)" 
                   value={edu.gpa} 
                   onChange={(e) => handleUpdate(edu.id, 'gpa', e.target.value)}
                   placeholder="3.8/4.0"
                />
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Achievements (Bullet Points)</label>
                   <BulletListEditor 
                      items={edu.achievements || []}
                      onChange={(bullets) => handleUpdate(edu.id, 'achievements', bullets)}
                      placeholder="Add an academic achievement..."
                   />
                </div>
              </div>
            )}
          </div>
        ))}
        {safeItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            No education added yet.
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 📄 31. `Projects.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Projects.tsx`

```tsx
import React, { useState } from 'react';
import { Project } from '../../../types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { BulletListEditor } from '../../ui/BulletListEditor';

interface Props {
  items: Project[];
  onChange: (items: Project[]) => void;
}

export const ProjectsForm: React.FC<Props> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const safeItems = Array.isArray(items) ? items : [];

  const handleAdd = () => {
    const newProj: Project = {
      id: uuidv4(),
      name: '',
      tools: [], // Array of strings
      date: '',
      description: [], 
      link: ''
    };
    onChange([newProj, ...safeItems]);
    setExpandedId(newProj.id);
  };

  const handleUpdate = (id: string, field: keyof Project, value: any) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemove = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Projects</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus size={16} className="mr-2" /> Add Project
        </Button>
      </div>

      <div className="space-y-4">
        {safeItems.map((proj) => (
          <div key={proj.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div 
              className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
            >
              <div>
                <h3 className="font-semibold text-gray-900">{proj.name || '(No Name)'}</h3>
                <p className="text-sm text-gray-500">
                  {proj.tools?.length > 0 ? proj.tools.join(', ') : '(No Tools)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemove(proj.id); }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                {expandedId === proj.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>
            </div>

            {expandedId === proj.id && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                 <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Project Name" 
                    value={proj.name} 
                    onChange={(e) => handleUpdate(proj.id, 'name', e.target.value)}
                  />
                  <Input 
                    label="Date (Month Year)" 
                    value={proj.date} 
                    onChange={(e) => handleUpdate(proj.id, 'date', e.target.value)}
                    placeholder="Jan 2024"
                  />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tools Used (Comma separated)</label>
                    <input 
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="React, Node.js, MongoDB"
                      value={proj.tools?.join(', ') || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const toolsArray = val.split(',').map(t => t.trimStart()); // preserve typing flow, trim later or split smart
                        // Actually, splitting on every keystroke makes it hard to type "Node.js" if user pauses? No, standard comma split is fine.
                        // Better: just store string in local component state? No, direct update is requested.
                        // I'll split by comma.
                        handleUpdate(proj.id, 'tools', val.split(',')); 
                      }}
                    />
                 </div>

                 <Input 
                    label="Project Link (Optional)" 
                    value={proj.link} 
                    onChange={(e) => handleUpdate(proj.id, 'link', e.target.value)}
                    placeholder="https://..."
                 />
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Bullet Points)</label>
                    <BulletListEditor 
                      items={proj.description || []}
                      onChange={(bullets) => handleUpdate(proj.id, 'description', bullets)}
                      placeholder="Describe the project features..."
                    />
                 </div>
              </div>
            )}
          </div>
        ))}
         {safeItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            No projects added yet.
          </div>
        )}
      </div>
    </div>
  );
};

```

---

## 📄 32. `Skills.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Skills.tsx`

```tsx
import React, { useState } from 'react';
import { SkillLine } from '../../../types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  skills: SkillLine[];
  onChange: (skills: SkillLine[]) => void;
}

export const SkillsForm: React.FC<Props> = ({ skills, onChange }) => {
  // Ensure skills is always an array
  const safeSkills = Array.isArray(skills) ? skills : [];

  const handleAddLine = () => {
    onChange([...safeSkills, { heading: '', items: [] }]);
  };

  const handleRemoveLine = (index: number) => {
    const newSkills = [...safeSkills];
    newSkills.splice(index, 1);
    onChange(newSkills);
  };

  const handleUpdate = (index: number, field: keyof SkillLine, value: any) => {
    const newSkills = [...safeSkills];
    if (field === 'items') {
      // Split string by comma and trim
      const items = (value as string).split(',').map(s => s.trimStart()); // Preserve space after comma if typing
      // But for storage we might want to trim fully? 
      // User experience: if I type "Java, ", I expect to be able to type "Python".
      // If I trimEnd immediately, I might lose the space. 
      // Storing as array immediately is tricky for "comma separated input".
      // BETTER: Keep items as string[] but the input manages it.
      // Actually, for this specific requirements ("add as many skills... separated using commas"), 
      // a simple text input is best.
      newSkills[index] = { ...newSkills[index], items };
    } else {
      newSkills[index] = { ...newSkills[index], [field]: value };
    }
    onChange(newSkills);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Skills</h2>
        <Button onClick={handleAddLine} size="sm">
          <Plus size={16} className="mr-2" /> Add Skill Line
        </Button>
      </div>

      <div className="space-y-4">
        {safeSkills.map((line, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
            <button 
              onClick={() => handleRemoveLine(index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
            >
              <Trash2 size={16} />
            </button>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Heading (Optional, e.g. "Languages")
                </label>
                <Input 
                  placeholder="No Heading"
                  value={line.heading}
                  onChange={(e) => handleUpdate(index, 'heading', e.target.value)}
                  className="bg-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Skills (Comma separated)
                </label>
                <input 
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                  placeholder="Java, Python, React..."
                  value={line.items.join(', ')}
                  onChange={(e) => handleUpdate(index, 'items', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        {safeSkills.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            No skills added. Click "Add Skill Line" to start.
          </div>
        )}
      </div>
    </div>
  );
};

```

---

## 📄 33. `Formatting.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Formatting.tsx`

```tsx
import React from 'react';
import { Formatting, Resume } from '../../../types';
import { ColorPicker } from '../../ui/ColorPicker';
import { Button } from '../../ui/Button';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckSquare, Square } from 'lucide-react';

interface Props {
  data: Resume;
  onChange: (data: Partial<Resume>) => void;
  onFormattingChange: (formatting: Partial<Formatting>) => void;
}

const SortableItem = ({ id, label }: { id: string, label: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg mb-2 shadow-sm cursor-move hover:border-primary-400 transition-colors">
      <GripVertical size={16} className="text-gray-400" />
      <span className="text-sm font-medium capitalize">{label}</span>
    </div>
  );
};

export const FormattingForm: React.FC<Props> = ({ data, onChange, onFormattingChange }) => {
  const formatting = data.formatting || {};
  const sectionOrder = formatting.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects'];
  const showIcons = data.personalInfo.showIcons !== false;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over?.id as string);
      onFormattingChange({ sectionOrder: arrayMove(sectionOrder, oldIndex, newIndex) });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold">Design & Formatting</h2>

      {/* Visibility Settings */}
      <div className="space-y-3">
         <label className="text-sm font-medium text-gray-700">Visual Elements</label>
         <button 
           onClick={() => onChange({ personalInfo: { ...data.personalInfo, showIcons: !showIcons } })}
           className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 transition-colors w-full p-2 border rounded-lg hover:bg-gray-50"
         >
           {showIcons ? <CheckSquare size={18} className="text-primary-600" /> : <Square size={18} />}
           Show Icons (Headers & Contact)
         </button>
      </div>

      <hr className="border-gray-100" />

      {/* Colors */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Accent Color</label>
        <ColorPicker 
          color={data.accentColor} 
          onChange={(color) => onChange({ accentColor: color })} 
        />
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-4">
         <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Paper Size</label>
            <div className="flex gap-2">
               <button 
                 onClick={() => onFormattingChange({ paperSize: 'a4' })}
                 className={`flex-1 py-2 text-sm border rounded-lg transition-all ${formatting.paperSize === 'a4' ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium' : 'hover:bg-gray-50'}`}
               >
                 A4
               </button>
               <button 
                 onClick={() => onFormattingChange({ paperSize: 'letter' })}
                 className={`flex-1 py-2 text-sm border rounded-lg transition-all ${formatting.paperSize === 'letter' ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium' : 'hover:bg-gray-50'}`}
               >
                 Letter
               </button>
            </div>
         </div>
      </div>

      <hr className="border-gray-100" />

      {/* Typography */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Font Family</label>
          <select 
            className="w-full text-sm border-gray-300 rounded-lg p-2 bg-white"
            value={formatting.fontFamily}
            onChange={(e) => onFormattingChange({ fontFamily: e.target.value })}
          >
            <option value="Inter">Inter (Modern)</option>
            <option value="Merriweather">Merriweather (Serif)</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Font Size</label>
          <select 
            className="w-full text-sm border-gray-300 rounded-lg p-2 bg-white"
            value={formatting.fontSize}
            onChange={(e) => onFormattingChange({ fontSize: e.target.value })}
          >
            <option value="small">Compact</option>
            <option value="medium">Standard</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      {/* Spacing Sliders */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-gray-700">Section Spacing</label>
            <span className="text-gray-500">{formatting.sectionSpacing}px</span>
          </div>
          <input 
            type="range" min="12" max="64" step="4"
            value={formatting.sectionSpacing}
            onChange={(e) => onFormattingChange({ sectionSpacing: parseInt(e.target.value) })}
            className="w-full accent-primary-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-gray-700">Line Spacing</label>
            <span className="text-gray-500">{formatting.lineHeight}</span>
          </div>
          <input 
            type="range" min="1" max="2" step="0.1"
            value={formatting.lineHeight}
            onChange={(e) => onFormattingChange({ lineHeight: parseFloat(e.target.value) })}
            className="w-full accent-primary-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-gray-700">Page Margins</label>
            <span className="text-gray-500">{formatting.margins}px</span>
          </div>
          <input 
            type="range" min="16" max="64" step="4"
            value={formatting.margins}
            onChange={(e) => onFormattingChange({ margins: parseInt(e.target.value) })}
            className="w-full accent-primary-600"
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Section Reordering */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Section Order (Drag to Reorder)</label>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
           <DndContext 
             sensors={sensors} 
             collisionDetection={closestCenter} 
             onDragEnd={handleDragEnd}
           >
             <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
               {sectionOrder.map(section => (
                 <SortableItem key={section} id={section} label={section} />
               ))}
             </SortableContext>
           </DndContext>
        </div>
      </div>
    </div>
  );
};
```

---

## 📄 34. `TemplateRenderer.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\resume-templates\TemplateRenderer.tsx`

```tsx
import React from 'react';
import { Resume } from '../../types';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ClassicTemplate } from './ClassicTemplate';

interface TemplateRendererProps {
  data: Resume;
  scale?: number;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ data, scale = 1 }) => {
  const formatting = data.formatting || {};
  
  const fontFamily = formatting.fontFamily || 'Inter';
  const fontSize = formatting.fontSize === 'small' ? '0.875rem' : formatting.fontSize === 'large' ? '1.125rem' : '1rem';
  const lineHeight = formatting.lineHeight || 1.5;
  const margin = formatting.margins || 32;
  const paperSize = formatting.paperSize || 'a4';

  const width = paperSize === 'a4' ? '210mm' : '215.9mm';
  // Standard heights in mm
  const pageHeightMm = paperSize === 'a4' ? 297 : 279.4;

  const containerStyle: React.CSSProperties = {
    fontFamily: `${fontFamily}, sans-serif`,
    fontSize,
    lineHeight,
    padding: `${margin}px`,
  };

  const renderTemplate = () => {
    switch (data.template) {
      case 'modern':
        return <ModernTemplate data={data} accentColor={data.accentColor} style={containerStyle} />;
      case 'minimal':
        return <MinimalTemplate data={data} accentColor={data.accentColor} style={containerStyle} />;
      case 'classic':
      default:
        return <ClassicTemplate data={data} accentColor={data.accentColor} style={containerStyle} />;
    }
  };

  return (
    <div className="relative shadow-2xl resume-preview-wrapper" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      {/* Resume Content */}
      <div 
        className="bg-white resume-page"
        style={{ 
          width: width, 
          minHeight: `${pageHeightMm}mm`,
          height: 'auto',
          position: 'relative',
          zIndex: 10
        }}
      >
        {renderTemplate()}
      </div>

      {/* Visual Page Break Lines Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 print:hidden"
        style={{ 
          width: width,
          height: '100%' 
        }}
      >
        {/* Render markers for up to 5 pages. In a real app, calculate based on scrollHeight */}
        {[1, 2, 3, 4].map(page => (
          <div 
            key={page}
            className="w-full border-b-2 border-dashed border-red-300 opacity-50 flex items-end justify-end pr-2"
            style={{ 
              position: 'absolute', 
              top: `${page * pageHeightMm}mm`,
              height: '1px' 
            }}
          >
            <span className="text-xs text-red-400 bg-white px-1 mb-[-8px]">Page {page + 1} Start</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 📄 35. `ClassicTemplate.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\resume-templates\ClassicTemplate.tsx`

```tsx
import React from 'react';
import { Resume } from '../../types';

interface TemplateProps {
  data: Resume;
  accentColor?: string;
  style?: React.CSSProperties;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, accentColor = '#2d3748', style }) => {
  const { formatting } = data;
  const sectionSpacing = formatting?.sectionSpacing || 24;
  const itemSpacing = formatting?.itemSpacing || 12;
  const showIcons = data.personalInfo.showIcons !== false; // Default true

  return (
    <div className="w-full h-full min-h-[1100px] flex" style={style}>
      
      {/* Left Sidebar */}
      <aside className="w-[30%] text-white p-6 flex flex-col gap-6" style={{ backgroundColor: accentColor }}>
        <div className="text-center">
          {data.personalInfo.image && (
             <img 
               src={data.personalInfo.image} 
               alt={data.personalInfo.fullName} 
               className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white object-cover"
             />
          )}
          <h1 className="text-xl font-bold mb-1 break-words">{data.personalInfo.fullName}</h1>
          <p className="text-sm opacity-90 break-words">{data.personalInfo.profession}</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="border-b border-white/20 pb-2 mb-2 font-bold uppercase tracking-wider">Contact</div>
          <div className="opacity-90 break-all">{data.personalInfo.email}</div>
          <div className="opacity-90">{data.personalInfo.phone}</div>
          <div className="opacity-90">{data.personalInfo.location}</div>
          
          {/* Dynamic Links */}
          {data.personalInfo.links?.map((link, i) => (
            <div key={i} className="opacity-90">
              {link.name && <span className="font-semibold opacity-75 mr-1">{link.name}:</span>}
              <a href={link.url} target="_blank" rel="noreferrer" className="underline hover:text-white/80 break-all">
                {link.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          ))}
        </div>

        {/* Education (Sidebar) */}
        {data.education.length > 0 && (
           <div className="space-y-3">
            <div className="border-b border-white/20 pb-2 mb-2 font-bold uppercase tracking-wider">Education</div>
            {data.education.map((edu) => (
              <div key={edu.id} className="text-sm">
                <div className="font-bold">{edu.degree}</div>
                <div className="text-xs opacity-90">{edu.institution}</div>
                <div className="text-xs opacity-75">{edu.location}</div>
                <div className="text-xs opacity-75 italic">
                  {edu.startDate} - {edu.endDate}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills (Sidebar) */}
        {data.skills?.length > 0 && (
          <div className="space-y-3">
            <div className="border-b border-white/20 pb-2 mb-2 font-bold uppercase tracking-wider">Skills</div>
            
            {data.skills.map((line, i) => (
              <div key={i}>
                {line.heading && <div className="text-xs font-bold opacity-80 mb-1">{line.heading}</div>}
                <div className="flex flex-wrap gap-2">
                  {line.items.map((skill, j) => (
                    <span key={j} className="bg-white/10 px-2 py-1 rounded text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Right Content */}
      <main className="w-[70%] p-8" style={{ gap: sectionSpacing, display: 'flex', flexDirection: 'column' }}>
        {data.professionalSummary && (
          <div>
             <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-3" style={{ color: accentColor, borderColor: accentColor }}>Profile</h2>
             <p className="text-gray-700 text-sm leading-relaxed text-justify">{data.professionalSummary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4" style={{ color: accentColor, borderColor: accentColor }}>Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-xs text-gray-500 font-medium">
                      {exp.startDate.month} {exp.startDate.year} - {exp.isCurrent ? 'Present' : `${exp.endDate.month} ${exp.endDate.year}`}
                    </span>
                  </div>
                  <div className="font-medium text-sm text-gray-600 mb-2">{exp.company}</div>
                  
                  {Array.isArray(exp.description) && exp.description.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-1">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 leading-relaxed pl-1">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b-2 pb-1 mb-4" style={{ color: accentColor, borderColor: accentColor }}>Projects</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-2 flex-wrap">
                       {proj.link ? (
                         <a href={proj.link} target="_blank" className="font-bold text-gray-900 hover:underline">{proj.name}</a>
                       ) : (
                         <div className="font-bold text-gray-900">{proj.name}</div>
                       )}
                       
                       {proj.tools?.map((tool, t) => (
                         <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium border border-gray-200">
                           {tool}
                         </span>
                       ))}
                     </div>
                     <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{proj.date}</div>
                  </div>
                  
                  {Array.isArray(proj.description) && proj.description.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-1 mt-1">
                      {proj.description.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 leading-relaxed pl-1">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
```

---

## 📄 36. `ModernTemplate.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\resume-templates\ModernTemplate.tsx`

```tsx
import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar, Briefcase, GraduationCap, Award, Code, Link as LinkIcon, FolderGit2 } from 'lucide-react';
import { Resume } from '../../types';

interface TemplateProps {
  data: Resume;
  accentColor?: string;
  style?: React.CSSProperties;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, accentColor = '#10b981', style }) => {
  const { formatting } = data;
  const sectionSpacing = formatting?.sectionSpacing || 24;
  const itemSpacing = formatting?.itemSpacing || 16;
  const showIcons = data.personalInfo.showIcons !== false;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return data.professionalSummary && (
          <section key="summary">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 uppercase tracking-wide" style={{ color: accentColor }}>
              {showIcons && <Award size={18} />} Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm text-justify">{data.professionalSummary}</p>
          </section>
        );
      case 'experience':
        return data.experience.length > 0 && (
          <section key="experience">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: accentColor }}>
              {showIcons && <Briefcase size={18} />} Work Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-sm font-medium" style={{ color: accentColor }}>{exp.company}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-medium">
                      {exp.startDate.month} {exp.startDate.year} - {exp.isCurrent ? 'Present' : `${exp.endDate.month} ${exp.endDate.year}`}
                    </div>
                  </div>
                  
                  {Array.isArray(exp.description) && exp.description.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-1 mt-2">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700 mt-2 mb-2 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return data.education.length > 0 && (
          <section key="education">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: accentColor }}>
              {showIcons && <GraduationCap size={18} />} Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                      <p className="text-sm font-medium" style={{ color: accentColor }}>{edu.institution}, {edu.location}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-medium">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                  {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return data.skills?.length > 0 && (
          <section key="skills">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: accentColor }}>
              {showIcons && <Code size={18} />} Skills
            </h2>
            
            <div className="space-y-3">
              {data.skills.map((line, i) => (
                <div key={i} className="flex items-baseline">
                   {line.heading && <div className="font-bold text-sm text-gray-700 mr-3 whitespace-nowrap">{line.heading}:</div>}
                   <div className="flex flex-wrap gap-2 flex-1">
                     {line.items.map((skill, j) => (
                       <span key={j} className="text-sm text-gray-600 border-b border-gray-200 pb-0.5">{skill}</span>
                     ))}
                   </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'projects':
        return data.projects.length > 0 && (
          <section key="projects">
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: accentColor }}>
               {showIcons && <FolderGit2 size={18} />} Projects
             </h2>
             <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
               {data.projects.map((proj) => (
                 <div key={proj.id}>
                   <div className="flex justify-between items-start mb-1">
                     <div className="flex items-center gap-3 flex-wrap">
                       {proj.link ? (
                         <a href={proj.link} target="_blank" className="font-bold text-gray-900 hover:underline hover:text-blue-600 transition-colors">
                           {proj.name}
                         </a>
                       ) : (
                         <h3 className="font-bold text-gray-900">{proj.name}</h3>
                       )}
                       
                       {proj.tools?.map((tool, t) => (
                         <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] border border-gray-200">
                           {tool}
                         </span>
                       ))}
                     </div>
                     <div className="text-xs text-gray-500 whitespace-nowrap">{proj.date}</div>
                   </div>
                   
                   {Array.isArray(proj.description) && proj.description.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-1">
                      {proj.description.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700 mb-2">{proj.description}</p>
                  )}
                 </div>
               ))}
             </div>
          </section>
        );
      default: return null;
    }
  };

  const sectionOrder = formatting?.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects'];

  return (
    <div className="w-full h-full bg-white p-12 shadow-sm" style={style}>
      {/* Header */}
      <header className="border-b-2 pb-6 mb-8" style={{ borderColor: accentColor }}>
        <div className="flex items-center gap-6">
           {data.personalInfo.image && (
             <img src={data.personalInfo.image} className="w-24 h-24 rounded-full object-cover border-2" style={{ borderColor: accentColor }} />
           )}
           <div className="flex-1">
             <h1 className="text-4xl font-bold mb-2" style={{ color: accentColor }}>{data.personalInfo.fullName}</h1>
             <p className="text-xl text-gray-600 mb-4">{data.personalInfo.profession}</p>
             
             <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                {data.personalInfo.email && (
                  <div className="flex items-center gap-1">
                    {showIcons && <Mail size={14} style={{ color: accentColor }} />}
                    <span>{data.personalInfo.email}</span>
                  </div>
                )}
                {data.personalInfo.phone && (
                  <div className="flex items-center gap-1">
                    {showIcons && <Phone size={14} style={{ color: accentColor }} />}
                    <span>{data.personalInfo.phone}</span>
                  </div>
                )}
                {data.personalInfo.location && (
                  <div className="flex items-center gap-1">
                    {showIcons && <MapPin size={14} style={{ color: accentColor }} />}
                    <span>{data.personalInfo.location}</span>
                  </div>
                )}
                {data.personalInfo.links?.map((link, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {showIcons && <LinkIcon size={14} style={{ color: accentColor }} />}
                    <a href={link.url} target="_blank" className="hover:underline">{link.name || link.url.replace(/^https?:\/\//, '')}</a>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: sectionSpacing }}>
         {sectionOrder.map(id => renderSection(id))}
      </div>
    </div>
  );
};
```

---

## 📄 37. `MinimalTemplate.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\resume-templates\MinimalTemplate.tsx`

```tsx
import React from 'react';
import { Resume } from '../../types';

interface TemplateProps {
  data: Resume;
  accentColor?: string;
  style?: React.CSSProperties;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, accentColor = '#3b82f6', style }) => {
  const { formatting } = data;
  const sectionSpacing = formatting?.sectionSpacing || 24;
  const itemSpacing = formatting?.itemSpacing || 16;
  const showIcons = data.personalInfo.showIcons !== false;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return data.professionalSummary && (
          <section key="summary">
            <h2 className="text-sm font-bold mb-2 uppercase tracking-widest border-b pb-1" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
              Summary
            </h2>
            <p className="text-gray-800 text-sm leading-relaxed text-justify">{data.professionalSummary}</p>
          </section>
        );
      case 'experience':
        return data.experience.length > 0 && (
          <section key="experience">
            <h2 className="text-sm font-bold mb-4 uppercase tracking-widest border-b pb-1" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
              Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-md">{exp.position}</h3>
                    <span className="text-xs text-gray-500 italic">
                      {exp.startDate.month} {exp.startDate.year} - {exp.isCurrent ? 'Present' : `${exp.endDate.month} ${exp.endDate.year}`}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-2" style={{ color: accentColor }}>{exp.company}</p>
                  
                  {Array.isArray(exp.description) && exp.description.length > 0 ? (
                    <ul className="list-disc ml-5 space-y-1">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return data.education.length > 0 && (
          <section key="education">
            <h2 className="text-sm font-bold mb-4 uppercase tracking-widest border-b pb-1" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-md">{edu.degree}</h3>
                    <span className="text-xs text-gray-500 italic">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                     <p className="text-sm font-medium" style={{ color: accentColor }}>{edu.institution}</p>
                     <span className="text-xs text-gray-500">{edu.location}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{edu.field}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return data.skills?.length > 0 && (
          <section key="skills">
            <h2 className="text-sm font-bold mb-3 uppercase tracking-widest border-b pb-1" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
              Skills
            </h2>
            <div className="space-y-2">
               {data.skills.map((line, i) => (
                 <div key={i} className="text-sm flex">
                    {line.heading && <span className="font-bold text-gray-900 mr-2 whitespace-nowrap">{line.heading}:</span>}
                    <span className="text-gray-700">{line.items.join(', ')}</span>
                 </div>
               ))}
            </div>
          </section>
        );
      case 'projects':
        return data.projects.length > 0 && (
          <section key="projects">
            <h2 className="text-sm font-bold mb-4 uppercase tracking-widest border-b pb-1" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
              Projects
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemSpacing }}>
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                       {proj.link ? (
                         <a href={proj.link} target="_blank" className="font-bold text-gray-900 text-md hover:underline hover:text-blue-600 transition-colors">
                           {proj.name}
                         </a>
                       ) : (
                         <h3 className="font-bold text-gray-900 text-md">{proj.name}</h3>
                       )}
                       
                       {proj.tools?.map((tool, t) => (
                         <span key={t} className="text-[10px] uppercase tracking-wide border border-gray-300 px-1 rounded text-gray-500">
                           {tool}
                         </span>
                       ))}
                    </div>
                    <span className="text-xs text-gray-500 italic">{proj.date}</span>
                  </div>
                  
                  {Array.isArray(proj.description) && proj.description.length > 0 ? (
                    <ul className="list-disc ml-5 space-y-1">
                      {proj.description.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-800 leading-relaxed">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      default: return null;
    }
  };

  const sectionOrder = formatting?.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects'];

  return (
    <div className="w-full h-full bg-white p-16 shadow-sm" style={style}>
      {/* Header */}
      <header className="text-center border-b-2 pb-6 mb-8" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-bold mb-2 uppercase tracking-widest" style={{ color: accentColor }}>{data.personalInfo.fullName}</h1>
        <p className="text-md text-gray-600 mb-4 tracking-wide">{data.personalInfo.profession}</p>
        
        <div className="text-xs text-gray-500 flex flex-wrap justify-center gap-x-3 gap-y-1">
          <span>{data.personalInfo.email}</span>
          <span>|</span>
          <span>{data.personalInfo.phone}</span>
          <span>|</span>
          <span>{data.personalInfo.location}</span>
          {data.personalInfo.links?.map((link, i) => (
            <React.Fragment key={i}>
              <span>|</span>
              <a href={link.url} target="_blank" className="hover:underline">{link.name || link.url.replace(/^https?:\/\//, '')}</a>
            </React.Fragment>
          ))}
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: sectionSpacing }}>
         {sectionOrder.map(id => renderSection(id))}
      </div>
    </div>
  );
};

```

---

## 📄 38. `AnalysisResult.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\analyzer\AnalysisResult.tsx`

```tsx
import React, { useState } from 'react';
import { ScoreCircle } from './ScoreCircle';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '../ui/Button';

interface CategoryFeedback {
  score: number;
  feedback: string[];
}

export interface AnalysisData {
  score: number;
  summary: string;
  categories: {
    tone_style: CategoryFeedback;
    content: CategoryFeedback;
    structure: CategoryFeedback;
    skills: CategoryFeedback;
  };
  keywords: {
    missing: string[];
    present: string[];
  };
  improvements: string[];
}

const CategoryAccordion = ({ title, data }: { title: string, data: CategoryFeedback }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (s >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn("px-3 py-1 rounded-full text-xs font-bold border", getColor(data.score))}>
            {data.score}/100
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <ul className="space-y-2">
            {data.feedback.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="mt-0.5 text-blue-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const AnalysisResult: React.FC<{ data: AnalysisData }> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Top Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-8">
        <ScoreCircle score={data.score} size={160} strokeWidth={12} />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ATS Compatibility Score</h2>
          <p className="text-gray-600 leading-relaxed">{data.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="text-primary-600" size={20} /> Category Breakdown
          </h3>
          <CategoryAccordion title="Tone & Style" data={data.categories.tone_style} />
          <CategoryAccordion title="Content Relevance" data={data.categories.content} />
          <CategoryAccordion title="Structure & Formatting" data={data.categories.structure} />
          <CategoryAccordion title="Skills Match" data={data.categories.skills} />
        </div>

        {/* Keywords & Improvements */}
        <div className="space-y-8">
           {/* Keywords */}
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Keywords Analysis</h3>
              
              <div className="mb-4">
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                   <XCircle size={14} /> Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.missing.length > 0 ? data.keywords.missing.map((k, i) => (
                    <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md border border-red-100">{k}</span>
                  )) : <span className="text-gray-400 text-sm">None! Good job.</span>}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                   <CheckCircle size={14} /> Present Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.present.map((k, i) => (
                    <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">{k}</span>
                  ))}
                </div>
              </div>
           </div>

           {/* Improvements */}
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <AlertCircle className="text-orange-500" size={20} /> Key Improvements
              </h3>
              <ul className="space-y-3">
                 {data.improvements.map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-100">
                      <span className="font-bold text-orange-500">{i + 1}.</span>
                      {item}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

```

---

## 📄 39. `ScoreCircle.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\analyzer\ScoreCircle.tsx`

```tsx
import React from 'react';

interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const ScoreCircle: React.FC<Props> = ({ score, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e'; // Green
    if (s >= 60) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color: getColor(score) }}>{score}</span>
        <span className="text-xs text-gray-500 uppercase font-semibold">Score</span>
      </div>
    </div>
  );
};

```

---

## 📄 40. `Layout.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\layout\Layout.tsx`

```tsx
import React from 'react';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

```

---

## 📄 41. `Navbar.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\layout\Navbar.tsx`

```tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { FileText, LogOut, Menu, User, X, MonitorCheck, PenTool } from 'lucide-react';
import { createResume } from '../../store/slices/resumeSlice';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreate = async () => {
    // Quick create action from Navbar
    // In a real app, might open a modal or go to dashboard first
    navigate('/dashboard'); 
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white group-hover:bg-primary-700 transition-colors">
                <FileText size={20} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">ResumeCraft</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                 <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all"
                    >
                      <PenTool size={16} /> Build
                    </Link>
                    <Link 
                      to="/analyzer" 
                      className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all"
                    >
                      <MonitorCheck size={16} /> ATS Check
                    </Link>
                 </div>

                <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center border border-primary-200">
                      <User size={16} />
                    </div>
                    {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium px-4 py-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-all shadow-sm hover:shadow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard / Build
                </Link>
                <Link
                  to="/analyzer"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ATS Analyzer
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
```

---

## 📄 42. `Login.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\auth\Login.tsx`

```tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { login } from '../../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Layout } from '../layout/Layout';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                start your 14-day free trial
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

```

---

## 📄 43. `Register.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\auth\Register.tsx`

```tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { register } from '../../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Layout } from '../layout/Layout';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

```

---

## 📄 44. `Button.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\ui\Button.tsx`

```tsx
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

```

---

## 📄 45. `Input.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\ui\Input.tsx`

```tsx
import React, { forwardRef } from 'react';
import { cn } from './Button'; // Reusing cn utility

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-all outline-none",
          error && "border-red-500 focus:border-red-500 focus:ring-red-200",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

```

---

## 📄 46. `Modal.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\ui\Modal.tsx`

```tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg pointer-events-auto overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

```

---

## 📄 47. `BulletListEditor.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\ui\BulletListEditor.tsx`

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { Button } from './Button';

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export const BulletListEditor: React.FC<Props> = ({ items, onChange, placeholder = "Add a bullet point..." }) => {
  const [newItem, setNewItem] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...safeItems, newItem.trim()]);
      setNewItem('');
      // Keep focus
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    const newItems = [...safeItems];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleEdit = (index: number, value: string) => {
    const newItems = [...safeItems];
    newItems[index] = value;
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {safeItems.map((item, index) => (
          <div key={index} className="flex items-start gap-2 group">
            <div className="mt-2 text-gray-400 cursor-move">
               <GripVertical size={14} />
            </div>
            <div className="flex-1">
               <textarea 
                  className="w-full text-sm border-b border-gray-200 focus:border-primary-500 outline-none py-1 bg-transparent resize-none h-auto overflow-hidden"
                  rows={1}
                  value={item}
                  onChange={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                    handleEdit(index, e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        // Optional: Insert new item after this one
                    }
                  }}
               />
            </div>
            <button 
              onClick={() => handleRemove(index)}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center mt-2">
        <input
          ref={inputRef}
          className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-100 outline-none"
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button size="sm" onClick={handleAdd} type="button" variant="secondary">
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};

```

---

## 📄 48. `ColorPicker.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\ui\ColorPicker.tsx`

```tsx
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { Palette } from 'lucide-react';

interface Props {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<Props> = ({ color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const styles = {
    popover: {
      position: 'absolute' as 'absolute',
      zIndex: 200,
      right: 0,
      top: '100%',
      marginTop: '8px',
    },
    cover: {
      position: 'fixed' as 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setDisplayColorPicker(!displayColorPicker)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div 
          className="w-5 h-5 rounded-full border border-gray-200 shadow-sm" 
          style={{ backgroundColor: color }} 
        />
        <span className="text-sm font-medium text-gray-700">{color}</span>
      </button>

      {displayColorPicker && (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={() => setDisplayColorPicker(false)} />
          <ChromePicker 
            color={color} 
            onChange={(c) => onChange(c.hex)}
            disableAlpha
          />
        </div>
      )}
    </div>
  );
};

```

---

## 📄 49. `DynamicLinks.tsx`

**📍 Location:** `D:\codes\AI_Resume_Project\client\src\components\ui\DynamicLinks.tsx`

```tsx
import React, { useState } from 'react';
import { Link } from '../../../types';
import { Button } from './Button';
import { Input } from './Input';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

interface Props {
  links: Link[];
  onChange: (links: Link[]) => void;
}

export const DynamicLinks: React.FC<Props> = ({ links, onChange }) => {
  const safeLinks = Array.isArray(links) ? links : [];

  const handleAdd = () => {
    onChange([...safeLinks, { name: '', url: '' }]);
  };

  const handleUpdate = (index: number, field: keyof Link, value: string) => {
    const newLinks = [...safeLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  const handleRemove = (index: number) => {
    const newLinks = [...safeLinks];
    newLinks.splice(index, 1);
    onChange(newLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">Social Links</label>
        <Button size="sm" variant="ghost" onClick={handleAdd} type="button">
          <Plus size={14} className="mr-1" /> Add Link
        </Button>
      </div>
      
      <div className="space-y-3">
        {safeLinks.map((link, index) => (
          <div key={index} className="flex gap-2 items-start animate-in slide-in-from-left-2 duration-200">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                placeholder="Label (e.g. GitHub)"
                value={link.name}
                onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                className="h-9 text-sm"
              />
              <Input
                placeholder="URL (https://...)"
                value={link.url}
                onChange={(e) => handleUpdate(index, 'url', e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <button 
              onClick={() => handleRemove(index)}
              className="mt-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {safeLinks.length === 0 && (
          <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
             No links added yet.
          </div>
        )}
      </div>
    </div>
  );
};

```

---

