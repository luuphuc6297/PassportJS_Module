const http = require('http');
const express = require ('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('routes');
const passport = require('passport');

const app = express();
//Passport config
require('./config/passport')(passport);

//MongoDB
const data = require('./config/index');
mongoose.connect(data.MongoURI,{useNewUrlParser: true});

//EJS
app.use(expressLayouts);
app.set('view engine' ,'ejs');

// Express-Session
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//Connect flash
app.use(flash());

//Global Vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

const server = http.Server(app);
server.listen(3079);
