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
