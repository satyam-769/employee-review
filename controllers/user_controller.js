import User from '../models/user.js';

// Render the Signin Page
const Signin = function (req, res) {
  res.render('./signin');
}

// Render the SignUp Page
const SignUp = function (req, res) {
  res.render('./signup');
}

// Get the sign up Data 
const create = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      req.flash('error','Passwords do not match');
      return res.redirect('back');
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      await User.create(req.body);
      req.flash('success', 'User Created succesfully');
      return res.redirect('back');
    }
    else {
      req.flash('error', 'User Already exits,Try signing in');
      return res.redirect('back');
    }
  }
  catch (error) {
    console.log('Error', error);
    return res.redirect('back');
  }
}

//Sign in and create the session for the user
const createSession = function (req, res) {
  return res.redirect('/');
}

const destroySession = function (req, res) {
  req.logout(function (error) {
    if (error) {
      console.log('Error while signing out');
      return res.redirect('back');
    }

    return res.redirect('/signin');
  });
}

export {
  Signin,
  SignUp,
  create,
  createSession,
  destroySession
};