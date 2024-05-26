import express from 'express';
import layout from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

import passport from 'passport';
import session from 'express-session';
import passportLocal  from  './config/passport-local-strategy.js';
import {db} from './config/mongoose.js';
import flash from 'connect-flash';
import MongoStore from 'connect-mongo';
import sassMiddleware from 'node-sass-middleware';
import customMiddleware from './config/middleware.js';
import routes from './routes/index.js';

const sessionStore = new MongoStore({
  client: db.getClient(),
  collectionName: 'sessions'
})

app.use(express.static('./assets'))
app.use(layout);

app.use(sassMiddleware({
  src: './assets/scss',
  dest: './assets/css',
  debug: true,
  outputStyle: 'extended',
  prefix:'/css'
}));

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

//Extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//MongoStore is used to store the session cookie in the DB
app.use(session(
  {
    name: 'employee_review',
    //ToDO Change the secret before deployment
    secret:'reviews',
    saveUninitialized: false,
    resave: false,
    cookie:
    {
      maxAge: (1000 * 60 * 100)
    },
    store: sessionStore
  }
))

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser)

app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = req.flash();
  next();
});
app.get('/', (req, res) => {
  // Assuming you render the EJS template here
  res.render('index', { flash: req.flash() });
});

app.use(customMiddleware);

//Set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Use express router
app.use('/', routes)

app.listen(port,function(error){
  if(error)
  {
    console.log(`Error in runnin the server. Error is ${error}`)
  }
  console.log(`Server is up on the port : ${port}`)
})