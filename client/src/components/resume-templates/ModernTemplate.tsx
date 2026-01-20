import React from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Code, Link as LinkIcon, FolderGit2 } from 'lucide-react';
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