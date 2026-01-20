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