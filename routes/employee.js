import express from 'express';
import passport from 'passport';
const router = express.Router();

import { home, update, deleteReview, makeAdmin, removeAdmin } from '../controllers/employee_controller.js';

router.get('/home', passport.restrictAccessPages, home);
router.post('/update/:id', passport.checkAuthentication, update);
router.get('/delete/:id', deleteReview);
router.get('/makeadmin/:id', makeAdmin);
router.get('/removeadmin/:id', removeAdmin);

export default router;