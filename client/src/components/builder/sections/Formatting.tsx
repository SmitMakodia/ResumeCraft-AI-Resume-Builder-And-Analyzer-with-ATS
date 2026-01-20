import React from 'react';
import { Formatting, Resume } from '../../../types';
import { ColorPicker } from '../../ui/ColorPicker';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckSquare, Square } from 'lucide-react';

interface Props {
  data: Resume;
  onChange: (data: Partial<Resume>) => void;
  onFormattingChange: (formatting: Partial<Formatting>) => void;
}

const SortableItem = ({ id, label }: { id: string, label: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg mb-2 shadow-sm cursor-move hover:border-primary-400 transition-colors">
      <GripVertical size={16} className="text-gray-400" />
      <span className="text-sm font-medium capitalize">{label}</span>
    </div>
  );
};

export const FormattingForm: React.FC<Props> = ({ data, onChange, onFormattingChange }) => {
  const formatting = data.formatting || {};
  const sectionOrder = formatting.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects'];
  const showIcons = data.personalInfo.showIcons !== false;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over?.id as string);
      onFormattingChange({ sectionOrder: arrayMove(sectionOrder, oldIndex, newIndex) });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold">Design & Formatting</h2>

      {/* Visibility Settings */}
      <div className="space-y-3">
         <label className="text-sm font-medium text-gray-700">Visual Elements</label>
         <button 
           onClick={() => onChange({ personalInfo: { ...data.personalInfo, showIcons: !showIcons } })}
           className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 transition-colors w-full p-2 border rounded-lg hover:bg-gray-50"
         >
           {showIcons ? <CheckSquare size={18} className="text-primary-600" /> : <Square size={18} />}
           Show Icons (Headers & Contact)
         </button>
      </div>

      <hr className="border-gray-100" />

      {/* Colors */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Accent Color</label>
        <ColorPicker 
          color={data.accentColor} 
          onChange={(color) => onChange({ accentColor: color })} 
        />
      </div>

      <hr className="border-gray-100" />

      {/* Layout */}
      <div className="space-y-4">
         <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Paper Size</label>
            <div className="flex gap-2">
               <button 
                 onClick={() => onFormattingChange({ paperSize: 'a4' })}
                 className={`flex-1 py-2 text-sm border rounded-lg transition-all ${formatting.paperSize === 'a4' ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium' : 'hover:bg-gray-50'}`}
               >
                 A4
               </button>
               <button 
                 onClick={() => onFormattingChange({ paperSize: 'letter' })}
                 className={`flex-1 py-2 text-sm border rounded-lg transition-all ${formatting.paperSize === 'letter' ? 'bg-primary-50 border-primary-500 text-primary-700 font-medium' : 'hover:bg-gray-50'}`}
               >
                 Letter
               </button>
            </div>
         </div>
      </div>

      <hr className="border-gray-100" />

      {/* Typography */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Font Family</label>
          <select 
            className="w-full text-sm border-gray-300 rounded-lg p-2 bg-white"
            value={formatting.fontFamily}
            onChange={(e) => onFormattingChange({ fontFamily: e.target.value })}
          >
            <option value="Inter">Inter (Modern)</option>
            <option value="Merriweather">Merriweather (Serif)</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Font Size</label>
          <select 
            className="w-full text-sm border-gray-300 rounded-lg p-2 bg-white"
            value={formatting.fontSize}
            onChange={(e) => onFormattingChange({ fontSize: e.target.value })}
          >
            <option value="small">Compact</option>
            <option value="medium">Standard</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      {/* Spacing Sliders */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-gray-700">Section Spacing</label>
            <span className="text-gray-500">{formatting.sectionSpacing}px</span>
          </div>
          <input 
            type="range" min="12" max="64" step="4"
            value={formatting.sectionSpacing}
            onChange={(e) => onFormattingChange({ sectionSpacing: parseInt(e.target.value) })}
            className="w-full accent-primary-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-gray-700">Line Spacing</label>
            <span className="text-gray-500">{formatting.lineHeight}</span>
          </div>
          <input 
            type="range" min="1" max="2" step="0.1"
            value={formatting.lineHeight}
            onChange={(e) => onFormattingChange({ lineHeight: parseFloat(e.target.value) })}
            className="w-full accent-primary-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-gray-700">Page Margins</label>
            <span className="text-gray-500">{formatting.margins}px</span>
          </div>
          <input 
            type="range" min="16" max="64" step="4"
            value={formatting.margins}
            onChange={(e) => onFormattingChange({ margins: parseInt(e.target.value) })}
            className="w-full accent-primary-600"
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Section Reordering */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Section Order (Drag to Reorder)</label>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
           <DndContext 
             sensors={sensors} 
             collisionDetection={closestCenter} 
             onDragEnd={handleDragEnd}
           >
             <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
               {sectionOrder.map(section => (
                 <SortableItem key={section} id={section} label={section} />
               ))}
             </SortableContext>
           </DndContext>
        </div>
      </div>
    </div>
  );
};