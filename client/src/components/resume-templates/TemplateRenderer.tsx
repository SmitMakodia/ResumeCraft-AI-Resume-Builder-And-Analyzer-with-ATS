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