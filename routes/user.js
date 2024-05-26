import express from 'express';
import passport from 'passport';

import { create, Signin, SignUp, createSession, destroySession } from '../controllers/user_controller.js';
const router = express.Router();

router.get('/signin', passport.restrictAccess, Signin);
router.get('/signup', passport.restrictAccess, SignUp);
router.post('/create', create);

//Use passport as a middleware to Authenticate
router.post('/create-session', passport.authenticate(
  'local', { failureRedirect: '/signin' }
), createSession);

router.get('/signout', destroySession);

export default router;