import React, { useState } from 'react';
import { Project } from '../../../types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { BulletListEditor } from '../../ui/BulletListEditor';

interface Props {
  items: Project[];
  onChange: (items: Project[]) => void;
}

export const ProjectsForm: React.FC<Props> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const safeItems = Array.isArray(items) ? items : [];

  const handleAdd = () => {
    const newProj: Project = {
      id: uuidv4(),
      name: '',
      tools: [], // Array of strings
      date: '',
      description: [], 
      link: ''
    };
    onChange([newProj, ...safeItems]);
    setExpandedId(newProj.id);
  };

  const handleUpdate = (id: string, field: keyof Project, value: any) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemove = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Projects</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus size={16} className="mr-2" /> Add Project
        </Button>
      </div>

      <div className="space-y-4">
        {safeItems.map((proj) => (
          <div key={proj.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div 
              className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
            >
              <div>
                <h3 className="font-semibold text-gray-900">{proj.name || '(No Name)'}</h3>
                <p className="text-sm text-gray-500">
                  {proj.tools?.length > 0 ? proj.tools.join(', ') : '(No Tools)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemove(proj.id); }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                {expandedId === proj.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>
            </div>

            {expandedId === proj.id && (
              <div className="p-4 space-y-4 border-t border-gray-200">
                 <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Project Name" 
                    value={proj.name} 
                    onChange={(e) => handleUpdate(proj.id, 'name', e.target.value)}
                  />
                  <Input 
                    label="Date (Month Year)" 
                    value={proj.date} 
                    onChange={(e) => handleUpdate(proj.id, 'date', e.target.value)}
                    placeholder="Jan 2024"
                  />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tools Used (Comma separated)</label>
                    <input 
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="React, Node.js, MongoDB"
                      value={proj.tools?.join(', ') || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        // I'll split by comma.
                        handleUpdate(proj.id, 'tools', val.split(',')); 
                      }}
                    />
                 </div>

                 <Input 
                    label="Project Link (Optional)" 
                    value={proj.link} 
                    onChange={(e) => handleUpdate(proj.id, 'link', e.target.value)}
                    placeholder="https://..."
                 />
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (Bullet Points)</label>
                    <BulletListEditor 
                      items={proj.description || []}
                      onChange={(bullets) => handleUpdate(proj.id, 'description', bullets)}
                      placeholder="Describe the project features..."
                    />
                 </div>
              </div>
            )}
          </div>
        ))}
         {safeItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            No projects added yet.
          </div>
        )}
      </div>
    </div>
  );
};
