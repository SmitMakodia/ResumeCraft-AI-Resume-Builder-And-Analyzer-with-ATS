import React, { useState } from 'react';
import { Education } from '../../../types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { BulletListEditor } from '../../ui/BulletListEditor';

interface Props {
  items: Education[];
  onChange: (items: Education[]) => void;
}

export const EducationForm: React.FC<Props> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const safeItems = Array.isArray(items) ? items : [];

  const handleAdd = () => {
    const newEdu: Education = {
      id: uuidv4(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      location: '',
      gpa: '',
      achievements: []
    };
    onChange([newEdu, ...safeItems]);
    setExpandedId(newEdu.id);
  };

  const handleUpdate = (id: string, field: keyof Education, value: any) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemove = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Education</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus size={16} className="mr-2" /> Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {safeItems.map((edu) => (
          <div key={edu.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div 
              className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
            >
              <div>
                <h3 className="font-semibold text-gray-900">{edu.institution || '(No Institution)'}</h3>
                <p className="text-sm text-gray-500">{edu.degree || '(No Degree)'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemove(edu.id); }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                {expandedId === edu.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>
            </div>

            {expandedId === edu.id && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                <Input 
                  label="Institution / School" 
                  value={edu.institution} 
                  onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                />
                <Input 
                  label="Location" 
                  value={edu.location} 
                  onChange={(e) => handleUpdate(edu.id, 'location', e.target.value)}
                  placeholder="City, State"
                />
                <div className="grid grid-cols-2 gap-4">
                   <Input 
                     label="Degree" 
                     value={edu.degree} 
                     onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                     placeholder="Bachelor of Science"
                   />
                   <Input 
                     label="Field of Study" 
                     value={edu.field} 
                     onChange={(e) => handleUpdate(edu.id, 'field', e.target.value)}
                     placeholder="Computer Science"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <Input 
                     label="Start Year" 
                     value={edu.startDate} 
                     onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                     placeholder="2020"
                   />
                   <Input 
                     label="End Year" 
                     value={edu.endDate} 
                     onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                     placeholder="2024"
                   />
                </div>
                <Input 
                   label="GPA (Optional)" 
                   value={edu.gpa} 
                   onChange={(e) => handleUpdate(edu.id, 'gpa', e.target.value)}
                   placeholder="3.8/4.0"
                />
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Achievements (Bullet Points)</label>
                   <BulletListEditor 
                      items={edu.achievements || []}
                      onChange={(bullets) => handleUpdate(edu.id, 'achievements', bullets)}
                      placeholder="Add an academic achievement..."
                   />
                </div>
              </div>
            )}
          </div>
        ))}
        {safeItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            No education added yet.
          </div>
        )}
      </div>
    </div>
  );
};