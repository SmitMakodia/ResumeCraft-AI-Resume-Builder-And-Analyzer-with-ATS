import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Upload, FileText, Search, ChevronDown } from 'lucide-react';
import api from '../lib/axios';
import { AnalysisResult, AnalysisData } from '../components/analyzer/AnalysisResult';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchResumes } from '../store/slices/resumeSlice';
import { Resume } from '../types';

export const Analyzer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { resumes } = useSelector((state: RootState) => state.resume);
  
  const [file, setFile] = useState<File | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setSelectedResumeId(''); // Clear selection
    }
  };

  const resumeToString = (r: Resume) => {
    return `
      Name: ${r.personalInfo.fullName}
      Role: ${r.personalInfo.profession}
      Summary: ${r.professionalSummary}
      
      Experience:
      ${r.experience.map(e => `${e.position} at ${e.company} (${e.startDate.year}-${e.endDate.year}). ${e.description.join('. ')}`).join('\n')}
      
      Education:
      ${r.education.map(e => `${e.degree} in ${e.field} at ${e.institution}`).join('\n')}
      
      Projects:
      ${r.projects.map(p => `${p.name}: ${p.description.join('. ')}`).join('\n')}
      
      Skills:
      ${r.skills.map(s => `${s.heading ? s.heading + ': ' : ''}${s.items.join(', ')}`).join('\n')}
    `;
  };

  const handleAnalyze = async () => {
    if ((!file && !selectedResumeId) || !jobDescription.trim()) {
      toast.error('Please provide a resume (upload or select) and a job description.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let payload: any;
      let headers = {};

      if (file) {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);
        payload = formData;
        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        const selectedResume = resumes.find(r => r._id === selectedResumeId);
        if (!selectedResume) throw new Error('Selected resume not found');
        
        payload = {
          resumeText: resumeToString(selectedResume),
          jobDescription
        };
        headers = { 'Content-Type': 'application/json' };
      }

      const response = await api.post('/ai/analyze', payload, { headers });
      setResult(response.data);
      toast.success('Analysis complete!');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Analysis failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ATS Resume Analyzer</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check your resume score against a job description.
            </p>
          </div>

          {!result ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Left: Input */}
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                      <h2 className="text-xl font-bold">Provide Resume</h2>
                    </div>

                    {/* Option A: Upload */}
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors relative ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {file ? (
                        <div className="flex flex-col items-center text-green-700">
                          <FileText size={32} className="mb-2" />
                          <p className="font-medium truncate max-w-full">{file.name}</p>
                          <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="text-xs underline mt-2">Remove</button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <Upload size={32} className="mb-2" />
                          <p className="font-medium">Upload PDF</p>
                        </div>
                      )}
                    </div>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                      <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OR</span></div>
                    </div>

                    {/* Option B: Select */}
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Select from Dashboard</label>
                       <div className="relative">
                         <select
                           value={selectedResumeId}
                           onChange={(e) => { setSelectedResumeId(e.target.value); setFile(null); }}
                           className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           disabled={!!file}
                         >
                           <option value="">-- Choose a Resume --</option>
                           {resumes.map(r => (
                             <option key={r._id} value={r._id}>{r.title}</option>
                           ))}
                         </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                           <ChevronDown size={16} />
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Right: Job Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                    <h2 className="text-xl font-bold">Job Description</h2>
                  </div>
                  
                  <textarea 
                    className="w-full h-80 rounded-xl border border-gray-300 bg-gray-50 p-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none shadow-inner"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button 
                  size="lg" 
                  onClick={handleAnalyze} 
                  isLoading={isAnalyzing}
                  disabled={(!file && !selectedResumeId) || !jobDescription}
                  className="px-8 shadow-lg shadow-primary-200"
                >
                  <Search size={20} className="mr-2" />
                  Analyze Resume
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex justify-start">
                 <Button variant="outline" onClick={() => setResult(null)}>
                   &larr; Analyze Another
                 </Button>
               </div>
               <AnalysisResult data={result} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};