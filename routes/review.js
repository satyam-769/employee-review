import express from 'express';
import passport from 'passport';

import { createReview, home } from '../controllers/review_controller.js';
const router = express.Router();

router.get('/assign-work', passport.restrictAccessPages, home);
router.post('/create-review', createReview);

export default router;