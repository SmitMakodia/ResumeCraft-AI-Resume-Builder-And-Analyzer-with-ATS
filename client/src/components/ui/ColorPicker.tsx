import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { Palette } from 'lucide-react';

interface Props {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<Props> = ({ color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const styles = {
    popover: {
      position: 'absolute' as 'absolute',
      zIndex: 200,
      right: 0,
      top: '100%',
      marginTop: '8px',
    },
    cover: {
      position: 'fixed' as 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setDisplayColorPicker(!displayColorPicker)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div 
          className="w-5 h-5 rounded-full border border-gray-200 shadow-sm" 
          style={{ backgroundColor: color }} 
        />
        <span className="text-sm font-medium text-gray-700">{color}</span>
      </button>

      {displayColorPicker && (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={() => setDisplayColorPicker(false)} />
          <ChromePicker 
            color={color} 
            onChange={(c) => onChange(c.hex)}
            disableAlpha
          />
        </div>
      )}
    </div>
  );
};
