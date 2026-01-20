import Resume from '../models/Resume.js';
import imagekit from '../config/imagekit.js';

export const createResume = async (req, res) => {
  try {
    const { title } = req.body;
    const resume = new Resume({
      userId: req.userId,
      title: title || 'Untitled Resume',
      personalInfo: {
        fullName: req.user.name,
        email: req.user.email
      }
    });

    const createdResume = await resume.save();
    res.status(201).json(createdResume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).select('-__v');
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (resume) {
      res.json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (resume && resume.public) {
      res.json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found or private' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    let { resumeData, removeBackground } = req.body;
    
    // Parse resumeData if it comes as a string (FormData case)
    if (typeof resumeData === 'string') {
      try {
        resumeData = JSON.parse(resumeData);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid resume data format' });
      }
    }

    // Clean data: remove _id and userId to prevent immutable field errors
    delete resumeData._id;
    delete resumeData.userId;
    delete resumeData.createdAt;
    delete resumeData.updatedAt;

    // Handle Image Upload if file exists
    if (req.file) {
      const transformation = removeBackground === 'true' 
        ? { pre: 'w-400,h-400,fo-face,z-2,bg-remove' }
        : { pre: 'w-400,h-400,fo-face,z-2' };

      try {
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: `resume-${Date.now()}-${req.file.originalname}`,
          folder: '/resumes',
          transformation
        });

        // Update image URL in personalInfo
        if (!resumeData.personalInfo) resumeData.personalInfo = {};
        resumeData.personalInfo.image = uploadResponse.url;
      } catch (uploadError) {
        console.error('ImageKit Upload Error:', uploadError);
      }
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: req.body.resumeId || req.params.id, userId: req.userId }, 
      { $set: resumeData },
      { new: true, runValidators: true } // Added runValidators
    );

    if (updatedResume) {
      res.json({ message: 'Resume updated successfully', resume: updatedResume });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (resume) {
      res.json({ message: 'Resume removed' });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};