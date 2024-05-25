import express from 'express';
import passport from 'passport';
import {homeController, completeReview} from '../controllers/home_controller.js';
import users from './user.js';
import review from './review.js';
import employee from './employee.js';

const router = express.Router();

router.get('/', passport.checkAuthentication, homeController);
router.post('/completeReview', passport.checkAuthentication, completeReview);

router.use('/users', users)
router.use('/review', review)
router.use('/employee', employee)

export default router;