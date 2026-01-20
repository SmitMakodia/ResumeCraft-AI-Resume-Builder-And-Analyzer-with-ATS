import React, { useEffect, useState } from 'react';
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
