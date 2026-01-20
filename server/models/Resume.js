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