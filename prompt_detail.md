# **Complete Professional Manual: Building an AI-Powered Resume Builder with ATS Analysis System**

## **Project Vision and Architecture Overview**

This comprehensive guide details the creation of a zero-cost, production-grade full-stack application that combines professional resume building capabilities with intelligent ATS (Applicant Tracking System) analysis. The platform enables users to create, customize, and optimize resumes while receiving real-time AI-powered feedback on how well their resumes align with job descriptions and ATS requirements.

### **Core Feature Set**

**Resume Building Engine**: Users can create unlimited resumes using four professionally designed templates (Classic, Modern, Minimal, Minimal-Image) with real-time WYSIWYG editing. Each template supports full customization including accent color schemes (10+ color options), typography adjustments, section reordering, and responsive layout optimization. The editor includes dedicated sections for Personal Information, Professional Summary, Work Experience (unlimited entries), Education (multiple degrees), Projects (portfolio items), and Skills (both technical and soft skills).

**ATS Analysis System**: Integrated resume analysis powered by Google Gemini AI evaluates resumes against specific job descriptions. The system generates an overall ATS compatibility score (0-100), category-specific ratings for Tone & Style, Content Quality, Document Structure, and Skills Alignment. It provides actionable feedback in "What Went Well" and "What Needs Improvement" sections with specific, implementable suggestions. The analyzer identifies missing keywords, formatting issues, structural problems, and content gaps.

**AI Enhancement Features**: Context-aware AI improves professional summaries and job descriptions with industry-specific language. The system suggests ATS-friendly keywords based on job descriptions. AI extracts and structures data from uploaded PDF resumes for quick imports. Smart content generation creates achievement-focused bullet points with quantifiable metrics.

**Advanced Image Processing**: Profile images receive AI-powered face detection and auto-cropping for optimal presentation. Automatic background removal with theme-color replacement creates professional, cohesive designs. Real-time preview shows how images appear across different templates.

**Sharing and Export**: Users can toggle resumes between public (shareable link) and private modes. One-click sharing generates unique URLs viewable by recruiters and hiring managers. PDF export with print-optimized formatting maintains design fidelity. Side-by-side comparison mode shows resume before and after ATS optimization.

***

## **Technology Stack Selection (Zero-Cost Focus)**

### **Frontend Framework: React + TypeScript + Vite**

**Why This Stack**: React provides component reusability crucial for complex resume templates and form sections. TypeScript adds type safety preventing runtime errors in data-heavy operations like resume parsing and ATS scoring. Vite offers sub-second development server startup and instant hot module replacement. This combination has zero licensing costs and deploys free on Vercel/Netlify.

**Installation and Setup**: Create a new project with `npm create vite@latest resume-ats-platform -- --template react-ts`. This generates a TypeScript-enabled React project with modern build tooling. Install dependencies: `npm install react-router-dom lucide-react @reduxjs/toolkit react-redux axios react-hot-toast react-dropzone zustand clsx tailwind-merge`. Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer` then initialize with `npx tailwindcss init -p`.

**Configuration**: Update `tsconfig.json` to enable strict mode, path aliases (e.g., `@/components` maps to `./src/components`), and ES2022 features. Configure `vite.config.ts` with path resolution: `resolve: { alias: { '@': path.resolve(__dirname, './src') } }`. This allows clean imports like `import { Button } from '@/components/ui/button'` throughout the codebase.

### **Backend Framework: FastAPI (Python)**

**Why FastAPI**: FastAPI is the modern Python framework offering async/await support for concurrent operations (essential for AI API calls), automatic OpenAPI documentation at `/docs`, built-in data validation with Pydantic, and WebSocket support for real-time features. It's completely free and performs comparably to Node.js in benchmarks. Python's ecosystem includes powerful libraries for PDF processing (PyPDF2, pdfplumber), AI integration (OpenAI SDK, LangChain), and image manipulation (Pillow).

**Installation**: Create a `server/` directory and initialize with `pip install fastapi uvicorn[standard] python-multipart pydantic pydantic-settings pymongo motor bcrypt pyjwt python-dotenv cloudinary pypdf2 openai httpx pillow`. Use `python-multipart` for file uploads. `motor` provides async MongoDB drivers for FastAPI. `cloudinary` handles free image hosting and transformations.

**Project Structure**: Organize as `server/app/main.py` (entry point), `app/api/routes/` (endpoint definitions), `app/models/` (Pydantic schemas), `app/services/` (business logic), `app/core/` (config, security, database), `app/utils/` (helpers). This separation of concerns makes the codebase maintainable as complexity grows.

### **Database: MongoDB Atlas (Free Tier)**

**Why MongoDB**: Resume data has variable structure—some users have 2 work experiences, others have 10; some include projects, others don't. MongoDB's flexible schema handles this naturally without migrations. The free M0 tier provides 512MB storage (sufficient for 10,000+ resumes) with automatic backups and Atlas Search capabilities.

**Setup**: Create account at mongodb.com/cloud/atlas. Deploy free shared cluster selecting your closest region. Create database user with password authentication. Whitelist IP address `0.0.0.0/0` for development (restrict in production). Copy connection string format: `mongodb+srv://username:password@cluster.mongodb.net/resume_platform?retryWrites=true&w=majority`.

**Alternative: PostgreSQL on Railway**: Railway offers 500MB PostgreSQL free tier with better relational query performance. Use SQLAlchemy ORM with Alembic migrations. Better for complex joins if implementing team collaboration features later. Trade-off: requires schema migrations when data structure changes.

### **AI Provider: Google Gemini (Free Tier)**

**Why Gemini**: Google provides 60 requests per minute completely free on Gemini 1.5 Flash. The model handles resume analysis, content enhancement, and data extraction with high quality. No credit card required for free tier. Fallback option: Groq provides free inference for Llama models at 30 requests/minute.

**API Setup**: Visit aistudio.google.com and create API key. Store in `.env` as `GEMINI_API_KEY=your_key_here`. Use the OpenAI SDK with base URL override pointing to Gemini's OpenAI-compatible endpoint. This allows easy provider switching if needed.

### **File Storage: Cloudinary (Free Tier)**

**Why Cloudinary**: 25GB storage and 25GB monthly bandwidth on free tier. Provides URL-based image transformations (resize, crop, format conversion). AI-powered features include automatic face detection, smart cropping, and background removal. CDN delivery ensures fast loading globally. Alternative: ImageKit offers similar features with 20GB monthly bandwidth free.

**Configuration**: Sign up at cloudinary.com. Access dashboard for cloud name, API key, and API secret. Install SDK: `pip install cloudinary`. Initialize in Python: `cloudinary.config(cloud_name='...', api_key='...', api_secret='...')`. Upload with transformations: `cloudinary.uploader.upload(file, transformation=[{'width': 400, 'height': 400, 'crop': 'fill', 'gravity': 'face'}, {'effect': 'background_removal'}])`.

### **Deployment Solutions (100% Free)**

**Frontend: Vercel (Recommended)**: Unlimited bandwidth, automatic SSL, global CDN, GitHub integration with auto-deploys, preview deployments for PRs. Setup: Install Vercel CLI `npm i -g vercel`, run `vercel` in project directory, link GitHub repo for automatic deployments. Custom domain support free.

**Alternative Frontend: Netlify**: Similar features to Vercel with 100GB bandwidth monthly, form handling, serverless functions. Better for teams with drag-and-drop deployment.

**Backend: Render (Recommended)**: Free tier includes 512MB RAM, automatic SSL, custom domains. Drawback: spins down after 15 minutes of inactivity (15-30 second cold start). Setup: Connect GitHub repo, set build command `pip install -r requirements.txt`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

**Alternative Backend: Railway**: 500 hours free per month with $5 free credit. Better uptime than Render as services stay warm. Includes free PostgreSQL/MongoDB hosting. Setup: Connect GitHub, configure start command, add environment variables.

**Alternative Backend: PythonAnywhere**: Always-on free tier with custom domains. Limited to 100 seconds CPU time daily (resets at UTC midnight). Best for low-traffic projects. No credit card required.

**All-in-One Alternative: Replit**: Free deployments with reserved VM. Includes database (1GB), cron jobs, secrets management. Best for MVPs and learning projects. Trade-off: public code unless paid plan.

***

## **Complete Frontend Architecture**

### **Project File Structure**

```
client/
├── src/
│   ├── components/
│   │   ├── home/                    # Landing page components
│   │   │   ├── Navbar.tsx           # Main navigation
│   │   │   ├── Hero.tsx             # Hero section with CTA
│   │   │   ├── Features.tsx         # Feature grid
│   │   │   ├── HowItWorks.tsx       # Process explanation
│   │   │   ├── Templates.tsx        # Template showcase
│   │   │   ├── Testimonials.tsx     # User testimonials
│   │   │   └── Footer.tsx           # Site footer
│   │   ├── auth/                    # Authentication
│   │   │   ├── AuthModal.tsx        # Login/Register modal
│   │   │   ├── LoginForm.tsx        # Login form
│   │   │   └── RegisterForm.tsx     # Registration form
│   │   ├── dashboard/               # Dashboard components
│   │   │   ├── DashboardNav.tsx     # Dashboard navigation
│   │   │   ├── ResumeCard.tsx       # Resume card display
│   │   │   ├── CreateResumeModal.tsx # New resume modal
│   │   │   ├── UploadResumeModal.tsx # Upload existing modal
│   │   │   ├── StatsOverview.tsx    # User statistics
│   │   │   └── QuickActions.tsx     # Quick action buttons
│   │   ├── builder/                 # Resume builder
│   │   │   ├── BuilderLayout.tsx    # Main builder layout
│   │   │   ├── BuilderSidebar.tsx   # Section navigation
│   │   │   ├── BuilderToolbar.tsx   # Top toolbar with actions
│   │   │   ├── SectionNavigation.tsx # Section progress
│   │   │   ├── ProgressBar.tsx      # Completion progress
│   │   │   └── sections/            # Form sections
│   │   │       ├── PersonalInfoForm.tsx
│   │   │       ├── ProfessionalSummaryForm.tsx
│   │   │       ├── ExperienceForm.tsx
│   │   │       ├── EducationForm.tsx
│   │   │       ├── ProjectsForm.tsx
│   │   │       └── SkillsForm.tsx
│   │   ├── templates/               # Resume templates
│   │   │   ├── TemplateRenderer.tsx # Template switcher
│   │   │   ├── ClassicTemplate.tsx  # Classic layout
│   │   │   ├── ModernTemplate.tsx   # Modern layout
│   │   │   ├── MinimalTemplate.tsx  # Minimal layout
│   │   │   └── MinimalImageTemplate.tsx
│   │   ├── preview/                 # Resume preview
│   │   │   ├── ResumePreview.tsx    # Main preview
│   │   │   ├── PreviewToolbar.tsx   # Preview actions
│   │   │   ├── ZoomControls.tsx     # Zoom in/out
│   │   │   └── PrintStyles.tsx      # Print CSS
│   │   ├── customization/           # Customization tools
│   │   │   ├── TemplateSelector.tsx # Template picker
│   │   │   ├── ColorPicker.tsx      # Color theme picker
│   │   │   ├── FontSelector.tsx     # Font family picker
│   │   │   ├── LayoutCustomizer.tsx # Spacing/margins
│   │   │   └── SectionToggle.tsx    # Show/hide sections
│   │   ├── analyzer/                # ATS Analyzer
│   │   │   ├── AnalyzerPanel.tsx    # Main analyzer view
│   │   │   ├── ScoreGauge.tsx       # Score visualization
│   │   │   ├── ScoreCircle.tsx      # Category scores
│   │   │   ├── SummaryCard.tsx      # Overall summary
│   │   │   ├── ATSCompatibilityCard.tsx
│   │   │   ├── DetailedFeedback.tsx # Expandable feedback
│   │   │   ├── FeedbackAccordion.tsx # Category accordion
│   │   │   ├── KeywordAnalysis.tsx  # Keyword matching
│   │   │   ├── ImprovementSuggestions.tsx
│   │   │   └── ComparisonView.tsx   # Before/after view
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── Button.tsx           # Button component
│   │   │   ├── Input.tsx            # Input field
│   │   │   ├── Textarea.tsx         # Textarea field
│   │   │   ├── Select.tsx           # Dropdown select
│   │   │   ├── Modal.tsx            # Modal dialog
│   │   │   ├── Toast.tsx            # Notification toast
│   │   │   ├── Loader.tsx           # Loading spinner
│   │   │   ├── Card.tsx             # Card container
│   │   │   ├── Badge.tsx            # Badge/chip
│   │   │   ├── Tabs.tsx             # Tab component
│   │   │   ├── Accordion.tsx        # Accordion component
│   │   │   ├── Tooltip.tsx          # Tooltip overlay
│   │   │   ├── Dropdown.tsx         # Dropdown menu
│   │   │   └── FileUpload.tsx       # File upload
│   │   ├── shared/                  # Shared components
│   │   │   ├── ProtectedRoute.tsx   # Auth route guard
│   │   │   ├── ErrorBoundary.tsx    # Error handler
│   │   │   └── NotFound.tsx         # 404 page
│   │   ├── pages/                   # Route pages
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Dashboard.tsx        # User dashboard
│   │   │   ├── ResumeBuilder.tsx    # Builder page
│   │   │   ├── ResumeAnalyzer.tsx   # Analyzer page
│   │   │   ├── PublicResume.tsx     # Public view page
│   │   │   └── NotFound.tsx         # 404 page
│   │   ├── store/                   # Redux store
│   │   │   ├── index.ts             # Store configuration
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts     # Auth state
│   │   │   │   ├── resumeSlice.ts   # Resume data
│   │   │   │   └── uiSlice.ts       # UI state
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useAuth.ts           # Auth hook
│   │   │   ├── useResume.ts         # Resume operations
│   │   │   ├── useDebounce.ts       # Debounce hook
│   │   │   └── useLocalStorage.ts   # LocalStorage hook
│   │   ├── types/                   # TypeScript types
│   │   │   ├── resume.ts            # Resume interfaces
│   │   │   ├── user.ts              # User interfaces
│   │   │   ├── analyzer.ts          # Analyzer types
│   │   │   └── api.ts               # API response types
│   │   ├── utils/                   # Utility functions
│   │   │   ├── api.ts               # Axios instance
│   │   │   ├── format.ts            # Data formatting
│   │   │   ├── validation.ts        # Form validation
│   │   │   └── constants.ts         # App constants
│   │   ├── styles/                  # Global styles
│   │   │   └── index.css            # Tailwind + customs
│   │   ├── App.tsx                  # Main app component
│   │   └── main.tsx                 # Entry point
```

### **Routing Configuration (React Router v6)**

Create comprehensive routing in `App.tsx` defining all application paths. Import `BrowserRouter`, `Routes`, `Route`, `Navigate` from react-router-dom. Wrap everything in `BrowserRouter` in `main.tsx`.

**Public Routes**: Define `/` rendering the Home page with hero section, features, templates showcase, testimonials, and footer. The `/auth` route displays the authentication modal with tab switching between login and registration. Create `/view/:resumeId` for public resume viewing without authentication.

**Protected Routes**: Wrap authenticated routes in a `ProtectedRoute` component checking `isAuthenticated` from Redux state. Redirect to `/auth` if not authenticated with a `next` parameter preserving intended destination. Define `/dashboard` showing all user resumes with create/upload options. Create `/builder/:resumeId` for the resume builder interface with left panel forms and right panel preview. Add `/analyzer/:resumeId` displaying the ATS analysis dashboard with scores and feedback. Include `/analyzer/:resumeId/analyze` where users input job descriptions for new analysis.

**Nested Routes**: Use `Outlet` component in layout wrappers. Create `DashboardLayout` wrapping dashboard navigation around child routes. Implement `BuilderLayout` with sidebar, toolbar, and content area for builder child routes.

**Route Parameters and Query Strings**: Extract `resumeId` using `useParams()` hook. Read authentication state from URL using `useSearchParams()` for `/auth?state=register` or `/auth?state=login`. Pass analysis results via navigation state: `navigate('/analyzer/:id', { state: { analysisData } })`.

***

## **Landing Page Implementation**

### **Navbar Component (Sticky Navigation)**

**Component Location**: `src/components/home/Navbar.tsx`.

**Visual Structure**: Create a fixed top navigation bar with `h-16` (64px height), white background with subtle shadow (`shadow-md`), and `z-50` for layering above content. Apply `sticky top-0` with backdrop blur effect for modern glassmorphism.

**Layout Design**: Use flexbox container with `justify-between items-center` spacing content evenly. Left section contains logo image (height 40px) with brand text "ResumeCraft" in gradient colors transitioning from green-600 to blue-600. Center section displays navigation links (Home, Features, Templates, How It Works) visible only on desktop (`hidden md:flex`) with smooth scroll behavior to page sections. Right section has two buttons: "Login" with ghost styling (transparent background, green border, green text on hover) and "Get Started" with primary gradient background (green-500 to blue-500) with white text.

**Mobile Menu**: Add hamburger icon button (three horizontal lines) visible on mobile, hidden on desktop (`md:hidden`). Clicking toggles `isMobileMenuOpen` state showing fullscreen overlay menu. Mobile menu slides in from right with smooth transition animation. Display navigation links stacked vertically with larger tap targets (min-height 44px for accessibility). Close button (X icon) positioned top-right of mobile menu.

**Interaction States**: Navigation links have hover effect changing color from gray-600 to green-600 with 200ms transition. Active link (current section) shows green-600 color with bottom border indicator. Buttons have hover scale animation (`hover:scale-105`) with shadow increase. Implement scroll detection that adds shadow and slight background opacity when scrolled past 100px.

**TypeScript Interface**: Define props interface accepting optional `className` string. Create navigation items array typed as `{ id: string; label: string; href: string }[]`. Implement `scrollToSection` function typed with `(sectionId: string) => void` using `document.getElementById` and `scrollIntoView({ behavior: 'smooth' })`.

### **Hero Section Component**

**Component Location**: `src/components/home/Hero.tsx`.

**Background Design**: Full viewport height container (`min-h-screen`) with gradient background from purple-50 via blue-50 to green-50 creating soft, professional atmosphere. Add animated geometric shapes (circles and rectangles with low opacity) positioned absolutely with slow floating animation using CSS keyframes. Overlay subtle grid pattern using CSS background-image for technical aesthetic.

**Content Layout**: Center content vertically and horizontally using flexbox. Maximum width container (1200px) with responsive padding. Divide into two columns on desktop (60% text, 40% visual) stacking vertically on mobile.

**Text Content**: Display main heading "Create ATS-Optimized Resumes That Get Interviews" using 4xl font size (mobile) scaling to 6xl (desktop) with font-bold weight and gradient text from green-600 to blue-600. Add typewriter animation effect using CSS or JavaScript for dynamic feel. Below heading, show descriptive paragraph "Build professional resumes with AI-powered optimization. Get instant ATS analysis and land your dream job faster" in text-xl with gray-600 color and 1.7 line-height for readability.

**Call-to-Action Buttons**: Create button group with flex layout and gap-4 spacing. Primary button "Start Building Free" with gradient background, white text, large padding (px-8 py-4), rounded-full corners, shadow-lg elevation, and hover effects (shadow-xl, slight upward translate). Secondary button "See How It Works" with ghost styling (transparent background, gray-700 border, hover background gray-100) with play icon from lucide-react. Both buttons have cursor-pointer, transition-all duration-300 for smooth animations.

**Trust Indicators**: Below buttons, display social proof section with flex layout. Show user avatars (3-4 overlapping circular images) with -space-x-2 for overlap effect. Add text "Join 10,000+ job seekers who landed interviews" in text-sm gray-600. Include 5-star rating display with yellow star icons and "4.9/5 from 2,000+ reviews" text.

**Hero Visual**: Right side displays mockup image or animated illustration of resume being created. Show laptop mockup with resume visible on screen using perspective transform (rotateY: 15deg, rotateX: 10deg) for 3D effect. Add floating UI elements (score badges, checkmarks, suggestion cards) positioned absolutely around laptop with staggered fade-in animations. Implement subtle parallax scrolling effect where visual elements move at different speeds creating depth.

**Animation Implementation**: Use CSS keyframes or Framer Motion library for entrance animations. Heading fades in and slides up with 0.3s delay. Paragraph follows with 0.5s delay. Buttons appear at 0.7s delay. Trust indicators at 0.9s delay. Hero visual fades and scales from 0.8 to 1 with 1s delay. Floating elements use infinite animations with varying durations (3-7s) for organic movement.

**TypeScript Types**: No props needed, component is self-contained. Define internal state types for animation triggers if using React state.

### **Features Section Component**

**Component Location**: `src/components/home/Features.tsx`.

**Section Structure**: Container with `id="features"` for anchor navigation from navbar. Add padding-top-24 for spacing from previous section. Maximum width 1200px with centered alignment.

**Section Header**: Create centered text block with max-width-3xl. Display small badge/chip with "FEATURES" text using green-100 background, green-600 text, rounded-full, padding-x-4 padding-y-1, text-sm font-medium. Add sparkles icon from lucide-react before text. Below badge, show heading "Everything You Need to Land Your Dream Job" in text-4xl font-bold with gray-900 color. Add description paragraph "Powerful tools to create, optimize, and share your professional resume" in text-xl gray-600 with margin-top-4.

**Features Grid**: Create responsive grid with 1 column on mobile, 2 on tablet (`md:grid-cols-2`), 3 on desktop (`lg:grid-cols-3`). Apply gap-8 between cards. Add margin-top-16 from header.

**Feature Cards (6-9 cards total)**: Each card has white background, rounded-xl corners, padding-8, border border-gray-200, hover effect (shadow-lg, scale-105, border-green-300) with transition-all duration-300.

**Feature 1 - Resume Builder**: Icon container with gradient background (green-100 to blue-100), width-16 height-16, rounded-full, flex center. File icon from lucide-react in green-600, size-8. Heading "Professional Templates" in text-xl font-semibold, margin-top-6. Description "Choose from 4 ATS-friendly templates designed by hiring professionals" in text-gray-600, margin-top-2, line-height-relaxed.

**Feature 2 - ATS Analysis**: Icon gradient background blue-100 to purple-100. BarChart icon in blue-600. Heading "ATS Score Analysis". Description "Get instant feedback on how well your resume performs in applicant tracking systems".

**Feature 3 - AI Enhancement**: Icon gradient purple-100 to pink-100. Sparkles icon in purple-600. Heading "AI-Powered Writing". Description "Enhance your content with AI that understands industry-specific language and best practices".

**Feature 4 - Real-time Preview**: Icon gradient orange-100 to red-100. Eye icon in orange-600. Heading "Live Preview". Description "See changes instantly as you edit with side-by-side preview across all devices".

**Feature 5 - Keyword Optimization**: Icon gradient teal-100 to green-100. Search icon in teal-600. Heading "Keyword Matching". Description "Automatically identify and add relevant keywords from job descriptions to boost ATS compatibility".

**Feature 6 - Easy Sharing**: Icon gradient indigo-100 to blue-100. Share2 icon in indigo-600. Heading "One-Click Sharing". Description "Generate public links to share your resume with recruiters or download as PDF instantly".

**Additional Features**: "Image Optimization" with Upload icon, "Version History" with Clock icon, "Multiple Resumes" with Copy icon. Each follows the same card structure with unique gradient color schemes.

**Interaction**: Cards have hover cursor-pointer if they link to detailed pages. Clicking feature card could open modal with demo video or navigate to dedicated feature page. Add subtle entrance animations where cards fade in and slide up sequentially with 100ms stagger between each.

### **How It Works Section Component**

**Component Location**: `src/components/home/HowItWorks.tsx`.

**Layout Structure**: Full-width section with light gray background (gray-50) for visual separation. Container with max-width-1200px and padding-y-24.

**Section Heading**: Centered heading "How It Works" in text-4xl font-bold. Subheading "Get your perfect resume in 3 simple steps" in text-xl gray-600 margin-top-4.

**Step Flow (Horizontal Timeline on Desktop, Vertical on Mobile)**: Create flex container that's column on mobile, row on desktop. Connect steps with dashed line using CSS border between elements.

**Step 1 - Create**: Card with white background, rounded-2xl, padding-8, width-full on mobile, width-1/3 on desktop. Large number "01" in absolute position top-left with gradient text green-600 to blue-600, text-8xl, opacity-20. Icon (Edit icon from lucide-react) in green gradient background circle, size-16, centered. Heading "Create Your Resume" in text-2xl font-bold margin-top-6. Description "Start from scratch or upload existing resume. Our AI extracts and organizes your information instantly" in gray-600 margin-top-4. Bullet points listing: "Choose from 4 templates", "AI auto-fill from PDF", "Smart section suggestions" with checkmark icons.

**Step 2 - Optimize**: Similar card structure with "02" number. Target icon in blue gradient background. Heading "Optimize with AI". Description "Paste job description and get tailored suggestions. AI enhances your content and identifies missing keywords". Bullet points: "Real-time ATS scoring", "Keyword gap analysis", "AI content enhancement".

**Step 3 - Download & Share**: Card with "03" number. Download icon in purple gradient background. Heading "Download & Share". Description "Export as print-ready PDF or generate shareable link for recruiters and hiring managers". Bullet points: "One-click PDF export", "Public resume links", "Mobile-optimized viewing".

**Visual Connections**: Between each step, display arrow icon (ArrowRight from lucide-react) in gray-400 color, hidden on mobile, visible on desktop. Animate arrows with subtle left-to-right movement using infinite CSS animation.

**Interactive Demo Button**: Below steps, centered button "See It In Action" with video play icon opening modal with demo video or interactive tutorial. Button has primary gradient styling with shadow and hover effects.

### **Templates Showcase Component**

**Component Location**: `src/components/home/Templates.tsx`.

**Section Layout**: Padding-y-24 with white background. Max-width-1400px container.

**Section Header**: Centered "Choose Your Perfect Template" heading in text-4xl font-bold. Description "All templates are ATS-friendly and professionally designed" in text-xl gray-600 margin-top-4.

**Template Preview Grid**: Grid with 1 column mobile, 2 columns tablet, 4 columns desktop (`lg:grid-cols-4`). Gap-6 between cards margin-top-12.

**Template Card Structure**: Each card contains mockup image of template, template name, popularity badge, and CTA button. White background with rounded-xl border border-gray-200. Hover effect: shadow-2xl, translate-y -4px, border-green-400 with transition-all duration-300.

**Template 1 - Classic**: Image showing classic two-column layout with navy blue accents. Display actual mini resume preview using reduced-scale version of ClassicTemplate component. Aspect ratio 1:1.414 (A4 proportions) with overflow hidden. Below image, heading "Classic" in font-semibold text-lg. Badge "Most Popular" with star icon, green background, white text, positioned absolute top-right. Description "Traditional two-column layout perfect for corporate roles" in text-sm gray-600 margin-top-2. Button "Preview Template" with ghost styling, full width, margin-top-4 opening modal with full preview.

**Template 2 - Modern**: Preview showing single-column modern design with teal accents. Badge "Recommended for Tech". Description "Contemporary design with bold headers and clean sections".

**Template 3 - Minimal**: Preview of minimalist layout with gray tones. Badge "Best for Design". Description "Clean, spacious layout that emphasizes content over decoration".

**Template 4 - Minimal Image**: Preview showing template with circular profile photo. Badge "Creative Roles". Description "Minimal design with profile image and color-matched theme".

**Preview Modal**: Clicking preview button opens fullscreen modal with close button top-right. Modal shows full A4-sized template preview (actual ClassicTemplate/etc. component rendered with dummy data). Zoom controls (+ and - buttons) allowing 50%-200% zoom. Bottom action bar with "Use This Template" primary button navigating to `/builder/new?template=classic`. Color picker showing how template looks with different accent colors (6-8 color swatches) with instant preview update.

**Template Comparison Table**: Below grid, add collapsible comparison table showing which features each template supports (image support, sections included, ideal industries, ATS compatibility level). Table has alternating row colors for readability with responsive horizontal scroll on mobile.

### **Testimonials Section Component**

**Component Location**: `src/components/home/Testimonials.tsx`.

**Background**: Light gradient from white to green-50 with padding-y-24.

**Section Header**: "What Our Users Say" heading centered in text-4xl font-bold. Subheading "Join thousands who landed their dream jobs" in text-xl gray-600 margin-top-4. Display aggregate stats: "4.9/5 rating -  2,000+ reviews -  10,000+ users" with star icons.

**Testimonials Grid**: Three columns on desktop (`lg:grid-cols-3`), two on tablet (`md:grid-cols-2`), one on mobile. Gap-8 with margin-top-16.

**Testimonial Card Design**: White background with rounded-2xl, padding-8, border border-gray-200. Quote icon (Quote from lucide-react) in green-500, absolute positioned top-left, size-10, opacity-20.

**Card Content**: Five yellow stars (Star icons filled) aligned left with margin-bottom-4. Testimonial text in text-gray-700, line-height-relaxed, margin-bottom-6: "I applied to 50 companies with my old resume and got 2 interviews. After using ResumeCraft and optimizing with their ATS analyzer, I got 8 interviews from my next 20 applications. Landed a senior role at Google!".

**User Info Section**: Flex row with gap-4 aligning items center. Avatar image (circular, width-12 height-12, border-2 border-green-500) showing user photo or placeholder with initials. Text column with user name "Sarah Chen" in font-semibold, job title "Senior Product Designer at Google" in text-sm gray-600 below. LinkedIn icon link with hover color transition.

**Testimonial 2**: Similar structure with different content: "The AI suggestions were spot-on. It helped me articulate my achievements with metrics I hadn't considered. Got interviews at Microsoft and Amazon!". User: "Michael Rodriguez, Software Engineer at Microsoft".

**Testimonial 3**: "As a career changer, I struggled to present my transferable skills. The ATS analyzer showed me exactly what keywords to add. Now I'm a PM at a fintech unicorn!". User: "Priya Patel, Product Manager at Stripe".

**Additional Testimonials**: Add 3-6 more testimonials with diverse roles (marketing, finance, operations) showing broad appeal. Vary testimonial lengths and focuses (template design, ease of use, customer support, ATS accuracy).

**Carousel Functionality**: On mobile, implement swipeable carousel with dot indicators showing current testimonial. Auto-rotate every 5 seconds with pause on hover. Navigation arrows on sides for manual control.

**Trust Badges**: Below testimonials, display logos of companies where users landed jobs (Google, Microsoft, Amazon, Apple, Meta, etc.) in grayscale with hover color transition. Animated infinite scroll marquee on desktop showing continuous company logo stream.

### **Call-to-Action (CTA) Section Component**

**Component Location**: `src/components/home/CallToAction.tsx`.

**Visual Design**: Full-width section with bold gradient background from green-600 via blue-600 to purple-600. Padding-y-24 with max-width-1200px centered container. Optional: Background pattern overlay with geometric shapes at low opacity.

**Content Layout**: Centered text content with max-width-3xl. Heading "Ready to Land Your Dream Job?" in text-5xl font-bold, white color with slight text shadow for depth. Subheading "Join 10,000+ job seekers who got more interviews with optimized resumes" in text-2xl white color opacity-90 margin-top-6.

**Action Buttons**: Flex row with gap-6 margin-top-12 justify-center. Primary button "Start Building for Free" with large padding (px-10 py-5), white background, gradient text green-600 to blue-600, rounded-full, text-xl font-semibold, shadow-xl, hover scale-105 transform. Add arrow right icon after text. Secondary button "Upload Existing Resume" with outline styling (white border-2, white text, hover bg-white hover text-green-600).

**Trust Indicators**: Below buttons, flex row with gap-8 justify-center margin-top-8. Show three mini stats with icons: "Free Forever" with heart icon, "No Credit Card" with CreditCard icon crossed out, "2 Minutes Setup" with Clock icon. Each in white text with opacity-90.

**Urgency Element**: Optional limited-time banner "🎉 Special: Upload existing resume and get free AI optimization (Limited time)" with pulsing animation.

### **Footer Component**

**Component Location**: `src/components/home/Footer.tsx`.

**Background**: Dark gray-900 background with white/gray-300 text. Padding-top-16 padding-bottom-8.

**Layout Structure**: Max-width-1200px container with four-column grid on desktop (`lg:grid-cols-4`), two columns on tablet, one on mobile. Gap-12 between columns.

**Column 1 - Brand**: Logo image (white version) with height-10. Brand name "ResumeCraft" in text-xl font-bold white. Tagline "AI-powered resume builder with ATS optimization" in text-gray-400 text-sm margin-top-4. Social media icons (LinkedIn, Twitter, GitHub, YouTube) as circular buttons with gray-700 background, white icons, hover bg-green-600 transition in flex row gap-4 margin-top-6.

**Column 2 - Product Links**: Heading "Product" in text-white font-semibold margin-bottom-4. Vertical list of links: "Resume Builder", "ATS Analyzer", "Templates", "AI Features", "Pricing" in text-gray-400 hover text-green-400 with transition. Each link is anchor or React Router Link.

**Column 3 - Resources**: Heading "Resources". Links: "Blog", "Resume Tips", "Cover Letter Guide", "Interview Prep", "Career Advice", "API Documentation". Same styling as Column 2.

**Column 4 - Company**: Heading "Company". Links: "About Us", "Contact", "Privacy Policy", "Terms of Service", "Sitemap". Contact email "support@resumecraft.com" with envelope icon.

**Bottom Bar**: Border-top border-gray-800, margin-top-16, padding-top-8. Flex row justify-between items-center. Left side: "© 2026 ResumeCraft. All rights reserved." in text-gray-400 text-sm. Right side: Language selector dropdown (English, Español, Français) with globe icon.

**Newsletter Subscription (Optional)**: Add fifth column or separate row above footer with "Stay Updated" heading, email input field with placeholder "Enter your email", and "Subscribe" button. On submit, show success toast "Thanks for subscribing!".

***

## **Authentication System (Complete Implementation)**

### **Authentication Modal Component**

**Component Location**: `src/components/auth/AuthModal.tsx`.

**Modal Overlay**: Full viewport overlay with backdrop-blur-sm and bg-black/50. Fixed positioning with z-50. Clicking overlay closes modal. Use `useEffect` to disable body scroll when modal open: `document.body.style.overflow = 'hidden'`.

**Modal Container**: Centered card with max-width-md (448px), white background, rounded-2xl, shadow-2xl. Padding-8 with relative positioning. Entrance animation: fade and scale from 0.95 to 1 with 200ms duration.

**Close Button**: Absolute positioned top-right with X icon from lucide-react. Gray-400 color hover gray-600, size-6 icon, padding-2, cursor-pointer. Clicking calls `onClose` prop or navigates back.

**Tab Switcher**: Flex row with two tabs "Login" and "Sign Up" with flex-1 each. Active tab has green-600 text and bottom border-2 border-green-600. Inactive tab has gray-500 text hover gray-700. Clicking tab updates URL parameter `/auth?state=login` or `/auth?state=register`. Smooth tab indicator animation sliding between tabs.

**Tab Content**: Conditional rendering based on active tab. Render `<LoginForm />` when state is "login", `<RegisterForm />` when state is "register". Content fades in with 150ms delay when switching.

**Social Login Section**: Below forms, divider with "OR" text centered. Buttons for "Continue with Google", "Continue with GitHub" with respective brand icons and colors. Full-width buttons with border border-gray-300, flex items-center justify-center, gap-3, hover bg-gray-50. Currently placeholders (OAuth implementation optional based on requirements).

### **Login Form Component**

**Component Location**: `src/components/auth/LoginForm.tsx`.

**Form State Management**: Use `useState` hooks for `email` (string), `password` (string), `isLoading` (boolean), `errors` (object with email and password keys). Use `useDispatch` from react-redux for dispatching auth actions. Use `useNavigate` for redirecting after login.

**Heading**: "Welcome Back!" in text-2xl font-bold, gray-900 color, margin-bottom-2. Subheading "Login to access your resumes" in text-gray-600 margin-bottom-8.

**Email Input Field**: Label "Email Address" with required asterisk in red. Input component with type="email", placeholder "you@example.com", value bound to `email` state, onChange updating state. Styling: border border-gray-300, rounded-lg, padding-x-4 padding-y-3, full width, focus ring-2 ring-green-500, transition. Mail icon from lucide-react positioned absolute left inside input (padding-left-12 to accommodate). Error message displayed below if `errors.email` exists: red text-sm "Please enter a valid email address".

**Password Input Field**: Label "Password" with required asterisk. Input type toggling between "password" and "text" based on `showPassword` state. Lock icon on left, eye/eye-off icon button on right toggling visibility. Placeholder "Enter your password". Same styling as email input. Error message if `errors.password`: "Password is required".

**Forgot Password Link**: Text-sm text-green-600 hover underline, aligned right, margin-top-2: "Forgot your password?". Links to `/auth/reset` (implement password reset flow).

**Submit Button**: Full width button with gradient bg-green-600 to bg-blue-600, white text, rounded-lg, padding-y-3, font-semibold, margin-top-6. Text changes to "Signing in..." with spinner icon when `isLoading` true, "Login" when idle. Disabled styling (opacity-50 cursor-not-allowed) when loading.

**Form Submission Handler**: Prevent default form behavior. Validate inputs: check email format with regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, ensure password not empty. Set `errors` state if validation fails. If valid, set `isLoading` true. Make API call: `const response = await axios.post('/api/auth/login', { email, password })`. On success, dispatch `setCredentials` action with token and user data from response. Store token in localStorage: `localStorage.setItem('token', response.data.token)`. Show success toast: `toast.success('Welcome back!')`. Read `next` parameter from URL: `const searchParams = new URLSearchParams(location.search); const next = searchParams.gch); const next = searchParams.get('next') || '/dashboard'` . Navigate to next page: `navigate(next)` . On error, show error toast: `toast.error(error.response?.data?.message || 'Login failed')` . Set `isLoading` false in finally block .

**Switch to Register Link**: Text-center margin-top-6, text-sm: "Don't have an account? " in gray-600 followed by "Sign up" link in green-600 font-semibold hover underline. Clicking updates URL to `/auth?state=register`.

**TypeScript Types**: Define interface `LoginFormData { email: string; password: string }`. Define `FormErrors { email?: string; password?: string }`. Type API response: `AuthResponse { token: string; user: { id: string; name: string; email: string } }`.

### **Register Form Component**

**Component Location**: `src/components/auth/RegisterForm.tsx`.

**Additional State**: Same as login plus `name` (string), `confirmPassword` (string). Errors object includes name and confirmPassword keys.

**Heading**: "Create Your Account" in text-2xl font-bold. Subheading "Start building your perfect resume".

**Full Name Input**: Label "Full Name", input with User icon, placeholder "John Doe". Same styling as email input. Error: "Name is required".

**Email Input**: Same as login form. Additional validation: check if email already exists by debouncing input and calling `/api/auth/check-email` endpoint returning boolean. Show "Email already registered" error if exists.

**Password Input**: Additional password strength indicator below input. Show colored bar (red/yellow/green) and text ("Weak"/"Medium"/"Strong") based on password criteria: length >= 8, contains uppercase, contains lowercase, contains number, contains special character. Error: "Password must be at least 8 characters with uppercase, lowercase, and number".

**Confirm Password Input**: Label "Confirm Password", same styling. Validation: must match password exactly. Error: "Passwords do not match" shown in real-time as user types.

**Terms Checkbox**: Flex row with checkbox input and label margin-top-6. Label text: "I agree to the Terms of Service and Privacy Policy" with links styled green-600 underline. Checkbox required, error "You must accept the terms" if unchecked on submit.

**Submit Button**: "Create Account" text, changes to "Creating account..." when loading. Same styling as login button.

**Form Validation**: Validate all fields: name non-empty, email format, password strength, passwords match, terms accepted. Show all errors simultaneously in respective input fields.

**Form Submission**: POST to `/api/auth/register` with `{ name, email, password }`. Response contains token and user object. Dispatch `setCredentials`, store token, show success toast "Account created successfully! Welcome to ResumeCraft!". Navigate to `/dashboard?welcome=true`. Show welcome tour modal on dashboard if welcome parameter exists.

**Switch to Login Link**: "Already have an account? Login". Updates URL to `/auth?state=login`.

***

## **Dashboard Implementation (Comprehensive)**

### **Dashboard Page Layout**

**Component Location**: `src/pages/Dashboard.tsx`.

**Layout Structure**: Full viewport height with flex column. Dashboard navigation at top (sticky), main content area (flex-1), optional sidebar on left for navigation/filters (hidden on mobile, visible on desktop).

**Data Fetching**: Use `useEffect` to fetch user's resumes on mount: `const { data } = await axios.get('/api/user/resumes')` with auth token in header. Store in state: `const [resumes, setResumes] = useState<Resume[]>([])`. Maintain `isLoading` state showing skeleton loaders while fetching. Handle errors with toast notification and retry button.

**Welcome Banner (First-time Users)**: If `resumes.length === 0` and URL has `?welcome=true`, show dismissible banner. Gradient background green-500 to blue-500, white text, padding-6, rounded-xl, margin-bottom-8. Message: "Welcome to ResumeCraft! 👋 Let's create your first resume. Choose 'Create New' to start from scratch or 'Upload Existing' to import your current resume.". Close button top-right removing welcome parameter from URL.

### **Dashboard Navigation Component**

**Component Location**: `src/components/dashboard/DashboardNav.tsx`.

**Navigation Bar**: White background, border-bottom border-gray-200, padding-y-4, sticky top-0, z-40. Max-width-7xl container with flex justify-between items-center.

**Left Section**: Logo and app name with back arrow button linking to homepage (only if user came from homepage). Breadcrumb navigation: "Dashboard" in gray-600, optional sub-page in gray-900 if on builder/analyzer.

**Center Section (Desktop)**: Navigation tabs: "My Resumes" (default), "Templates" (opens template gallery), "Settings" (user preferences). Active tab has green-600 color and bottom border. Hover effects on inactive tabs.

**Right Section**: User profile dropdown button showing user avatar (circular, 40px) and name. Clicking opens dropdown menu with: "Profile Settings" (edit name, email, password), "Billing" (if premium features exist), "Help & Support" link to docs, "Logout" button. Dropdown has white background, shadow-xl, rounded-lg, border border-gray-200. Logout calls `/api/auth/logout`, clears Redux state, removes token from localStorage, navigates to homepage with success toast "Logged out successfully".

**Notifications Icon**: Bell icon button with badge showing count if user has unread notifications (e.g., "Resume analyzed", "AI processing complete"). Clicking opens notifications dropdown similar to profile dropdown.

**Mobile View**: Hamburger menu icon opening drawer navigation. Drawer slides from right with full navigation options stacked vertically.

### **Stats Overview Component**

**Component Location**: `src/components/dashboard/StatsOverview.tsx`.

**Layout**: Grid with 1 column mobile, 2 tablet, 4 desktop. Gap-6 with margin-bottom-8.

**Stat Card Structure**: White background, rounded-xl, padding-6, border border-gray-200, hover shadow-lg transition. Each card has icon, label, value, and change indicator.

**Stat 1 - Total Resumes**: Icon: FileText in green-500 background circle. Label "Total Resumes" in text-sm gray-600. Value showing count (e.g., "8") in text-3xl font-bold gray-900. Change indicator "+2 this month" in text-xs text-green-600 with up arrow icon.

**Stat 2 - Avg ATS Score**: BarChart icon in blue-500 background. Label "Average ATS Score". Value calculated from all analyzed resumes (e.g., "76/100"). Progress bar below showing visual representation. Change "+8 points" in green.

**Stat 3 - Analyses Run**: Target icon in purple-500 background. Label "Analyses Run". Value showing total count (e.g., "24"). No change indicator (cumulative metric).

**Stat 4 - Public Resumes**: Eye icon in teal-500 background. Label "Public Resumes". Value showing count of public resumes (e.g., "3"). Change "+1 this week".

**Data Source**: Calculate stats from resumes array prop. Type interface: `StatsOverviewProps { resumes: Resume[] }`.

### **Quick Actions Component**

**Component Location**: `src/components/dashboard/QuickActions.tsx`.

**Layout**: Flex row with gap-4 on desktop, flex column on mobile. Margin-bottom-8.

**Primary Action - Create Resume**: Large button with gradient background green-500 to blue-500, white text, rounded-xl, padding-6, flex-1. Display Plus icon size-6 and text "Create New Resume" in text-lg font-semibold. Hover effect: scale-105, shadow-xl. Clicking opens `CreateResumeModal`.

**Secondary Action - Upload Resume**: Button with white background, green-600 border-2, green-600 text, same size as primary. Upload icon and "Upload Existing Resume" text. Hover: bg-green-50. Clicking opens `UploadResumeModal`.

**Tertiary Action - Browse Templates**: Ghost button (transparent background, gray-600 text, hover bg-gray-100). Eye icon and "Browse Templates" text. Navigates to templates page