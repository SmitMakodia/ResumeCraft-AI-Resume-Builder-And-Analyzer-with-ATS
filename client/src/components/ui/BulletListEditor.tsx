import React, { useState, useRef } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { Button } from './Button';

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export const BulletListEditor: React.FC<Props> = ({ items, onChange, placeholder = "Add a bullet point..." }) => {
  const [newItem, setNewItem] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...safeItems, newItem.trim()]);
      setNewItem('');
      // Keep focus
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    const newItems = [...safeItems];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleEdit = (index: number, value: string) => {
    const newItems = [...safeItems];
    newItems[index] = value;
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {safeItems.map((item, index) => (
          <div key={index} className="flex items-start gap-2 group">
            <div className="mt-2 text-gray-400 cursor-move">
               <GripVertical size={14} />
            </div>
            <div className="flex-1">
               <textarea 
                  className="w-full text-sm border-b border-gray-200 focus:border-primary-500 outline-none py-1 bg-transparent resize-none h-auto overflow-hidden"
                  rows={1}
                  value={item}
                  onChange={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                    handleEdit(index, e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        // Optional: Insert new item after this one
                    }
                  }}
               />
            </div>
            <button 
              onClick={() => handleRemove(index)}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center mt-2">
        <input
          ref={inputRef}
          className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-100 outline-none"
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button size="sm" onClick={handleAdd} type="button" variant="secondary">
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};
