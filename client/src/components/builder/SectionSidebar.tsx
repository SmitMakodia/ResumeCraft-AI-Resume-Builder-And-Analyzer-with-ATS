import React from 'react';
import { User, Briefcase, GraduationCap, Code, FolderGit2, FileText, Palette, MonitorCheck } from 'lucide-react';
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
