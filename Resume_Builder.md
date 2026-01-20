Now I'll create the comprehensive guide for the Resume Builder project:

***

# **Complete In-Depth Manual: Building an AI-Powered Resume Builder Application**

## **Project Overview and Architecture**

The AI-Powered Resume Builder is a full-stack MERN (MongoDB, Express, React, Node.js) application that enables users to create, customize, and share professional resumes online. Unlike the Resume Analyzer, this is a comprehensive resume creation platform with advanced features including multiple templates, real-time preview, AI-powered content enhancement, intelligent image processing, and public/private resume sharing.

### **Core Features**
Users can sign up and create multiple resumes from scratch or upload existing PDFs to extract and enhance content. The application provides four professional templates (Classic, Modern, Minimal, and Minimal Image) with customizable accent colors. Real-time preview shows changes instantly as users fill in information sections. AI integration enhances professional summaries and job descriptions using Google Gemini. Advanced image processing with ImageKit automatically focuses on faces and removes backgrounds. Resumes can be made public with shareable links or kept private, and downloaded as PDF files.

***

## **Technology Stack and Dependencies**

### **Frontend Technologies**
The frontend uses **Vite** as the build tool for fast development server startup and hot module replacement. **React** with JavaScript (not TypeScript in this project) handles the UI components. **React Router DOM** manages client-side routing between pages. **Tailwind CSS** provides utility-first styling with custom configurations. **Lucide React** supplies modern icon components throughout the interface. **Redux Toolkit** manages global state for authentication and user data. **Axios** handles HTTP requests to the backend API. **React Hot Toast** displays elegant notifications for user actions.

### **Backend Technologies**
The server runs on **Express.js** framework for handling HTTP requests and routing. **MongoDB with Mongoose** provides the NoSQL database and ODM for data modeling. **Bcrypt** encrypts user passwords before database storage. **JSON Web Tokens (JWT)** authenticate users and secure API endpoints. **Multer** middleware handles multipart/form-data for file uploads. **CORS** enables cross-origin requests between frontend and backend. **Dotenv** loads environment variables from .env files. **Nodemon** automatically restarts the server during development when files change. The **OpenAI SDK** integrates with Google Gemini API through OpenAI-compatible endpoints.

### **Third-Party Services**
**ImageKit.io** handles image uploads, transformations, face detection, and AI-powered background removal. It provides URL-based transformations including resize, crop, smart crop with face focus, format conversion, quality optimization, and AI background removal. **Google Gemini AI** (accessed via OpenAI-compatible API) enhances resume content including professional summaries and job descriptions. **Hostinger VPS** hosts the production deployment of both frontend and backend.

***

## **Development Environment Setup**

### **Project Initialization**
Create a root folder named "resume-builder" that will contain two subfolders: "client" for frontend and "server" for backend. Initialize the React project inside the client folder using `npm create vite@latest client`, selecting React as the framework and JavaScript as the variant. For the backend, create a server folder and initialize it with `npm init -y` to generate package.json.

### **Frontend Dependencies Installation**
Navigate to the client folder and install React Router DOM for navigation: `npm install react-router-dom`. Install Lucide React for icons: `npm install lucide-react`. Install Tailwind CSS and its dependencies: `npm install -D tailwindcss postcss autoprefixer` then run `npx tailwindcss init -p`. Install Redux Toolkit for state management: `npm install @reduxjs/toolkit react-redux`. Install Axios for API calls: `npm install axios`. Install React Hot Toast for notifications: `npm install react-hot-toast`.

### **Backend Dependencies Installation**
In the server folder, install Express framework: `npm install express`. Install database and authentication packages: `npm install mongoose bcryptjs jsonwebtoken`. Install utility packages: `npm install dotenv cors multer`. Install Nodemon as a development dependency: `npm install --save-dev nodemon`. Install OpenAI SDK for Gemini integration: `npm install openai`. Install ImageKit SDK: `npm install imagekit`.

### **Configuration Files**
In the client folder, configure Tailwind by importing it in `vite.config.js` plugins array and adding Tailwind directives to `index.css`. Update `index.html` to change the title and favicon. In the server folder, add `"type": "module"` to package.json to enable ES6 import syntax. Add npm scripts including `"start": "node server.js"` and `"server": "nodemon server.js"`.

### **Environment Variables**
Create a `.env` file in the server folder containing: MongoDB connection URI with username and password (ensure it ends with `.net` without trailing slash), JWT secret key for token signing, ImageKit public key, private key, and URL endpoint, OpenAI API key (Google Gemini key), and OpenAI model name (e.g., "gemini-1.5-flash").

### **Google Fonts Integration**
Search for the "Outfit" font on fonts.google.com. Click "Get font" then "Get embed code" and copy the import statement. Paste the import at the top of `index.css`. Apply the font globally using the CSS selector `* { font-family: 'Outfit', sans-serif; }`.

***

## **Project File Structure**

### **Client-Side Architecture**
The `src/` folder contains several subdirectories. The `pages/` folder holds route-level components including Home.jsx (marketing homepage), Login.jsx (authentication), Dashboard.jsx (user's resume list), ResumeBuilder.jsx (main builder interface), Preview.jsx (public resume view), and Layout.jsx (wrapper for authenticated routes).

The `components/` folder organizes reusable UI elements. A `home/` subfolder contains Banner.jsx, Hero.jsx, Features.jsx, Testimonials.jsx, CallToAction.jsx, and Footer.jsx for the marketing site. A `templates/` subfolder stores four resume template components: ClassicTemplate.jsx, ModernTemplate.jsx, MinimalTemplate.jsx, and MinimalImageTemplate.jsx. Additional components include PersonalInfoForm.jsx, ProfessionalSummaryForm.jsx, ExperienceForm.jsx, EducationForm.jsx, ProjectForm.jsx, SkillsForm.jsx for data input. Supporting components include ResumePreview.jsx, TemplateSelector.jsx, ColorPicker.jsx, ProgressBar.jsx, SectionNavigation.jsx, and Loader.jsx.

The `store/` folder contains Redux slices including authSlice.js for user authentication state. The `config/` folder holds axios.js for configuring the API client with base URL and interceptors. The `assets/` folder stores images, icons, and assets.js containing dummy data for development.

### **Server-Side Architecture**
The `models/` folder defines Mongoose schemas. User.js contains fields for name, email, encrypted password, and timestamps. Resume.js is the most complex model with fields for userId (reference to User), title, template type, accent color, personal info (nested object with full name, email, phone, location, profession, LinkedIn, website, image URL), professional summary (string), experience (array of objects with company, position, start date, end date, is current, description), education (array with institution, degree, field, graduation date, GPA), projects (array with name, type, description), skills (array of strings), public (boolean for sharing), and timestamps.

The `controllers/` folder contains business logic. authController.js handles user registration, login, and token generation. resumeController.js manages create resume, delete resume, get resume by ID, get public resume by ID, and update resume operations. aiController.js processes AI enhancement of professional summaries, enhance job descriptions, and upload existing resume with AI extraction.

The `routes/` folder defines API endpoints. authRoutes.js includes POST /register and POST /login endpoints. userRoutes.js includes GET /resumes to fetch user's resumes. resumeRoutes.js includes POST /create, DELETE /delete/:id, GET /get/:id, GET /public/:id, and PUT /update with file upload. aiRoutes.js includes POST /enhance-summary, POST /enhance-job-description, and POST /upload-resume.

The `middlewares/` folder contains reusable middleware functions. authMiddleware.js exports a `protect` function that verifies JWT tokens and adds userId to requests. upload.js configures Multer for handling file uploads using memory storage.

The `config/` folder stores configuration modules. db.js connects to MongoDB and handles connection events. imagekit.js initializes ImageKit client with credentials. ai.js configures OpenAI client pointing to Gemini's OpenAI-compatible endpoint.

***

## **Frontend Implementation**

### **Routing Configuration**
In `main.jsx`, wrap the App component with BrowserRouter from react-router-dom. In `App.jsx`, use Routes and Route components to define application routes. The homepage route (`/`) renders the Home component. The `/login` route displays the Login component with state parameter for register/login switching. Authenticated routes under `/app` use a Layout wrapper component. The index route renders Dashboard, while `/app/builder/:resumeId` renders ResumeBuilder. The `/view/:resumeId` route publicly displays resumes via the Preview component. The Layout component uses the Outlet component to render nested routes.

### **Homepage Components**

#### **Banner Component**
Create `Banner.jsx` in components/home/ displaying a notification banner at the top of the page. Use a flex container with centered content showing "NEW" badge and "AI Feature Added" text. Apply gradient background with green accent colors. Make it sticky or fixed to the top with appropriate z-index.

#### **Hero Section Component**
Create `Hero.jsx` with comprehensive navigation bar, welcome message, action buttons, and trusted brands section. The navigation bar includes a logo image on the left, desktop menu with Home, Features, Testimonials, Contact links that scroll to page sections using hash navigation. The right side has "Get Started" and "Login" buttons linking to `/app?state=register` and `/app?state=login` respectively. Implement mobile menu toggle with hamburger icon.

Display a large headline like "Land Your Dream Job with AI-Powered Resume". Add a subtitle paragraph explaining the value proposition. Include primary "Get Started" button and secondary "Learn More" button. Show user avatars with "Used by 10,000+ users" social proof. Display a grid of trusted brand logos at the bottom. Use green as the primary accent color replacing any default indigo colors.

#### **Features Section Component**
Create `Features.jsx` wrapped in a div with `id="features"` for hash navigation. Add a badge at the top saying "FEATURES" or "WHY CHOOSE US". Display a main heading and description paragraph. Create a grid of feature cards (typically 3-6 cards). Each card contains an icon from Lucide React, a heading, description text, and hover effects. Common features to highlight include multiple professional templates, real-time preview, AI content enhancement, easy customization, public sharing, PDF export, and mobile responsive design.

#### **Testimonials Section Component**
Create `Testimonials.jsx` with `id="testimonials"`. Display a section heading like "What Our Users Say". Create a grid of testimonial cards with user avatars (can use placeholder images or initials). Each card includes the user's name, job title/company, and testimonial quote. Add star ratings (5 stars typically). Apply hover effects and subtle shadows to cards.

#### **Call-to-Action Section Component**
Create `CallToAction.jsx` with `id="cta"`. Use a gradient background (green to blue or green to teal). Display a compelling headline like "Ready to Create Your Professional Resume?". Add a subtitle encouraging action. Include a prominent "Get Started Free" or "Create Your Resume" button linking to `/app`. Center all content and apply generous padding.

#### **Footer Component**
Create `Footer.jsx` with a dark background (gray-900 or black). Organize content in columns including: Company info with logo and tagline, Quick links (Home, Features, Pricing, Contact), Social media icons, Copyright notice. Add contact information if applicable. Use white or light gray text for contrast. Keep footer simple and professional.

### **Authentication System**

#### **Login Page Structure**
Create `Login.jsx` that handles both registration and login in a single component. Use `useSearchParams` from react-router-dom to detect the `state` parameter (register or login). Maintain local state for form inputs: name (for registration only), email, and password. Create a state variable `isLoading` to disable the form during API calls.

Render a centered card with gradient border. Display "Welcome Back" or "Create Account" heading based on state. Show email and password input fields (add name field for registration). Include a submit button that changes text to "Signing in..." or "Creating account..." when loading. Add a toggle link at the bottom like "Don't have an account? Sign up" that switches between states by updating the URL parameter.

#### **API Integration**
Create an Axios instance in `config/axios.js` with the base URL pointing to your backend (e.g., `http://localhost:3000/api` or production URL). Add request interceptors to attach JWT tokens to protected routes from Redux state. Add response interceptors to handle 401 unauthorized errors by clearing tokens and redirecting to login.

When the login form submits, call `/auth/login` endpoint with email and password. For registration, call `/auth/register` with name, email, and password. On successful authentication, store the received token and user data in Redux state. Show success toast notification and navigate to `/app` dashboard. Handle errors by displaying appropriate error messages via toast.

#### **Redux State Management**
Create `authSlice.js` in the store folder using `createSlice` from Redux Toolkit. Define initial state with `token: null`, `user: null`, `isAuthenticated: false`. Create reducers for `setCredentials` (stores token and user), `logout` (clears state), and `updateUser` (updates user info). Export actions and reducer. Configure the store in `store/index.js` with the auth reducer. Wrap the app with Provider in `main.jsx` passing the store.

### **Dashboard Implementation**

#### **Dashboard Layout**
Create `Dashboard.jsx` that fetches and displays all user's resumes. Use `useEffect` to call `/api/user/resumes` endpoint on component mount. Store resumes in component state. Display a page heading like "My Resumes". Show two action buttons: "Create Resume" opens a modal for new resume title input, "Upload Existing" opens a modal for title and PDF file upload.

#### **Resume List Display**
Render resumes in a grid layout (2-3 columns on desktop, 1 column on mobile). Each resume card shows: thumbnail image of the resume (generated from template), resume title, last modified date, template name, public/private status indicator. Add hover effects that slightly lift the card and show a shadow. Make each card clickable, navigating to `/app/builder/:resumeId`. Include a delete button (trash icon) on each card that confirms before calling the delete API.

#### **Create Resume Modal**
Implement a modal overlay that appears when "Create Resume" is clicked. Display an input field for resume title with placeholder "e.g., Frontend Developer Resume". Include "Cancel" and "Create Resume" buttons. When created, call `POST /api/resumes/create` with title. On success, navigate to `/app/builder/:newResumeId`. The backend creates a new resume document with default values and returns the ID.

#### **Upload Existing Resume Modal**
Similar modal structure with title input and file input field. Restrict file input to accept only PDFs using `accept="application/pdf"`. Display selected filename and file size. When "Upload Resume" is clicked, create FormData with title and PDF file. Call `POST /api/ai/upload-resume` endpoint. The backend extracts text from PDF using a library, sends it to Gemini AI to structure the data, and creates a new resume with pre-filled information. Show loading state with progress message. Navigate to the builder page with the new resume ID on success.

***

## **Resume Builder Interface**

### **Main Builder Layout**
Create `ResumeBuilder.jsx` as a two-panel layout. The left panel (60% width on desktop, full width on mobile) contains the data entry forms. The right panel (40% width on desktop, hidden on mobile, shown in a modal) displays the live resume preview. Use responsive design where mobile users can toggle between form and preview.

Extract `resumeId` from URL parameters using `useParams`. Fetch resume data on mount using `GET /api/resumes/get/:resumeId`. Store resume data in component state. Maintain additional state for `activeSection` (personal-info, summary, experience, education, projects, skills), `removeBackground` boolean, and `isLoading`.

### **Section Navigation System**
Create a `SectionNavigation.jsx` component displaying section indicators. Show six sections: Personal Info, Summary, Experience, Education, Projects, Skills. Highlight the active section with green color. Display section names and icons. Include "Previous" and "Next" buttons to navigate between sections. Handle first section (disable Previous) and last section (disable Next) appropriately.

Between the section buttons, render `TemplateSelector` and `ColorPicker` components. When Next is clicked, save current section data to state and increment activeSection. When Previous is clicked, decrement activeSection. Implement smooth scrolling to top when changing sections.

### **Progress Bar Component**
Create `ProgressBar.jsx` displaying visual progress through the six sections. Calculate progress as `(activeSection / 5) * 100` (0-based index). Render a container with light gray background. Inside, render a filled bar with green background and width equal to progress percentage. Add smooth transition animation when progress changes. Display "Step X of 6" text below the bar.

### **Personal Information Form**

#### **Form Structure**
Create `PersonalInfoForm.jsx` that receives `data`, `onChange`, `removeBackground`, and `setRemoveBackground` as props. Define a `fields` array containing configurations for each input. Each field object includes: key (e.g., "fullName"), label ("Full Name"), icon (User from Lucide), type ("text"), required (true/false).

Fields include: fullName, email (type "email"), phone (type "tel"), location, profession, linkedIn (type "url", required false), website (type "url", required false). Use `.map()` to render inputs dynamically from the fields array. Each input wraps in a label with the icon, label text, and required asterisk if applicable.

#### **Image Upload Feature**
Add a separate section at the top for profile image upload. Display current image if `data.image` exists, otherwise show placeholder with "Upload User Image" text. Use a hidden file input with `accept="image/*"`. When a file is selected, read it using FileReader and convert to base64 or store the File object in state. Display the selected image immediately for preview. Add a remove/delete button (X icon) to clear the image.

Include a toggle switch labeled "Remove Background". Use a checkbox styled as a toggle with green accent when enabled. Update `removeBackground` prop when toggled. This flag will be sent to the backend to trigger ImageKit's AI background removal.

#### **Input Handling**
Create a `handleChange` function that receives field name and value. Call the `onChange` prop function passing an object with the updated field. For example: `onChange({ ...data, [fieldName]: value })`. Implement real-time validation feedback showing error messages for invalid email, phone, or URL formats.

### **Professional Summary Form**
Create `ProfessionalSummaryForm.jsx` receiving `data`, `onChange`, and `setResumeData` props. Display a section heading "Professional Summary" with description "Summarize your professional background". Render a textarea with 7 rows, placeholder text, value bound to `data`, and onChange handler. Display character count below textarea (e.g., "150 / 500 characters").

Add an "AI Enhance" button with Sparkles icon. Maintain `isGenerating` state to show loading animation. When clicked, call a `generateSummary` function that: creates a prompt "Enhance my professional summary: [current text]", calls `POST /api/ai/enhance-summary` with the prompt, receives enhanced text from Gemini AI, updates the textarea value via `setResumeData`, shows success toast.

Display a loading animation (spinning icon) and "Enhancing..." text while the API call is in progress. Disable the button if textarea is empty or while generating. Show a tip at the bottom: "Tip: Write a brief summary highlighting your key skills and experience".

### **Experience Form Component**

#### **Data Structure**
Create `ExperienceForm.jsx` managing an array of experience objects. Each experience contains: company (string), position (string), startDate (object with year and month), endDate (object with year and month), isCurrent (boolean), description (string).

#### **Experience List Display**
Map over the `data` array (received as prop) to render each experience. For each entry, display: company name and position as headings, date range formatted as "Month Year - Month Year" or "Month Year - Present", job description, "Edit" and "Remove" buttons. Use card styling with borders and padding. Display "No experience added yet" message when array is empty.

#### **Add/Edit Experience Modal**
Clicking "Add Experience" opens a modal overlay. The modal contains: Company input field, Position input field, Start date dropdowns (year and month), End date dropdowns (year and month), "Currently working here" checkbox that disables end date when checked, Job description textarea, "AI Enhance" button for description.

Implement year dropdown with last 50 years. Implement month dropdown with all 12 months. When editing, pre-fill all fields with existing data. Include "Cancel" and "Save" buttons. When saved, add new object to array or update existing object at specific index.

#### **AI Description Enhancement**
Maintain `generatingIndex` state (initially -1) to track which experience is being enhanced. When "Enhance with AI" is clicked on a specific experience, set `generatingIndex` to that index. Create a prompt: `Enhance this job description: [description] for the position of [position] at [company]`. Call `POST /api/ai/enhance-job-description` with the prompt and auth token. Update only the description field of the specific experience with the enhanced text. Reset `generatingIndex` to -1 when complete. Show Loader2 icon with spin animation while `generatingIndex === currentIndex`.

### **Education Form Component**

#### **Education Structure**
Create `EducationForm.jsx` managing education array. Each education object contains: institution (string), degree (string), field (string for field of study), graduationDate (string or object), gpa (string, optional).

#### **Display and CRUD Operations**
Display education entries in cards showing institution name, degree and field, graduation date, GPA if provided. Include "Edit" and "Remove" buttons on each card. Clicking "Add Education" opens a modal with: Institution input, Degree input, Field of Study input, Graduation Date (month/year dropdowns), GPA input (optional, with placeholder "e.g., 3.8").

Validate that institution, degree, and field are required. Allow multiple education entries (typically for Bachelor's and Master's degrees). Sort entries by graduation date (most recent first) when displaying.

### **Projects Form Component**

#### **Project Structure**
Create `ProjectForm.jsx` managing projects array. Each project object contains: name (string), type (string like "Web Application", "Mobile App"), description (string).

#### **Project Cards and Modal**
Display project cards with project name as heading, type as subtitle, and description. Add "Edit" and "Remove" buttons. "Add Project" button opens modal with: Project Name input, Project Type input (can be text input or dropdown with common types), Project Description textarea (5-7 rows).

Consider adding optional fields like: project URL, technologies used (as an array or comma-separated string), duration. Show placeholder projects with example text when empty.

### **Skills Form Component**

#### **Skills Management**
Create `SkillsForm.jsx` managing skills as an array of strings. Display a text input field with placeholder "Enter a skill". Add "Add" button next to the input that adds the skill to the array when clicked or when Enter key is pressed. Implement `handleKeyPress` function to detect Enter key and call the add function.

#### **Skills Display**
Render added skills as pill/badge elements with the skill name and a remove button (X icon). Use flexbox with flex-wrap to display skills in rows. Apply green background with white text for skill pills. Each skill is clickable to remove via `removeSkill(index)` function.

Show empty state with Sparkles icon and message "No skills added yet. Add your technical and soft skills above". Display a tip at the bottom: "Tip: Add both technical skills (e.g., JavaScript, React) and soft skills (e.g., Leadership, Communication)". Prevent duplicate skills by checking if skill already exists before adding.

### **Template Selector Component**

#### **Template Management**
Create `TemplateSelector.jsx` receiving `selectedTemplate` and `onChange` props. Maintain `isOpen` state for dropdown visibility. Define `templates` array with objects containing: id ("classic", "modern", "minimal", "minimal-image"), name ("Classic", "Modern", etc.), preview (description text like "Traditional layout with clean sections").

#### **Dropdown UI**
Render a button with Layout icon and "Template" text. When clicked, toggle `isOpen` state. Display dropdown panel below button when open. Map over templates array to render each option as a card. Each card shows: template name as heading, preview description, checkmark icon if it's the selected template, green border if selected.

Clicking a template calls `onChange(template.id)` and closes dropdown. Apply hover effects to template cards. Position dropdown absolute relative to button.

### **Color Picker Component**

#### **Color Options**
Create `ColorPicker.jsx` receiving `selectedColor` and `onChange` props. Define `colors` array with objects containing: name ("Blue", "Green", "Pink", etc.), value (hex color code like "#3b82f6", "#10b981", "#ec4899"). Include 8-10 color options covering common resume color schemes.

#### **Color Grid Display**
Render a button with Palette icon and "Accent" text. Manage `isOpen` state for dropdown. Display color grid in a dropdown with 4 columns. Each color renders as a circular swatch with the background color. Show checkmark icon on the selected color. Display color name below swatch.

Clicking a color calls `onChange(color.value)` and closes dropdown. Apply the selected color to template elements dynamically via inline styles or CSS variables.

### **Resume Preview Component**

#### **Preview Structure**
Create `ResumePreview.jsx` receiving `data`, `template`, `accentColor`, and `className` props. The component renders inside a container with `id="resume-preview"` for print targeting. Apply white background and appropriate dimensions (A4 aspect ratio).

#### **Template Switching**
Implement `renderTemplate()` function using switch statement. Based on `template` prop, return the corresponding template component: `<ClassicTemplate data={data} accentColor={accentColor} />`. Each case handles "classic", "modern", "minimal", "minimal-image". Default case renders ClassicTemplate.

Add print-specific CSS inside a `<style jsx>` tag. Define `@media print` rules that hide non-resume elements, remove backgrounds, adjust margins, ensure single-page fit. Add `@page { size: A4; margin: 0; }` for proper PDF generation.

### **Template Components**

#### **Classic Template**
Create `ClassicTemplate.jsx` with traditional two-column layout. Left column (30% width) displays: profile image (circular), contact information (email, phone, location with icons), skills section (skills listed vertically). Right column (70% width) displays: name and profession as heading, professional summary paragraph, experience section (company, position, dates, description for each), education section (institution, degree, field, date), projects section (name, type, description).

Use accent color for: section headings, icons, horizontal dividers, skill bullets. Apply professional font sizing: name (32px), section headings (18px), body text (12px). Use subtle borders to separate sections.

#### **Modern Template**
Create `ModernTemplate.jsx` with contemporary design. Full-width header with: name (large, bold), profession, contact info in a single row with icons. Content flows in single column with: professional summary, experience, education, projects, skills.

Use accent color for: header background (light tint), section titles (bold with accent color), date labels, skill tags (border and text in accent). Implement card-style sections with subtle shadows. Use modern, spacious layout with generous padding.

#### **Minimal Template**
Create `MinimalTemplate.jsx` with clean, minimalist design. Header with name, profession, and contact info in streamlined format. Content in single column with minimal styling. Use accent color sparingly for: name text, section dividers (thin lines), bullet points.

Emphasize white space and typography. Use thin fonts for a light, modern feel. Keep layout extremely clean with no borders or backgrounds.

#### **Minimal Image Template**
Create `MinimalImageTemplate.jsx` extending Minimal design. Add profile image at the top center (circular, medium size). If `removeBackground` was enabled, the image has transparent background with accent color showing through (ImageKit feature).

Display name and profession below image. Arrange contact info in a centered row. Content flows below in single column. When accent color changes, the image background (if removed) changes to match. Apply accent color to image border, name text, and section headings.

***

## **Save and Update Functionality**

### **Save Resume Function**
Create `saveResume` function in ResumeBuilder component. Use try-catch for error handling. Create a deep copy of resume data: `let updatedResumeData = structuredClone(resumeData)`. Remove image from updated data if it exists as an object (we'll send it separately): `if (typeof resumeData.personalInfo.image === 'object') { delete updatedResumeData.personalInfo.image; }`.

Create FormData instance: `const formData = new FormData()`. Append resume ID: `formData.append('resumeId', resumeId)`. Append resume data as JSON string: `formData.append('resumeData', JSON.stringify(updatedResumeData))`. If `removeBackground` is true, append flag: `formData.append('removeBackground', 'yes')`. If image exists and is an object, append it: `formData.append('image', resumeData.personalInfo.image)`.

Make API call: `const { data } = await API.put('/api/resumes/update', formData, { headers: { Authorization: token } })`. Update local state with response: `setResumeData(data.resume)`. Show success toast: `toast.success(data.message)`. Catch errors and log to console.

### **Save Button Integration**
Add a "Save Changes" button visible in all sections. Apply primary button styling with green background. Use `toast.promise()` for enhanced UX showing "Saving...", "Saved successfully", or "Failed to save". Call `saveResume` function wrapped in toast.promise. Disable button while saving.

***

## **Backend Implementation**

### **Database Schema Design**

#### **User Model**
Create `models/User.js` defining the User schema. Fields include: name (String, required), email (String, required, unique, lowercase), password (String, required, minimum 6 characters), timestamps (createdAt, updatedAt). Create indexes on email for faster queries.

Add a pre-save hook that hashes the password using bcrypt before saving: `userSchema.pre('save', async function(next) { if (!this.isModified('password')) return next(); this.password = await bcrypt.hash(this.password, 10); next(); })`. Add a method to compare passwords: `userSchema.methods.comparePassword = async function(candidatePassword) { return await bcrypt.compare(candidatePassword, this.password); }`.

#### **Resume Model**
Create `models/Resume.js` with comprehensive schema. Required fields: userId (ObjectId, ref: 'User', required), title (String, default: 'Untitled Resume'). Customization fields: template (String, enum: ['classic', 'modern', 'minimal', 'minimal-image'], default: 'classic'), accentColor (String, default hex color).

Personal info nested object with fields for image (String URL), fullName, profession, email, phone, location, linkedIn, website (all String, defaults to empty). Professional summary (String, default empty). Skills array (type: [String], default: []).

Experience array containing objects with: company (String), position (String), startDate (object with year and month), endDate (object with year and month), isCurrent (Boolean, default false), description (String). Education array with objects containing: institution (String), degree (String), field (String), graduationDate (String), gpa (String). Projects array with: name (String), type (String), description (String).

Public visibility field: public (Boolean, default: false) for controlling shareable access. Add timestamps and export model.

### **Authentication Controller**

#### **User Registration**
Create `authController.js` with `register` function. Extract name, email, password from request body. Validate all fields are present, return 400 error if missing. Check if user already exists with email: `const existingUser = await User.findOne({ email })`. Return 400 error with message "User already exists" if found.

Create new user: `const user = await User.create({ name, email, password })` (password is auto-hashed by pre-save hook). Generate JWT token: `const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })`. Return response with status 201: `res.status(201).json({ message: 'User registered successfully', token, user: { id: user._id, name: user.name, email: user.email } })`.

#### **User Login**
Create `login` function in authController. Extract email and password from request body. Validate both are provided. Find user by email: `const user = await User.findOne({ email })`. Return 401 error if not found. Compare passwords: `const isMatch = await user.comparePassword(password)`. Return 401 error with "Invalid credentials" if passwords don't match.

Generate token and return successful response with token and user data. Handle errors in catch block, returning 500 status with error message.

### **Authentication Middleware**
Create `middlewares/authMiddleware.js` exporting `protect` function. Extract token from Authorization header: `const token = req.headers.authorization?.replace('Bearer ', '')`. Return 401 error if no token provided. Verify token: `const decoded = jwt.verify(token, process.env.JWT_SECRET)`. Attach userId to request object: `req.userId = decoded.userId`. Call `next()` to proceed to route handler. Catch JWT errors and return 401 with "Invalid or expired token".

### **Resume Controller**

#### **Create Resume**
Create `resumeController.js` with `createResume` function. Extract `userId` from `req.userId` (set by middleware). Extract `title` from request body. Create new resume: `const newResume = await Resume.create({ userId, title })`. Return response with status 201: `res.status(201).json({ message: 'Resume created successfully', resumeId: newResume._id })`. The resume is created with default values for all other fields.

#### **Get User Resumes**
Create `getUserResumes` function for fetching all resumes of logged-in user. Extract userId from request. Find all resumes: `const resumes = await Resume.find({ userId })`. Remove internal fields before sending: set `__v`, `createdAt`, `updatedAt` to undefined for each resume. Return resumes array with status 200.

#### **Get Resume by ID**
Create `getResumeById` function receiving resumeId from URL params. Extract userId from request. Find resume with both userId and resumeId: `const resume = await Resume.findOne({ _id: resumeId, userId })`. Return 404 error if not found. Remove internal fields and return resume with status 200. This ensures users can only access their own resumes.

#### **Get Public Resume**
Create `getPublicResumeById` function for viewing shared resumes. Only extract resumeId from params (no userId check). Find resume by ID: `const resume = await Resume.findById(resumeId)`. Return 404 if not found. Check if `resume.public === true`, return 403 error if private. Return resume data allowing public access when public flag is true.

#### **Delete Resume**
Create `deleteResume` function. Extract userId and resumeId. Find and delete: `const resume = await Resume.findOneAndDelete({ _id: resumeId, userId })`. Return 404 if not found. Return success message with status 200.

#### **Update Resume**
Create `updateResume` function handling complex update logic. Extract userId, and from request body extract: resumeId, resumeData, removeBackground. Extract image file from `req.file` (set by Multer middleware).

Check if resumeData is a string, parse it: `if (typeof resumeData === 'string') { resumeDataCopy = JSON.parse(resumeData); }`, otherwise use structured clone. If an image is provided and removeBackground is "yes", prepare ImageKit transformations.

Upload image to ImageKit with transformations: width and height, auto face focus (`fo-face`), zoom to 2, background removal (`bg-remove`). Store returned URL in `resumeDataCopy.personalInfo.image`. Update resume: `const updatedResume = await Resume.findOneAndUpdate({ _id: resumeId, userId }, resumeDataCopy, { new: true })`. Return updated resume with success message.

### **Multer Middleware Configuration**
Create `middlewares/upload.js` for file handling. Import multer. Configure memory storage: `const storage = multer.memoryStorage()` (stores files in memory as Buffer, suitable for immediate upload to cloud). Create upload instance: `const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 }, fileFilter: (req, file, cb) => { if (file.mimetype === 'applicape === 'application/pdf' || file.mimetype.startsWith('image/')) { cb(null, true); } else { cb(new Error('Only PDF and image files allowed')); } } })` . Export `upload.single('image')` middleware .

### **ImageKit Integration**

#### **ImageKit Configuration**
Create `config/imagekit.js`. Import ImageKit SDK. Initialize client: `const imagekit = new ImageKit({ publicKey: process.env.IMAGEKIT_PUBLIC_KEY, privateKey: process.env.IMAGEKIT_PRIVATE_KEY, urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT })`. Export imagekit instance.

Get API keys from imagekit.io dashboard. Public key is used for client-side requests, private key for server-side uploads. URL endpoint is your ImageKit account's base URL (e.g., `https://ik.imagekit.io/yourUsername`).

#### **Image Upload with Transformations**
In the updateResume controller, when processing image uploads: Check if file exists and removeBackground is true. Prepare transformation string: `tr=w-400,h-400,fo-face,z-2,bg-remove` where `w-400,h-400` resizes image, `fo-face` applies AI-powered face detection and focuses on it, `z-2` applies 2x zoom, `bg-remove` uses AI to remove background.

Upload to ImageKit: `const uploadResponse = await imagekit.upload({ file: req.file.buffer, fileName: \`resume-${Date.now()}.jpg\`, folder: '/resumes', transformation: { pre: 'w-400,h-400,fo-face,z-2,bg-remove' } })`. Store `uploadResponse.url` in resume data. ImageKit processes the image and returns a CDN URL with transformations applied.

### **AI Integration with Google Gemini**

#### **AI Configuration**
Create `config/ai.js`. Import OpenAI SDK. Initialize client pointing to Gemini's OpenAI-compatible endpoint: `const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' })`. The OPENAI_API_KEY in your .env should actually be your Google Gemini API key obtained from aistudio.google.com. Export ai instance.

#### **Enhance Professional Summary**
Create `aiController.js` with `enhanceProfessionalSummary` function. Extract `userContent` from request body (the user's current summary text). Validate it's provided, return 400 error if missing. Create AI chat completion:
```javascript
const response = await ai.chat.completions.create({
  model: process.env.OPENAI_MODEL, // e.g., "gemini-1.5-flash"
  messages: [
    { role: 'system', content: 'You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 statements highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Return only text, no other formatting.' },
    { role: 'user', content: userContent }
  ]
})
```
.

Extract enhanced content: `const enhancedContent = response.choices[0].message.content`. Return response: `res.status(200).json({ enhancedContent })`. Handle errors appropriately.

#### **Enhance Job Description**
Create `enhanceJobDescription` function similar to above. Use system message: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The description should be 1-2 sentences highlighting key responsibilities and achievements. Use action verbs and quantifiable results. Make it ATS-friendly and return only text.". Follow same pattern as enhance summary.

#### **Upload and Extract Resume**
Create `uploadResume` function for extracting data from PDF resumes. Extract `resumeText` (extracted PDF text) and `title` from request body. Validate both are provided. Create system prompt explaining data extraction: "You are an expert in resume analysis. Extract data from this resume text and provide it in the following JSON format..." followed by the exact JSON schema matching the Resume model structure.

Create user prompt: `Extract data from this resume: ${resumeText}. Provide data in the following JSON format with no additional text before or after: ${JSON.stringify(sampleSchema)}`. Make AI call with these prompts. Extract and parse the JSON response: `const extractedData = JSON.parse(response.choices[0].message.content)`.

Create new resume with extracted data: `const newResume = await Resume.create({ userId, title, ...extractedData })`. Return resumeId in response. Handle JSON parsing errors and AI timeouts.

### **Route Configuration**

#### **Auth Routes**
Create `routes/authRoutes.js`. Import express and controller functions. Create router: `const router = express.Router()`. Define routes: `router.post('/register', register)` and `router.post('/login', login)`. Export router.

#### **User Routes**
Create `routes/userRoutes.js`. Import router, protect middleware, and controller. Define protected route: `router.get('/resumes', protect, getUserResumes)`. Export router.

#### **Resume Routes**
Create `routes/resumeRoutes.js`. Import dependencies including upload middleware. Define routes:
- `router.post('/create', protect, createResume)`
- `router.delete('/delete/:id', protect, deleteResume)`
- `router.get('/get/:id', protect, getResumeById)`
- `router.get('/public/:id', getPublicResumeById)` (no protect middleware for public access)
- `router.put('/update', protect, upload.single('image'), updateResume)` (includes file upload middleware)

Export router.

#### **AI Routes**
Create `routes/aiRoutes.js`. Define protected routes:
- `router.post('/enhance-summary', protect, enhanceProfessionalSummary)`
- `router.post('/enhance-job-description', protect, enhanceJobDescription)`
- `router.post('/upload-resume', protect, uploadResume)`

Export router.

### **Main Server Configuration**
Create `server.js` in server root. Import dependencies: express, dotenv, cors, and routes. Configureonfigure dotenv: `dotenv.config()` . Create app: `const app = express()` . Set port: `const port = process.env.PORT || 3000` .

Add middleware: `app.use(express.json())` for parsing JSON, `app.use(cors())` for enabling CORS. Connect to database by calling the connectDB function. Register routes:
- `app.use('/api/auth', authRoutes)`
- `app.use('/api/user', userRoutes)`
- `app.use('/api/resumes', resumeRoutes)`
- `app.use('/api/ai', aiRoutes)`

Add home route: `app.get('/', (req, res) => res.send('Server is live'))`. Start server: `app.listen(port, () => console.log(\`Server running on port ${port}\`))`.

***

## **Advanced Features Implementation**

### **Public/Private Toggle**
In ResumeBuilder, create `changeResumeVisibility` function. Update resume data: `setResumeData({ ...resumeData, public: !resumeData.public })`. Make API call to save the change (using existing save function). Show toast notification indicating new status.

Add toggle button in the builder interface showing current status (Private/Public). Use Eye/EyeOff icons from Lucide React. When public, show additional "Share" button.

### **Share Functionality**
Create `handleShare` function that constructs shareable URL. Get frontend base URL: `const frontendURL = window.location.href.split('/app')[0]`. Construct resume URL: `const resumeURL = \`${frontendURL}/view/${resumeId}\``. Check if Navigator.share is supported. If supported, use: `navigator.share({ url: resumeURL, text: 'My Resume' })`. If not supported, copy URL to clipboard and show toast.

### **Download as PDF**
Create `downloadResume` function. Call `window.print()` which triggers the browser's print dialog. The print CSS (defined in ResumePreview) ensures only the resume content prints. Users can save as PDF through the print dialog. Add "Download" button with Download icon from Lucide React.

### **Preview Page Implementation**
Create `Preview.jsx` for public resume viewing. Extract resumeId from URL params. Create `isLoading` state. Fetch resume data: `const { data } = await API.get(\`/api/resumes/public/${resumeId}\`)`. Handle three states: loading (show Loader component), error/not found (show message with link to homepage), success (show ResumePreview component).

Apply simple layout with centered content and no navigation bars. Use full-width preview with print button. Include footer with "Create Your Resume" CTA linking to main site.

***

## **Testing and Quality Assurance**

### **Manual Testing Checklist**
Test complete user flow: register new account, create resume from scratch, fill all sections with data, test AI enhancement features, upload profile image with and without background removal, change templates and accent colors, save changes and verify persistence, make resume public and share link, download PDF and verify formatting, log out and verify shared link still works, test responsive design on mobile devices.

Test edge cases: extremely long text in fields, special characters in inputs, missing required fields, invalid URLs, large image uploads (near 20MB limit), rapid clicking of AI enhance buttons, concurrent editing, poor network conditions.

### **Error Handling**
Implement comprehensive try-catch blocks in all async functions. Display user-friendly error messages via toast notifications. Log detailed errors to console for debugging. Handle network errors gracefully with retry options. Validate all form inputs before submission. Provide loading states during API calls.

***

## **Deployment Process**

### **Frontend Deployment Preparation**
Update Axios base URL to point to production backend API. Build the frontend: `npm run build` in client folder. This generates optimized production files in `dist/` folder. Test the build locally: `npm run preview`. Ensure all environment-specific configurations are correct.

### **Backend Deployment Preparation**
Set up MongoDB Atlas production cluster with proper security settings. Add production server IP to MongoDB whitelist. Update .env file with production credentials. Test all API endpoints with production database. Ensure CORS is configured for production frontend domain.

### **VPS Deployment with Hostinger**
Purchase VPS hosting plan from Hostinger (KVM 1 or KVM 2 recommended). SSH into your VPS server. Ins. Install Node.js and npm: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -` then `sudo apt-get install -y nodejs` . Install PM2 globally: `npm install -g pm2` .

Clone your GitHub repository to the server. Navigate to server folder and install dependencies: `npm install`. Start backend with PM2: `pm2 start server.js --name resume-backend`. Save PM2 process list: `pm2 save`. Set PM2 to start on boot: `pm2 startup`.

Configure firewall: `sudo ufw allow 3000` (or your backend port). Install and configure Nginx as reverse proxy. Set up SSL certificate using Let's Encrypt. Deploy frontend build files to `/var/www/html` or configure Nginx to serve them. Configure Nginx to proxy API requests to backend port.

***

## **Additional Enhancements and Suggestions**

### **Feature Additions**
Implement resume versioning to track changes over time. Add export to Word document format. Create resume comparison feature showing changes between versions. Implement collaborative editing where mentors can provide feedback. Add resume analytics showing how many views shared resumes receive. Create premium templates with more sophisticated designs.

### **Technical Improvements**
Implement Redis caching for frequently accessed public resumes. Add rate limiting on AI endpoints to prevent abuse. Implement progressive image loading with placeholder effects. Add WebSocket support for real-time collaborative editing. Implement comprehensive unit and integration tests. Add CI/CD pipeline for automated testing and deployment.

### **UX Enhancements**
Add onboarding tutorial for first-time users. Implement autosave with debouncing to prevent data loss. Add keyboard shortcuts for power users. Implement drag-and-drop reordering of experience/education entries. Add resume completion percentage indicator. Provide AI-suggested improvements based on job descriptions.

***

## **Key Takeaways and Best Practices**

**Full-Stack Architecture**: This MERN stack application demonstrates proper separation of concerns with dedicated frontend and backend folders, clear API boundaries, and RESTful endpoint design.

**AI Integration**: Google Gemini enhances user experience by improving resume content automatically, but always allows users to review and modify AI suggestions.

**Image Processing**: ImageKit.io provides powerful real-time transformations including AI-powered face detection and background removal without backend processing burden.

**State Management**: Redux Toolkit simplifies authentication state management while local component state handles form data, finding the right balance between global and local state.

**Security**: JWT authentication protects API endpoints, password hashing prevents credential exposure, and file upload validation prevents malicious uploads.

**User Experience**: Real-time preview, autofocus on form inputs, loading states, error notifications, and responsive design create a polished application.

**Scalability**: MongoDB's flexible schema accommodates varying resume structures, ImageKit CDN delivers images globally, and the stateless API architecture supports horizontal scaling.

This comprehensive guide provides everything needed to build and deploy a production-ready AI-powered resume builder application from scratch.


---
---

# **ATS-Friendly Beautiful Resume Templates - Production Code**

Based on extensive research of ATS standards and modern design principles, here are complete, production-ready resume template components.

## **Key ATS Requirements Implemented**

1. **Single-column layout** - ATS systems parse single columns most accurately
2. **Standard section headings** - "Work Experience", "Education", "Skills" (not creative alternatives)
3. **Reverse chronological format** - Most recent experience first
4. **Clean, parseable text** - No images, tables, or complex graphics
5. **Standard fonts** - Arial, Calibri, Helvetica for ATS compatibility
6. **Consistent date formatting** - Clear employment timelines
7. **Natural keyword integration** - Job-specific terms without stuffing
8. **Spelled-out acronyms** - Full form followed by acronym in parentheses

***

## **Template 1: Professional Single-Column (Modern Elegant)**

This template balances ATS compliance with sophisticated design using typography, spacing, and subtle accents.

### **TypeScript Interface Definitions**

```typescript
// src/types/resume.ts

export interface PersonalInfo {
  fullName: string;
  profession: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  website?: string;
  image?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: {
    month: string;
    year: string;
  };
  endDate?: {
    month: string;
    year: string;
  };
  isCurrent: boolean;
  description: string;
  achievements?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Project {
  id: string;
  name: string;
  type: string;
  description: string;
  technologies?: string[];
  link?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  accentColor?: string;
}
```

### **Main Template Component**

```typescript
// src/components/templates/ModernElegantTemplate.tsx

import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe, 
  Calendar,
  Briefcase,
  GraduationCap,
  Code,
  Award
} from 'lucide-react';
import type { ResumeData } from '@/types/resume';

interface ModernElegantTemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const ModernElegantTemplate: React.FC<ModernElegantTemplateProps> = ({ 
  data, 
  accentColor = '#10b981' // Default green-500
}) => {
  // Format date for display
  const formatDate = (month?: string, year?: string): string => {
    if (!month || !year) return 'Present';
    return `${month} ${year}`;
  };

  // Calculate duration between dates
  const calculateDuration = (startDate: any, endDate: any, isCurrent: boolean): string => {
    const start = new Date(`${startDate.month} 1, ${startDate.year}`);
    const end = isCurrent ? new Date() : new Date(`${endDate?.month} 1, ${endDate?.year}`);
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  };

  return (
    <div 
      id="resume-preview"
      className="w-full max-w-[21cm] mx-auto bg-white shadow-2xl"
      style={{ 
        minHeight: '29.7cm',
        fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          #resume-preview {
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .no-print {
            display: none !important;
          }
          
          .page-break-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      {/* HEADER SECTION */}
      <header className="px-12 pt-12 pb-8 border-b-2" style={{ borderColor: accentColor }}>
        {/* Name and Title */}
        <div className="mb-6">
          <h1 
            className="text-5xl font-bold tracking-tight mb-2"
            style={{ 
              color: accentColor,
              letterSpacing: '-0.025em'
            }}
          >
            {data.personalInfo.fullName}
          </h1>
          <p className="text-2xl text-gray-700 font-light tracking-wide">
            {data.personalInfo.profession}
          </p>
        </div>

        {/* Contact Information - ATS-friendly text format */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Mail size={16} style={{ color: accentColor }} className="flex-shrink-0" />
            <span>{data.personalInfo.email}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone size={16} style={{ color: accentColor }} className="flex-shrink-0" />
            <span>{data.personalInfo.phone}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin size={16} style={{ color: accentColor }} className="flex-shrink-0" />
            <span>{data.personalInfo.location}</span>
          </div>
          
          {data.personalInfo.linkedIn && (
            <div className="flex items-center gap-2">
              <Linkedin size={16} style={{ color: accentColor }} className="flex-shrink-0" />
              <span className="break-all">{data.personalInfo.linkedIn}</span>
            </div>
          )}
          
          {data.personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe size={16} style={{ color: accentColor }} className="flex-shrink-0" />
              <span className="break-all">{data.personalInfo.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-12 py-8">
        
        {/* PROFESSIONAL SUMMARY */}
        {data.professionalSummary && (
          <section className="mb-10 page-break-avoid">
            <h2 
              className="text-xl font-bold mb-4 pb-2 border-b flex items-center gap-2"
              style={{ 
                borderColor: `${accentColor}40`,
                color: accentColor
              }}
            >
              <Award size={20} />
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {data.professionalSummary}
            </p>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-10">
            <h2 
              className="text-xl font-bold mb-6 pb-2 border-b flex items-center gap-2"
              style={{ 
                borderColor: `${accentColor}40`,
                color: accentColor
              }}
            >
              <Briefcase size={20} />
              WORK EXPERIENCE
            </h2>
            
            <div className="space-y-6">
              {data.experience
                .sort((a, b) => {
                  // Sort by start date, most recent first
                  const dateA = new Date(`${a.startDate.month} 1, ${a.startDate.year}`);
                  const dateB = new Date(`${b.startDate.month} 1, ${b.startDate.year}`);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((exp) => (
                  <div key={exp.id} className="page-break-avoid">
                    {/* Job Title and Company - Company name first for ATS */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {exp.position}
                        </h3>
                        <p className="text-base font-semibold" style={{ color: accentColor }}>
                          {exp.company}
                        </p>
                      </div>
                      
                      {/* Date Range - Right aligned for visual hierarchy */}
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span className="font-medium whitespace-nowrap">
                            {formatDate(exp.startDate.month, exp.startDate.year)} - {' '}
                            {exp.isCurrent ? 'Present' : formatDate(exp.endDate?.month, exp.endDate?.year)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {calculateDuration(exp.startDate, exp.endDate, exp.isCurrent)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Job Description */}
                    <div className="mt-3">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                      
                      {/* Key Achievements (if structured as array) */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {exp.achievements.map((achievement, idx) => (
                            <li 
                              key={idx} 
                              className="text-gray-700 leading-relaxed flex items-start gap-2"
                            >
                              <span 
                                className="inline-block w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                style={{ backgroundColor: accentColor }}
                              />
                              <span className="flex-1">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    {/* Subtle divider between experiences */}
                    {exp.id !== data.experience[data.experience.length - 1].id && (
                      <div 
                        className="mt-6 border-t"
                        style={{ borderColor: `${accentColor}20` }}
                      />
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <section className="mb-10">
            <h2 
              className="text-xl font-bold mb-6 pb-2 border-b flex items-center gap-2"
              style={{ 
                borderColor: `${accentColor}40`,
                color: accentColor
              }}
            >
              <GraduationCap size={20} />
              EDUCATION
            </h2>
            
            <div className="space-y-5">
              {data.education
                .sort((a, b) => {
                  // Sort by graduation date, most recent first
                  const dateA = new Date(a.graduationDate);
                  const dateB = new Date(b.graduationDate);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((edu) => (
                  <div key={edu.id} className="page-break-avoid">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {edu.degree}
                        </h3>
                        <p className="text-base font-semibold" style={{ color: accentColor }}>
                          {edu.institution}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {edu.field}
                        </p>
                      </div>
                      
                      {/* Graduation Date and GPA - Right aligned */}
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span className="font-medium whitespace-nowrap">
                            {edu.graduationDate}
                          </span>
                        </div>
                        {edu.gpa && (
                          <p className="text-sm font-semibold mt-1" style={{ color: accentColor }}>
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Academic Achievements */}
                    {edu.achievements && edu.achievements.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {edu.achievements.map((achievement, idx) => (
                          <li 
                            key={idx} 
                            className="text-gray-700 text-sm leading-relaxed flex items-start gap-2"
                          >
                            <span 
                              className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: accentColor }}
                            />
                            <span className="flex-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-10">
            <h2 
              className="text-xl font-bold mb-6 pb-2 border-b flex items-center gap-2"
              style={{ 
                borderColor: `${accentColor}40`,
                color: accentColor
              }}
            >
              <Code size={20} />
              PROJECTS
            </h2>
            
            <div className="space-y-5">
              {data.projects.map((project) => (
                <div key={project.id} className="page-break-avoid">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-600">
                        {project.type}
                      </p>
                    </div>
                    
                    {project.link && (
                      <div className="ml-4 flex-shrink-0">
                        <a 
                          href={project.link}
                          className="text-sm flex items-center gap-1 hover:underline"
                          style={{ color: accentColor }}
                        >
                          <Globe size={14} />
                          <span className="break-all">View Project</span>
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mt-2">
                    {project.description}
                  </p>
                  
                  {/* Technologies Used */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${accentColor}15`,
                            color: accentColor
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-xl font-bold mb-6 pb-2 border-b flex items-center gap-2"
              style={{ 
                borderColor: `${accentColor}40`,
                color: accentColor
              }}
            >
              <Award size={20} />
              SKILLS
            </h2>
            
            {/* ATS-friendly text-based skill list */}
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-gray-700 font-medium">
                    {skill}
                  </span>
                  {idx < data.skills.length - 1 && (
                    <span 
                      className="inline-block w-1 h-1 rounded-full self-center"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Alternative: Grouped skill display for better ATS parsing */}
            {/* <div className="space-y-3">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 mb-2">{category}:</h3>
                  <p className="text-gray-700">{skills.join(', ')}</p>
                </div>
              ))}
            </div> */}
          </section>
        )}
      </main>
    </div>
  );
};
```

### **Usage Example**

```typescript
// src/pages/ResumeBuilder.tsx or Preview component

import { ModernElegantTemplate } from '@/components/templates/ModernElegantTemplate';

// Sample data
const sampleResumeData: ResumeData = {
  personalInfo: {
    fullName: "Alexandra Martinez",
    profession: "Senior Full-Stack Developer",
    email: "alex.martinez@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedIn: "linkedin.com/in/alexandra-martinez",
    website: "alexandramartinez.dev"
  },
  professionalSummary: "Results-driven Full-Stack Developer with 6+ years of experience building scalable web applications using React, Node.js, and cloud technologies. Proven track record of leading development teams and delivering high-impact projects that increased user engagement by 40% and reduced operational costs by $500K annually. Expertise in microservices architecture, DevOps practices, and Agile methodologies.",
  experience: [
    {
      id: "1",
      company: "TechCorp Solutions",
      position: "Senior Full-Stack Developer",
      startDate: { month: "March", year: "2021" },
      endDate: { month: "", year: "" },
      isCurrent: true,
      description: "Lead development of enterprise SaaS platform serving 50,000+ users across 30 countries. Architected microservices infrastructure using Node.js, React, and AWS, resulting in 99.9% uptime and 60% improvement in application performance.",
      achievements: [
        "Reduced API response time by 75% through implementation of Redis caching and database query optimization",
        "Mentored team of 5 junior developers, improving code review efficiency by 40% and reducing bug count by 35%",
        "Implemented CI/CD pipeline using GitHub Actions and Docker, decreasing deployment time from 2 hours to 15 minutes",
        "Spearheaded migration to TypeScript, improving code maintainability and reducing runtime errors by 50%"
      ]
    },
    {
      id: "2",
      company: "StartupHub Inc.",
      position: "Full-Stack Developer",
      startDate: { month: "June", year: "2019" },
      endDate: { month: "February", year: "2021" },
      isCurrent: false,
      description: "Developed and maintained customer-facing web applications for fintech startup. Collaborated with product managers and designers to deliver features that increased user retention by 30%.",
      achievements: [
        "Built RESTful APIs serving 1M+ daily requests using Express.js and PostgreSQL",
        "Implemented real-time notifications using WebSockets, increasing user engagement by 25%",
        "Designed and developed responsive React components using Material-UI and styled-components",
        "Reduced page load time by 40% through code splitting, lazy loading, and image optimization techniques"
      ]
    },
    {
      id: "3",
      company: "Digital Agency Pro",
      position: "Frontend Developer",
      startDate: { month: "January", year: "2018" },
      endDate: { month: "May", year: "2019" },
      isCurrent: false,
      description: "Created responsive websites and web applications for diverse client portfolio including e-commerce, healthcare, and education sectors. Ensured cross-browser compatibility and adherence to accessibility standards (WCAG 2.1).",
      achievements: [
        "Developed 15+ client websites using React, Vue.js, and vanilla JavaScript",
        "Improved SEO rankings by implementing server-side rendering and semantic HTML",
        "Collaborated with UX designers to create pixel-perfect implementations of Figma designs"
      ]
    }
  ],
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      field: "Computer Science",
      graduationDate: "May 2017",
      gpa: "3.8/4.0",
      achievements: [
        "Dean's List all semesters",
        "President of Computer Science Student Association",
        "Published research paper on machine learning applications in healthcare"
      ]
    }
  ],
  projects: [
    {
      id: "1",
      name: "AI-Powered Task Manager",
      type: "Open Source Project",
      description: "Built intelligent task management application using React, FastAPI, and Google Gemini API. Features include natural language processing for task creation, priority recommendations, and automated deadline suggestions. Gained 2,000+ GitHub stars and 50+ contributors.",
      technologies: ["React", "TypeScript", "FastAPI", "Python", "Google Gemini", "PostgreSQL", "Docker"],
      link: "github.com/alex/ai-task-manager"
    },
    {
      id: "2",
      name: "E-Commerce Analytics Dashboard",
      type: "Freelance Client Project",
      description: "Developed comprehensive analytics dashboard for e-commerce platform processing $10M+ in annual transactions. Integrated with Shopify API to provide real-time insights on sales trends, customer behavior, and inventory management.",
      technologies: ["React", "Chart.js", "Node.js", "MongoDB", "Shopify API", "AWS Lambda"]
    }
  ],
  skills: [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue.js",
    "Node.js", "Express", "FastAPI", "Python", "Django",
    "HTML5", "CSS3", "Tailwind CSS", "Material-UI",
    "PostgreSQL", "MongoDB", "Redis", "MySQL",
    "AWS", "Docker", "Kubernetes", "CI/CD",
    "Git", "GitHub Actions", "Jest", "Cypress",
    "RESTful APIs", "GraphQL", "WebSockets",
    "Agile/Scrum", "Test-Driven Development (TDD)", "Microservices"
  ]
};

// In your component
function ResumePreview() {
  return (
    <ModernElegantTemplate 
      data={sampleResumeData}
      accentColor="#10b981" // green-500
    />
  );
}
```

***

## **Template 2: Minimal Professional (Ultra-Clean ATS)**

This template prioritizes maximum ATS compatibility with absolutely zero parsing ambiguity.

```typescript
// src/components/templates/MinimalProfessionalTemplate.tsx

import React from 'react';
import type { ResumeData } from '@/types/resume';

interface MinimalProfessionalTemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const MinimalProfessionalTemplate: React.FC<MinimalProfessionalTemplateProps> = ({ 
  data, 
  accentColor = '#2563eb' // Default blue-600
}) => {
  const formatDate = (month?: string, year?: string): string => {
    if (!month || !year) return 'Present';
    return `${month} ${year}`;
  };

  return (
    <div 
      id="resume-preview"
      className="w-full max-w-[21cm] mx-auto bg-white shadow-2xl"
      style={{ 
        minHeight: '29.7cm',
        fontFamily: '"Calibri", "Arial", sans-serif',
        fontSize: '11pt',
        lineHeight: '1.5'
      }}
    >
      <style jsx>{`
        @media print {
          #resume-preview {
            box-shadow: none !important;
            max-width: 100% !important;
          }
          
          @page {
            size: A4;
            margin: 1cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="p-16">
        {/* HEADER - Centered for classic professional look */}
        <header className="text-center mb-8 pb-6" style={{ borderBottom: `3px solid ${accentColor}` }}>
          <h1 
            className="text-4xl font-bold mb-2 tracking-wide"
            style={{ color: accentColor }}
          >
            {data.personalInfo.fullName.toUpperCase()}
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            {data.personalInfo.profession}
          </p>
          
          {/* Contact - Single line, pipe-separated for maximum ATS compatibility */}
          <p className="text-sm text-gray-600">
            {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}
            {data.personalInfo.linkedIn && ` | ${data.personalInfo.linkedIn}`}
            {data.personalInfo.website && ` | ${data.personalInfo.website}`}
          </p>
        </header>

        {/* PROFESSIONAL SUMMARY */}
        {data.professionalSummary && (
          <section className="mb-8">
            <h2 
              className="text-base font-bold uppercase mb-3 pb-1"
              style={{ 
                borderBottom: `2px solid ${accentColor}`,
                color: accentColor,
                letterSpacing: '0.05em'
              }}
            >
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-800 text-justify">
              {data.professionalSummary}
            </p>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-base font-bold uppercase mb-4 pb-1"
              style={{ 
                borderBottom: `2px solid ${accentColor}`,
                color: accentColor,
                letterSpacing: '0.05em'
              }}
            >
              WORK EXPERIENCE
            </h2>
            
            {data.experience
              .sort((a, b) => {
                const dateA = new Date(`${a.startDate.month} 1, ${a.startDate.year}`);
                const dateB = new Date(`${b.startDate.month} 1, ${b.startDate.year}`);
                return dateB.getTime() - dateA.getTime();
              })
              .map((exp, index) => (
                <div key={exp.id} className={index !== 0 ? "mt-6" : ""}>
                  {/* Job Title (most important for ATS) */}
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">
                      {exp.position}
                    </h3>
                    <span className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                      {formatDate(exp.startDate.month, exp.startDate.year)} – {' '}
                      {exp.isCurrent ? 'Present' : formatDate(exp.endDate?.month, exp.endDate?.year)}
                    </span>
                  </div>
                  
                  {/* Company Name */}
                  <p className="font-semibold mb-2" style={{ color: accentColor }}>
                    {exp.company}
                  </p>
                  
                  {/* Description as paragraph (ATS-friendly) */}
                  <p className="text-gray-700 mb-2">
                    {exp.description}
                  </p>
                  
                  {/* Achievements as bullet list */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-outside ml-5 space-y-1">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-gray-700">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </section>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-base font-bold uppercase mb-4 pb-1"
              style={{ 
                borderBottom: `2px solid ${accentColor}`,
                color: accentColor,
                letterSpacing: '0.05em'
              }}
            >
              EDUCATION
            </h2>
            
            {data.education
              .sort((a, b) => {
                const dateA = new Date(a.graduationDate);
                const dateB = new Date(b.graduationDate);
                return dateB.getTime() - dateA.getTime();
              })
              .map((edu, index) => (
                <div key={edu.id} className={index !== 0 ? "mt-4" : ""}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">
                      {edu.degree}
                    </h3>
                    <span className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                      {edu.graduationDate}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </span>
                  </div>
                  
                  <p className="font-semibold" style={{ color: accentColor }}>
                    {edu.institution}
                  </p>
                  
                  <p className="text-sm text-gray-600">
                    {edu.field}
                  </p>
                  
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                      {edu.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-gray-700 text-sm">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </section>
        )}

        {/* PROJECTS */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-base font-bold uppercase mb-4 pb-1"
              style={{ 
                borderBottom: `2px solid ${accentColor}`,
                color: accentColor,
                letterSpacing: '0.05em'
              }}
            >
              PROJECTS
            </h2>
            
            {data.projects.map((project, index) => (
              <div key={project.id} className={index !== 0 ? "mt-4" : ""}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">
                    {project.name}
                  </h3>
                  <span className="text-sm text-gray-600 ml-4">
                    {project.type}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-2">
                  {project.description}
                </p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Technologies:</span> {project.technologies.join(', ')}
                  </p>
                )}
                
                {project.link && (
                  <p className="text-sm" style={{ color: accentColor }}>
                    {project.link}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* SKILLS - Simple comma-separated for maximum ATS readability */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-4">
            <h2 
              className="text-base font-bold uppercase mb-3 pb-1"
              style={{ 
                borderBottom: `2px solid ${accentColor}`,
                color: accentColor,
                letterSpacing: '0.05em'
              }}
            >
              SKILLS
            </h2>
            <p className="text-gray-700">
              {data.skills.join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
```

***

## **Template 3: Executive Professional (Senior Roles)**

Perfect for senior positions with emphasis on achievements and leadership.

```typescript
// src/components/templates/ExecutiveProfessionalTemplate.tsx

import React from 'react';
import type { ResumeData } from '@/types/resume';

interface ExecutiveProfessionalTemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const ExecutiveProfessionalTemplate: React.FC<ExecutiveProfessionalTemplateProps> = ({ 
  data, 
  accentColor = '#7c3aed' // Default purple-600
}) => {
  const formatDate = (month?: string, year?: string): string => {
    if (!month || !year) return 'Present';
    return `${month} ${year}`;
  };

  // Group skills by category for executive presentation
  const categorizeSkills = (skills: string[]): Record<string, string[]> => {
    // This is a simplified example - you'd implement proper categorization logic
    return {
      "Technical": skills.filter(s => 
        ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker'].some(tech => 
          s.toLowerCase().includes(tech.toLowerCase())
        )
      ),
      "Leadership": skills.filter(s => 
        ['Agile', 'Scrum', 'Team', 'Management', 'Strategy'].some(lead => 
          s.toLowerCase().includes(lead.toLowerCase())
        )
      ),
      "Tools & Platforms": skills.filter(s => 
        ['Git', 'GitHub', 'JIRA', 'Confluence'].some(tool => 
          s.toLowerCase().includes(tool.toLowerCase())
        )
      )
    };
  };

  return (
    <div 
      id="resume-preview"
      className="w-full max-w-[21cm] mx-auto bg-white shadow-2xl"
      style={{ 
        minHeight: '29.7cm',
        fontFamily: '"Georgia", "Times New Roman", serif'
      }}
    >
      <style jsx>{`
        @media print {
          #resume-preview {
            box-shadow: none !important;
            max-width: 100% !important;
          }
          
          @page {
            size: A4;
            margin: 0.75cm;
          }
        }
      `}</style>

      {/* HEADER with distinctive top border */}
      <header 
        className="px-12 pt-10 pb-6 relative"
        style={{ 
          borderTop: `8px solid ${accentColor}`,
          background: `linear-gradient(to bottom, ${accentColor}08, transparent)`
        }}
      >
        <h1 
          className="text-5xl font-bold mb-3"
          style={{ 
            color: accentColor,
            fontFamily: '"Playfair Display", Georgia, serif'
          }}
        >
          {data.personalInfo.fullName}
        </h1>
        
        <p className="text-2xl text-gray-700 mb-4 font-light italic">
          {data.personalInfo.profession}
        </p>
        
        {/* Contact Information Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600 mt-6">
          <div>
            <span className="font-semibold">Email:</span> {data.personalInfo.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {data.personalInfo.phone}
          </div>
          <div>
            <span className="font-semibold">Location:</span> {data.personalInfo.location}
          </div>
          {data.personalInfo.linkedIn && (
            <div>
              <span className="font-semibold">LinkedIn:</span> {data.personalInfo.linkedIn}
            </div>
          )}
        </div>
      </header>

      <main className="px-12 py-6">
        {/* EXECUTIVE SUMMARY */}
        {data.professionalSummary && (
          <section className="mb-8">
            <h2 
              className="text-xl font-bold uppercase mb-4 tracking-wider"
              style={{ color: accentColor }}
            >
              Executive Summary
            </h2>
            <div 
              className="pl-6 border-l-4 py-2"
              style={{ borderColor: accentColor }}
            >
              <p className="text-gray-800 leading-relaxed italic text-justify">
                {data.professionalSummary}
              </p>
            </div>
          </section>
        )}

        {/* PROFESSIONAL EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-xl font-bold uppercase mb-6 tracking-wider"
              style={{ color: accentColor }}
            >
              Professional Experience
            </h2>
            
            {data.experience
              .sort((a, b) => {
                const dateA = new Date(`${a.startDate.month} 1, ${a.startDate.year}`);
                const dateB = new Date(`${b.startDate.month} 1, ${b.startDate.year}`);
                return dateB.getTime() - dateA.getTime();
              })
              .map((exp) => (
                <div key={exp.id} className="mb-7 pl-6 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                  {/* Position and Company on separate lines for emphasis */}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {exp.position}
                  </h3>
                  
                  <div className="flex justify-between items-baseline mb-3">
                    <p className="text-lg font-semibold" style={{ color: accentColor }}>
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-600 font-medium italic">
                      {formatDate(exp.startDate.month, exp.startDate.year)} – {' '}
                      {exp.isCurrent ? 'Present' : formatDate(exp.endDate?.month, exp.endDate?.year)}
                    </p>
                  </div>
                  
                  {/* Role description */}
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {exp.description}
                  </p>
                  
                  {/* Key Achievements with custom bullets */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Key Achievements:
                      </p>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span 
                              className="inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"
                              style={{ backgroundColor: accentColor }}
                            />
                            <span className="text-gray-700 leading-relaxed flex-1">
                              {achievement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </section>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-xl font-bold uppercase mb-6 tracking-wider"
              style={{ color: accentColor }}
            >
              Education
            </h2>
            
            {data.education
              .sort((a, b) => {
                const dateA = new Date(a.graduationDate);
                const dateB = new Date(b.graduationDate);
                return dateB.getTime() - dateA.getTime();
              })
              .map((edu) => (
                <div key={edu.id} className="mb-5 pl-6 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {edu.graduationDate}
                      {edu.gpa && (
                        <span className="ml-2 font-semibold" style={{ color: accentColor }}>
                          | GPA: {edu.gpa}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <p className="text-base font-semibold" style={{ color: accentColor }}>
                    {edu.institution}
                  </p>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {edu.field}
                  </p>
                  
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {edu.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span 
                            className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: accentColor }}
                          />
                          <span className="text-gray-700 text-sm">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </section>
        )}

        {/* TECHNICAL COMPETENCIES (categorized) */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-xl font-bold uppercase mb-6 tracking-wider"
              style={{ color: accentColor }}
            >
              Technical Competencies
            </h2>
            
            <div className="space-y-4 pl-6">
              {Object.entries(categorizeSkills(data.skills))
                .filter(([_, skills]) => skills.length > 0)
                .map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {category}:
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {skills.join(' • ')}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
```

***

## **Template 4: Tech-Focused (Developer/Engineer Roles)**

Optimized for technical roles with emphasis on projects and technologies.

```typescript
// src/components/templates/TechFocusedTemplate.tsx

import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import type { ResumeData } from '@/types/resume';

interface TechFocusedTemplateProps {
  data: ResumeData;
  accentColor?: string;
}

export const TechFocusedTemplate: React.FC<TechFocusedTemplateProps> = ({ 
  data, 
  accentColor = '#0ea5e9' // Default cyan-500
}) => {
  const formatDate = (month?: string, year?: string): string => {
    if (!month || !year) return 'Present';
    return `${month.substring(0, 3)} ${year}`;
  };

  // Extract technical skills separately
  const technicalSkills = data.skills.filter(skill => 
    !['Agile', 'Scrum', 'Leadership', 'Communication', 'Teamwork'].includes(skill)
  );
  
  const softSkills = data.skills.filter(skill => 
    ['Agile', 'Scrum', 'Leadership', 'Communication', 'Teamwork'].includes(skill)
  );

  return (
    <div 
      id="resume-preview"
      className="w-full max-w-[21cm] mx-auto bg-white shadow-2xl"
      style={{ 
        minHeight: '29.7cm',
        fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace'
      }}
    >
      <style jsx>{`
        @media print {
          #resume-preview {
            box-shadow: none !important;
          }
          
          @page {
            size: A4;
            margin: 0.5cm;
          }
        }
        
        .tech-tag {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
          font-size: 0.8rem;
        }
      `}</style>

      {/* HEADER with monospace aesthetic */}
      <header className="px-10 pt-8 pb-6" style={{ backgroundColor: `${accentColor}10` }}>
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-1 h-12 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <div>
            <h1 
              className="text-4xl font-bold tracking-tight"
              style={{ color: accentColor }}
            >
              {data.personalInfo.fullName}
            </h1>
            <p className="text-lg text-gray-700 font-mono">
              &lt; {data.personalInfo.profession} /&gt;
            </p>
          </div>
        </div>
        
        {/* Contact in code-like format */}
        <div className="mt-4 text-sm font-mono text-gray-600 space-y-1">
          <div>
            <span style={{ color: accentColor }}>const</span> email = "{data.personalInfo.email}";
          </div>
          <div>
            <span style={{ color: accentColor }}>const</span> phone = "{data.personalInfo.phone}";
          </div>
          <div>
            <span style={{ color: accentColor }}>const</span> location = "{data.personalInfo.location}";
          </div>
          {data.personalInfo.linkedIn && (
            <div>
              <span style={{ color: accentColor }}>const</span> linkedIn = "{data.personalInfo.linkedIn}";
            </div>
          )}
          {data.personalInfo.website && (
            <div>
              <span style={{ color: accentColor }}>const</span> website = "{data.personalInfo.website}";
            </div>
          )}
        </div>
      </header>

      <main className="px-10 py-6">
        {/* PROFESSIONAL SUMMARY */}
        {data.professionalSummary && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold uppercase mb-3 font-mono"
              style={{ color: accentColor }}
            >
              // ABOUT
            </h2>
            <p className="text-gray-800 leading-relaxed pl-4 border-l-2" style={{ borderColor: accentColor }}>
              {data.professionalSummary}
            </p>
          </section>
        )}

        {/* TECHNICAL SKILLS - Prominent for technical roles */}
        {technicalSkills.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold uppercase mb-3 font-mono"
              style={{ color: accentColor }}
            >
              // TECH_STACK
            </h2>
            <div className="flex flex-wrap gap-2 pl-4">
              {technicalSkills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="tech-tag px-3 py-1 rounded border font-mono"
                  style={{ 
                    borderColor: accentColor,
                    color: accentColor,
                    backgroundColor: `${accentColor}10`
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS - Featured prominently */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold uppercase mb-4 font-mono"
              style={{ color: accentColor }}
            >
              // PROJECTS
            </h2>
            
            <div className="space-y-5 pl-4">
              {data.projects.map((project) => (
                <div key={project.id} className="border-l-2 pl-4 pb-4" style={{ borderColor: `${accentColor}40` }}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {project.name}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      {project.link && (
                        <a 
                          href={project.link}
                          className="flex items-center gap-1 text-xs font-mono hover:underline"
                          style={{ color: accentColor }}
                        >
                          <Github size={14} />
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 font-mono mb-2">
                    {project.type}
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed mb-3 text-sm">
                    {project.description}
                  </p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded font-mono"
                          style={{ 
                            backgroundColor: `${accentColor}15`,
                            color: accentColor
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold uppercase mb-4 font-mono"
              style={{ color: accentColor }}
            >
              // EXPERIENCE
            </h2>
            
            <div className="space-y-5 pl-4">
              {data.experience
                .sort((a, b) => {
                  const dateA = new Date(`${a.startDate.month} 1, ${a.startDate.year}`);
                  const dateB = new Date(`${b.startDate.month} 1, ${b.startDate.year}`);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((exp) => (
                  <div key={exp.id} className="border-l-2 pl-4" style={{ borderColor: `${accentColor}40` }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          {exp.position}
                        </h3>
                        <p className="text-base font-semibold" style={{ color: accentColor }}>
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-gray-600 whitespace-nowrap ml-4">
                        {formatDate(exp.startDate.month, exp.startDate.year)} – {' '}
                        {exp.isCurrent ? 'Present' : formatDate(exp.endDate?.month, exp.endDate?.year)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed text-sm mb-2">
                      {exp.description}
                    </p>
                    
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-1 text-sm">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span style={{ color: accentColor }}>▹</span>
                            <span className="text-gray-700 flex-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <section className="mb-6">
            <h2 
              className="text-lg font-bold uppercase mb-4 font-mono"
              style={{ color: accentColor }}
            >
              // EDUCATION
            </h2>
            
            <div className="space-y-4 pl-4">
              {data.education
                .sort((a, b) => {
                  const dateA = new Date(a.graduationDate);
                  const dateB = new Date(b.graduationDate);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((edu) => (
                  <div key={edu.id} className="border-l-2 pl-4" style={{ borderColor: `${accentColor}40` }}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 text-base">
                        {edu.degree}
                      </h3>
                      <span className="text-xs font-mono text-gray-600 ml-4">
                        {edu.graduationDate}
                        {edu.gpa && ` | GPA: ${edu.gpa}`}
                      </span>
                    </div>
                    <p className="font-semibold text-sm" style={{ color: accentColor }}>
                      {edu.institution}
                    </p>
                    <p className="text-xs text-gray-600">{edu.field}</p>
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
```

***

## **Utility Functions and Helpers**

```typescript
// src/utils/resumeHelpers.ts

import type { ResumeData } from '@/types/resume';

/**
 * Validates resume data completeness for ATS optimization
 */
export const validateResumeCompleteness = (data: ResumeData): {
  isComplete: boolean;
  missingFields: string[];
  score: number;
} => {
  const missingFields: string[] = [];
  let score = 0;
  const totalFields = 7;

  // Check essential fields
  if (data.personalInfo.fullName) score += 1;
  else missingFields.push('Full Name');

  if (data.personalInfo.email) score += 1;
  else missingFields.push('Email');

  if (data.professionalSummary) score += 1;
  else missingFields.push('Professional Summary');

  if (data.experience && data.experience.length > 0) score += 1;
  else missingFields.push('Work Experience');

  if (data.education && data.education.length > 0) score += 1;
  else missingFields.push('Education');

  if (data.skills && data.skills.length >= 5) score += 1;
  else missingFields.push('Skills (minimum 5)');

  if (data.projects && data.projects.length > 0) score += 1;
  else missingFields.push('Projects');

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    score: Math.round((score / totalFields) * 100)
  };
};

/**
 * Exports resume data to ATS-friendly plain text format
 */
export const exportToPlainText = (data: ResumeData): string => {
  let text = '';

  // Header
  text += `${data.personalInfo.fullName.toUpperCase()}\n`;
  text += `${data.personalInfo.profession}\n`;
  text += `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}\n`;
  if (data.personalInfo.linkedIn) text += `LinkedIn: ${data.personalInfo.linkedIn}\n`;
  if (data.personalInfo.website) text += `Website: ${data.personalInfo.website}\n`;
  text += '\n';

  // Professional Summary
  if (data.professionalSummary) {
    text += 'PROFESSIONAL SUMMARY\n';
    text += `${data.professionalSummary}\n\n`;
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    text += 'WORK EXPERIENCE\n\n';
    data.experience.forEach(exp => {
      text += `${exp.position}\n`;
      text += `${exp.company}\n`;
      text += `${exp.startDate.month} ${exp.startDate.year} - ${exp.isCurrent ? 'Present' : `${exp.endDate?.month} ${exp.endDate?.year}`}\n`;
      text += `${exp.description}\n`;
      if (exp.achievements) {
        exp.achievements.forEach(ach => {
          text += `• ${ach}\n`;
        });
      }
      text += '\n';
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    text += 'EDUCATION\n\n';
    data.education.forEach(edu => {
      text += `${edu.degree}\n`;
      text += `${edu.institution}\n`;
      text += `${edu.field} | ${edu.graduationDate}`;
      if (edu.gpa) text += ` | GPA: ${edu.gpa}`;
      text += '\n\n';
    });
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    text += 'PROJECTS\n\n';
    data.projects.forEach(proj => {
      text += `${proj.name} (${proj.type})\n`;
      text += `${proj.description}\n`;
      if (proj.technologies) {
        text += `Technologies: ${proj.technologies.join(', ')}\n`;
      }
      text += '\n';
    });
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    text += 'SKILLS\n';
    text += `${data.skills.join(', ')}\n`;
  }

  return text;
};

/**
 * Calculates reading time for resume (should be under 30 seconds)
 */
export const calculateReadingTime = (data: ResumeData): number => {
  const wordsPerMinute = 250;
  let totalWords = 0;

  totalWords += data.professionalSummary?.split(' ').length || 0;
  data.experience?.forEach(exp => {
    totalWords += exp.description.split(' ').length;
    exp.achievements?.forEach(ach => {
      totalWords += ach.split(' ').length;
    });
  });

  return Math.ceil(totalWords / wordsPerMinute);
};
```

***

## **Key ATS Design Principles Implemented**

### **Typography Hierarchy**
- **Headers**: 18-24pt, bold, accent color
- **Job Titles**: 14-16pt, bold, black
- **Body Text**: 11-12pt, regular weight
- **Dates**: 10-11pt, gray color, right-aligned

### **Spacing Standards**
- **Sections**: 24-32pt margin between
- **Entries**: 16-20pt margin between items
- **Line Height**: 1.5-1.7 for readability
- **Margins**: Minimum 0.5in (1.27cm) all sides

### **ATS-Friendly Elements**
✅ Single-column layout
✅ Standard section headings
✅ Text-based content (no images in content area)
✅ Clear date formatting
✅ Reverse chronological order
✅ Standard fonts
✅ Bullet points using HTML lists
✅ No tables in main content
✅ No headers/footers with content
✅ No text boxes or graphics

### **Visual Enhancement (ATS-Safe)**
✅ Color accents for headings only
✅ Borders and dividers using CSS
✅ Icons as decorative elements (with text labels)
✅ Spacing and white space for hierarchy
✅ Typography variation
✅ Subtle background colors

These templates achieve the perfect balance: **beautiful enough to impress human recruiters** while remaining **100% parseable by ATS systems**.