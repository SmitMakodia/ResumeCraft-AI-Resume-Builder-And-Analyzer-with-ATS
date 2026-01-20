import React from 'react';
import { Resume } from '../../../types';
import { Input } from '../../ui/Input';
import { Upload, X } from 'lucide-react';
import { DynamicLinks } from '../../ui/DynamicLinks';

interface Props {
  data: Resume['personalInfo'];
  onChange: (data: Partial<Resume['personalInfo']>) => void;
  onImageUpload: (file: File) => void;
}

export const PersonalInfoForm: React.FC<Props> = ({ data, onChange, onImageUpload }) => {
  const handleChange = (field: keyof Resume['personalInfo'], value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold">Personal Information</h2>
      </div>
      
      {/* Image Upload */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shadow-sm">
            {data.image ? (
               <img src={data.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
               <Upload className="text-gray-300" size={32} />
            )}
          </div>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            accept="image/*"
            onChange={handleFileChange}
          />
          {data.image && (
             <button 
               onClick={() => handleChange('image', '')}
               className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 z-20 shadow-md hover:bg-red-600"
             >
               <X size={12} />
             </button>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Profile Photo</p>
          <p className="text-sm text-gray-500 mb-2">Recommended: Square JPG/PNG, max 2MB.</p>
          <div className="flex gap-2">
            <label className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm">
               Upload New
               <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Full Name" 
          value={data.fullName} 
          onChange={(e) => handleChange('fullName', e.target.value)} 
          placeholder="John Doe"
        />
        <Input 
          label="Job Title / Profession" 
          value={data.profession} 
          onChange={(e) => handleChange('profession', e.target.value)} 
          placeholder="Software Engineer"
        />
        <Input 
          label="Email" 
          value={data.email} 
          onChange={(e) => handleChange('email', e.target.value)} 
          placeholder="john@example.com"
        />
        <Input 
          label="Phone" 
          value={data.phone} 
          onChange={(e) => handleChange('phone', e.target.value)} 
          placeholder="+1 (555) 000-0000"
        />
        <div className="md:col-span-2">
           <Input 
             label="Location" 
             value={data.location} 
             onChange={(e) => handleChange('location', e.target.value)} 
             placeholder="New York, NY"
           />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Dynamic Links */}
      <DynamicLinks 
        links={data.links || []} 
        onChange={(links) => handleChange('links', links)} 
      />
    </div>
  );
};