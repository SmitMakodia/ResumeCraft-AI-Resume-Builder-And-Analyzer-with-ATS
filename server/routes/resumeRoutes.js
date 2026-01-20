import express from 'express';
import {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  getPublicResumeById
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/create', protect, createResume);
router.get('/', protect, getUserResumes); // Get all for user
router.get('/:id', protect, getResumeById);
router.get('/public/:id', getPublicResumeById);
router.put('/update', protect, upload.single('image'), updateResume);
router.delete('/:id', protect, deleteResume);

export default router;
