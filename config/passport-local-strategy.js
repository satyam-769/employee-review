import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/user.js';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, async function(req, email, password, done) {
  try {
    // find the user and establish the identity
    const user = await User.findOne({ email: email });
    if (!user || user.password !== password) {
      // console.log('Invalid username/password');
      req.flash('error', 'Invalid username/password');
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    req.flash('error', err);
    console.log('Error in finding the user');
    return done(err);
  }
}));

// Serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

// Deserializing the user from the key in cookies
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.log('Error in finding the user');
    return done(err);
  }
});

//  Check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
// if the user is signed in, then pass on the request to the next function(controller's action)
  if(req.isAuthenticated()){
    return next();
  }

  // If the user is not signed in
  return res.redirect('/signin');
}

passport.setAuthenticatedUser = function(req, res, next){
  // req.user is contained the current signed in user from the session cookies
  // and we are just sending this to the locals for the views
  if(req.isAuthenticated()){
    res.locals.user = req.user;
  }

  next();
}

passport.restrictAccess = function (req, res, next) {
  if (req.isAuthenticated()&&req.user.permission!='admin') {
    return res.redirect('back');
  }
  next();
}

passport.restrictAccessPages = function (req, res, next) {
  if (req.isAuthenticated()&&req.user.permission=='admin') {
    next()
  }
  else{
    return res.redirect('back');
  } 
}

export default passport;
