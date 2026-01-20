import React, { useState } from 'react';
import { ScoreCircle } from './ScoreCircle';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, XCircle, Lightbulb } from 'lucide-react';
import { cn } from '../ui/Button';

interface CategoryFeedback {
  score: number;
  feedback: string[];
}

export interface AnalysisData {
  score: number;
  summary: string;
  categories: {
    tone_style: CategoryFeedback;
    content: CategoryFeedback;
    structure: CategoryFeedback;
    skills: CategoryFeedback;
  };
  keywords: {
    missing: string[];
    present: string[];
  };
  improvements: string[];
  suggestions?: string[]; // New optional field
}

// Simple Markdown Renderer for **bold**
const MarkdownText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const CategoryAccordion = ({ title, data }: { title: string, data: CategoryFeedback }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (s >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn("px-3 py-1 rounded-full text-xs font-bold border", getColor(data.score))}>
            {data.score}/100
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <ul className="space-y-2">
            {data.feedback.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="mt-0.5 text-blue-500">•</span>
                <MarkdownText text={item} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const AnalysisResult: React.FC<{ data: AnalysisData }> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Top Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-8">
        <ScoreCircle score={data.score} size={160} strokeWidth={12} />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ATS Compatibility Score</h2>
          <p className="text-gray-600 leading-relaxed"><MarkdownText text={data.summary} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="text-primary-600" size={20} /> Category Breakdown
          </h3>
          <CategoryAccordion title="Tone & Style" data={data.categories.tone_style} />
          <CategoryAccordion title="Content Relevance" data={data.categories.content} />
          <CategoryAccordion title="Structure & Formatting" data={data.categories.structure} />
          <CategoryAccordion title="Skills Match" data={data.categories.skills} />
        </div>

        {/* Keywords & Improvements */}
        <div className="space-y-8">
           {/* Keywords */}
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Keywords Analysis</h3>
              
              <div className="mb-4">
                <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                   <XCircle size={14} /> Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.missing.length > 0 ? data.keywords.missing.map((k, i) => (
                    <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md border border-red-100">{k}</span>
                  )) : <span className="text-gray-400 text-sm">None! Good job.</span>}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                   <CheckCircle size={14} /> Present Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.present.map((k, i) => (
                    <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">{k}</span>
                  ))}
                </div>
              </div>
           </div>

           {/* Improvements */}
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-600">
                 <AlertCircle className="text-orange-500" size={20} /> Key Improvements
              </h3>
              <ul className="space-y-3">
                 {data.improvements.map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-100">
                      <span className="font-bold text-orange-500 mt-0.5">{i + 1}.</span>
                      <div><MarkdownText text={item} /></div>
                   </li>
                 ))}
              </ul>
           </div>

           {/* Suggestions (New Section) */}
           {data.suggestions && data.suggestions.length > 0 && (
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-600">
                   <Lightbulb className="text-purple-500" size={20} /> Expert Suggestions
                </h3>
                <ul className="space-y-3">
                   {data.suggestions.map((item, i) => (
                     <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <span className="font-bold text-purple-500 mt-0.5">✦</span>
                        <div><MarkdownText text={item} /></div>
                     </li>
                   ))}
                </ul>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};