import React, { useState } from 'react';
import { Experience } from '../../../types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { BulletListEditor } from '../../ui/BulletListEditor';

interface Props {
  items: Experience[];
  onChange: (items: Experience[]) => void;
}

export const ExperienceForm: React.FC<Props> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  // Ensure items is an array
  const safeItems = Array.isArray(items) ? items : [];

  const handleAdd = () => {
    const newExp: Experience = {
      id: uuidv4(),
      company: '',
      position: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      isCurrent: false,
      description: [], // Bullets
      achievements: []
    };
    onChange([newExp, ...safeItems]);
    setExpandedId(newExp.id);
  };

  const handleUpdate = (id: string, field: keyof Experience, value: any) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDateUpdate = (id: string, type: 'start' | 'end', field: 'month' | 'year', value: string) => {
    onChange(safeItems.map(item => {
      if (item.id !== id) return item;
      const dateKey = type === 'start' ? 'startDate' : 'endDate';
      return { ...item, [dateKey]: { ...item[dateKey], [field]: value } };
    }));
  };

  const handleRemove = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  const handleEnhance = async (exp: Experience) => {
    if (!exp.position || !exp.company) {
        toast.error('Please fill Position and Company first.');
        return;
    }
    setEnhancingId(exp.id);
    try {
      const response = await api.post('/ai/enhance-job-description', {
        description: exp.description,
        role: exp.position,
        company: exp.company
      });
      // AI now returns array of strings
      handleUpdate(exp.id, 'description', response.data.enhancedContent);
      toast.success('Description enhanced with bullets!');
    } catch (error) {
      toast.error('Failed to enhance description.');
    } finally {
      setEnhancingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Work Experience</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus size={16} className="mr-2" /> Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {safeItems.map((exp) => (
          <div key={exp.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div 
              className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            >
              <div>
                <h3 className="font-semibold text-gray-900">{exp.position || '(No Position)'}</h3>
                <p className="text-sm text-gray-500">{exp.company || '(No Company)'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemove(exp.id); }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                {expandedId === exp.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>
            </div>

            {expandedId === exp.id && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Position / Job Title" 
                    value={exp.position} 
                    onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)}
                  />
                  <Input 
                    label="Company Name" 
                    value={exp.company} 
                    onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                     <div className="flex gap-2">
                       <Input placeholder="Month" value={exp.startDate.month} onChange={(e) => handleDateUpdate(exp.id, 'start', 'month', e.target.value)} />
                       <Input placeholder="Year" value={exp.startDate.year} onChange={(e) => handleDateUpdate(exp.id, 'start', 'year', e.target.value)} />
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                     <div className="flex gap-2">
                       <Input 
                         placeholder="Month" 
                         value={exp.endDate.month} 
                         onChange={(e) => handleDateUpdate(exp.id, 'end', 'month', e.target.value)}
                         disabled={exp.isCurrent}
                       />
                       <Input 
                         placeholder="Year" 
                         value={exp.endDate.year} 
                         onChange={(e) => handleDateUpdate(exp.id, 'end', 'year', e.target.value)}
                         disabled={exp.isCurrent}
                       />
                     </div>
                     <label className="flex items-center gap-2 mt-2 text-sm text-gray-600 cursor-pointer select-none">
                       <input 
                         type="checkbox" 
                         checked={exp.isCurrent} 
                         onChange={(e) => handleUpdate(exp.id, 'isCurrent', e.target.checked)}
                         className="rounded text-primary-600 focus:ring-primary-500"
                       />
                       I currently work here
                     </label>
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Description (Bullet Points)</label>
                      <button 
                        onClick={() => handleEnhance(exp)}
                        disabled={enhancingId === exp.id}
                        className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium px-2 py-1 bg-purple-50 rounded-md transition-colors"
                      >
                         <Sparkles size={12} />
                         {enhancingId === exp.id ? 'Enhancing...' : 'Enhance with AI'}
                      </button>
                   </div>
                   <BulletListEditor 
                      items={exp.description || []}
                      onChange={(bullets) => handleUpdate(exp.id, 'description', bullets)}
                      placeholder="Add an achievement or responsibility..."
                   />
                </div>
              </div>
            )}
          </div>
        ))}
        {safeItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            No experience added yet.
          </div>
        )}
      </div>
    </div>
  );
};