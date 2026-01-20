import React, { useState } from 'react';
import { Resume } from '../../../types';
import { Button } from '../../ui/Button';
import { Sparkles } from 'lucide-react';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SummaryForm: React.FC<Props> = ({ value, onChange }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!value.trim()) {
      toast.error('Please write something first for AI to enhance.');
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await api.post('/ai/enhance-summary', { currentSummary: value });
      onChange(response.data.enhancedContent);
      toast.success('Summary enhanced!');
    } catch (error) {
      toast.error('Failed to enhance summary.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Professional Summary</h2>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleEnhance} 
          isLoading={isEnhancing}
          className="text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200"
        >
          <Sparkles size={16} className="mr-2" />
          AI Enhance
        </Button>
      </div>
      
      <textarea
        className="w-full h-48 rounded-lg border border-gray-300 p-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
        placeholder="Briefly describe your professional background and key achievements..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-gray-500 text-right">{value.length} characters</p>
    </div>
  );
};
