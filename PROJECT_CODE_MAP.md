# Project Source Code Structure

This document lists all the files containing the explicit source code written for the AI Resume Builder & Analyzer project.

## Directory Tree

```
AI_Resume_Project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analyzer/
│   │   │   │   ├── AnalysisResult.tsx
│   │   │   │   └── ScoreCircle.tsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── builder/
│   │   │   │   ├── sections/
│   │   │   │   │   ├── Education.tsx
│   │   │   │   │   ├── Experience.tsx
│   │   │   │   │   ├── Formatting.tsx
│   │   │   │   │   ├── PersonalInfo.tsx
│   │   │   │   │   ├── Projects.tsx
│   │   │   │   │   ├── Skills.tsx
│   │   │   │   │   └── Summary.tsx
│   │   │   │   └── SectionSidebar.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── resume-templates/
│   │   │   │   ├── ClassicTemplate.tsx
│   │   │   │   ├── MinimalTemplate.tsx
│   │   │   │   ├── ModernTemplate.tsx
│   │   │   │   └── TemplateRenderer.tsx
│   │   │   └── ui/
│   │   │       ├── BulletListEditor.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── ColorPicker.tsx
│   │   │       ├── DynamicLinks.tsx
│   │   │       ├── Input.tsx
│   │   │       └── Modal.tsx
│   │   ├── lib/
│   │   │   └── axios.ts
│   │   ├── pages/
│   │   │   ├── Analyzer.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ResumeBuilder.tsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   └── resumeSlice.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
├── server/
│   ├── config/
│   │   ├── ai.js
│   │   ├── db.js
│   │   └── imagekit.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   └── resumeController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Resume.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   └── resumeRoutes.js
│   ├── utils/
│   │   └── pdfParser.cjs
│   └── server.js
```

## Full File Path List

### Backend (Server)

1.  `D:\codes\AI_Resume_Project\server\server.js` (Entry Point)
2.  `D:\codes\AI_Resume_Project\server\config\db.js` (Database Connection)
3.  `D:\codes\AI_Resume_Project\server\config\ai.js` (OpenAI/Gemini Config)
4.  `D:\codes\AI_Resume_Project\server\config\imagekit.js` (ImageKit Config)
5.  `D:\codes\AI_Resume_Project\server\models\User.js` (User Schema)
6.  `D:\codes\AI_Resume_Project\server\models\Resume.js` (Resume Schema)
7.  `D:\codes\AI_Resume_Project\server\controllers\authController.js` (Auth Logic)
8.  `D:\codes\AI_Resume_Project\server\controllers\resumeController.js` (Resume CRUD Logic)
9.  `D:\codes\AI_Resume_Project\server\controllers\aiController.js` (AI Analysis & Parsing Logic)
10. `D:\codes\AI_Resume_Project\server\routes\authRoutes.js` (Auth API Routes)
11. `D:\codes\AI_Resume_Project\server\routes\resumeRoutes.js` (Resume API Routes)
12. `D:\codes\AI_Resume_Project\server\routes\aiRoutes.js` (AI API Routes)
13. `D:\codes\AI_Resume_Project\server\middleware\authMiddleware.js` (JWT Protection)
14. `D:\codes\AI_Resume_Project\server\middleware\upload.js` (Multer Config)
15. `D:\codes\AI_Resume_Project\server\utils\pdfParser.cjs` (PDF Parsing Utility)

### Frontend (Client)

**Configuration & Entry:**
1.  `D:\codes\AI_Resume_Project\client\src\main.tsx`
2.  `D:\codes\AI_Resume_Project\client\src\App.tsx`
3.  `D:\codes\AI_Resume_Project\client\src\types\index.ts` (Global Types)
4.  `D:\codes\AI_Resume_Project\client\src\lib\axios.ts` (API Client)

**State Management (Redux):**
5.  `D:\codes\AI_Resume_Project\client\src\store\index.ts`
6.  `D:\codes\AI_Resume_Project\client\src\store\slices\authSlice.ts`
7.  `D:\codes\AI_Resume_Project\client\src\store\slices\resumeSlice.ts`

**Pages:**
8.  `D:\codes\AI_Resume_Project\client\src\pages\Dashboard.tsx`
9.  `D:\codes\AI_Resume_Project\client\src\pages\ResumeBuilder.tsx`
10. `D:\codes\AI_Resume_Project\client\src\pages\Analyzer.tsx`

**Components - Builder:**
11. `D:\codes\AI_Resume_Project\client\src\components\builder\SectionSidebar.tsx`
12. `D:\codes\AI_Resume_Project\client\src\components\builder\sections\PersonalInfo.tsx`
13. `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Summary.tsx`
14. `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Experience.tsx`
15. `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Education.tsx`
16. `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Projects.tsx`
17. `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Skills.tsx`
18. `D:\codes\AI_Resume_Project\client\src\components\builder\sections\Formatting.tsx`

**Components - Templates:**
19. `D:\codes\AI_Resume_Project\client\src\components\resume-templates\TemplateRenderer.tsx`
20. `D:\codes\AI_Resume_Project\client\src\components\resume-templates\ClassicTemplate.tsx`
21. `D:\codes\AI_Resume_Project\client\src\components\resume-templates\ModernTemplate.tsx`
22. `D:\codes\AI_Resume_Project\client\src\components\resume-templates\MinimalTemplate.tsx`

**Components - Analyzer:**
23. `D:\codes\AI_Resume_Project\client\src\components\analyzer\AnalysisResult.tsx`
24. `D:\codes\AI_Resume_Project\client\src\components\analyzer\ScoreCircle.tsx`

**Components - Layout & UI:**
25. `D:\codes\AI_Resume_Project\client\src\components\layout\Layout.tsx`
26. `D:\codes\AI_Resume_Project\client\src\components\layout\Navbar.tsx`
27. `D:\codes\AI_Resume_Project\client\src\components\auth\Login.tsx`
28. `D:\codes\AI_Resume_Project\client\src\components\auth\Register.tsx`
29. `D:\codes\AI_Resume_Project\client\src\components\ui\Button.tsx`
30. `D:\codes\AI_Resume_Project\client\src\components\ui\Input.tsx`
31. `D:\codes\AI_Resume_Project\client\src\components\ui\Modal.tsx`
32. `D:\codes\AI_Resume_Project\client\src\components\ui\BulletListEditor.tsx`
33. `D:\codes\AI_Resume_Project\client\src\components\ui\ColorPicker.tsx`
34. `D:\codes\AI_Resume_Project\client\src\components\ui\DynamicLinks.tsx`
