const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

//Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

mongoose.connect(db, { useNewUrlParser: true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Bodyparser
app.use(express.urlencoded({extended: false}));

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/admin', require('./routes/admin'))
app.use('/', require('./routes/category'))
app.use('/', require('./routes/product'))
app.use('/', require('./routes/carrinho'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));