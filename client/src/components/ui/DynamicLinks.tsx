import React, { useState } from 'react';
import { Link } from '../../../types';
import { Button } from './Button';
import { Input } from './Input';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

interface Props {
  links: Link[];
  onChange: (links: Link[]) => void;
}

export const DynamicLinks: React.FC<Props> = ({ links, onChange }) => {
  const safeLinks = Array.isArray(links) ? links : [];

  const handleAdd = () => {
    onChange([...safeLinks, { name: '', url: '' }]);
  };

  const handleUpdate = (index: number, field: keyof Link, value: string) => {
    const newLinks = [...safeLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  const handleRemove = (index: number) => {
    const newLinks = [...safeLinks];
    newLinks.splice(index, 1);
    onChange(newLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">Social Links</label>
        <Button size="sm" variant="ghost" onClick={handleAdd} type="button">
          <Plus size={14} className="mr-1" /> Add Link
        </Button>
      </div>
      
      <div className="space-y-3">
        {safeLinks.map((link, index) => (
          <div key={index} className="flex gap-2 items-start animate-in slide-in-from-left-2 duration-200">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                placeholder="Label (e.g. GitHub)"
                value={link.name}
                onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                className="h-9 text-sm"
              />
              <Input
                placeholder="URL (https://...)"
                value={link.url}
                onChange={(e) => handleUpdate(index, 'url', e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <button 
              onClick={() => handleRemove(index)}
              className="mt-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {safeLinks.length === 0 && (
          <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
             No links added yet.
          </div>
        )}
      </div>
    </div>
  );
};
