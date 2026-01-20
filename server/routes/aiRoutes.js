import express from 'express';
import {
  enhanceProfessionalSummary,
  enhanceJobDescription,
  analyzeResume
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/enhance-summary', protect, enhanceProfessionalSummary);
router.post('/enhance-job-description', protect, enhanceJobDescription);
router.post('/analyze', protect, upload.single('resume'), analyzeResume); // Added upload middleware

export default router;