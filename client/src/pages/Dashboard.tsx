import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchResumes, createResume, deleteResume } from '../store/slices/resumeSlice';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Plus, Trash2, FileText, Edit, MoreVertical } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { resumes, isLoading } = useSelector((state: RootState) => state.resume);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleCreate = async () => {
    if (!newResumeTitle.trim()) return;
    const result = await dispatch(createResume(newResumeTitle));
    if (createResume.fulfilled.match(result)) {
      setIsModalOpen(false);
      setNewResumeTitle('');
      navigate(`/builder/${result.payload._id}`);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link click
    if (confirm('Are you sure you want to delete this resume?')) {
      dispatch(deleteResume(id));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Create New Resume
          </Button>
        </div>

        {isLoading && resumes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Link
                to={`/builder/${resume._id}`}
                key={resume._id}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden flex flex-col h-64"
              >
                {/* Preview Placeholder */}
                <div className="flex-1 bg-gray-50 flex items-center justify-center border-b border-gray-100 group-hover:bg-gray-100 transition-colors">
                  <FileText size={48} className="text-gray-300 group-hover:text-primary-400 transition-colors" />
                </div>
                
                {/* Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Updated {format(new Date(resume.updatedAt || Date.now()), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(resume._id!, e)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Empty State / Create New Card */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-64 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50/50 transition-all gap-2"
            >
              <Plus size={32} />
              <span className="font-medium">Create New Resume</span>
            </button>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Resume"
        >
          <div className="space-y-4">
            <Input
              label="Resume Title"
              placeholder="e.g. Software Engineer 2026"
              value={newResumeTitle}
              onChange={(e) => setNewResumeTitle(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newResumeTitle.trim()}>Create</Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};
