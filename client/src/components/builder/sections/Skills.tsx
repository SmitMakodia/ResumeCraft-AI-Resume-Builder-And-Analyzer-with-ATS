import React from 'react';
import { SkillLine } from '../../../types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  skills: SkillLine[];
  onChange: (skills: SkillLine[]) => void;
}

export const SkillsForm: React.FC<Props> = ({ skills, onChange }) => {
  // Ensure skills is always an array
  const safeSkills = Array.isArray(skills) ? skills : [];

  const handleAddLine = () => {
    onChange([...safeSkills, { heading: '', items: [] }]);
  };

  const handleRemoveLine = (index: number) => {
    const newSkills = [...safeSkills];
    newSkills.splice(index, 1);
    onChange(newSkills);
  };

  const handleUpdate = (index: number, field: keyof SkillLine, value: any) => {
    const newSkills = [...safeSkills];
    if (field === 'items') {
      // Split string by comma and trim
      const items = (value as string).split(',').map(s => s.trimStart()); // Preserve space after comma if typing
      // But for storage we might want to trim fully? 
      // User experience: if I type "Java, ", I expect to be able to type "Python".
      // If I trimEnd immediately, I might lose the space. 
      // Storing as array immediately is tricky for "comma separated input".
      // BETTER: Keep items as string[] but the input manages it.
      // Actually, for this specific requirements ("add as many skills... separated using commas"), 
      // a simple text input is best.
      newSkills[index] = { ...newSkills[index], items };
    } else {
      newSkills[index] = { ...newSkills[index], [field]: value };
    }
    onChange(newSkills);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Skills</h2>
        <Button onClick={handleAddLine} size="sm">
          <Plus size={16} className="mr-2" /> Add Skill Line
        </Button>
      </div>

      <div className="space-y-4">
        {safeSkills.map((line, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
            <button 
              onClick={() => handleRemoveLine(index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
            >
              <Trash2 size={16} />
            </button>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Heading (Optional, e.g. "Languages")
                </label>
                <Input 
                  placeholder="No Heading"
                  value={line.heading}
                  onChange={(e) => handleUpdate(index, 'heading', e.target.value)}
                  className="bg-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Skills (Comma separated)
                </label>
                <input 
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                  placeholder="Java, Python, React..."
                  value={line.items.join(', ')}
                  onChange={(e) => handleUpdate(index, 'items', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        {safeSkills.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            No skills added. Click "Add Skill Line" to start.
          </div>
        )}
      </div>
    </div>
  );
};
