const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');

module.exports = function(passport) {


    passport.serializeUser(function(admin, done) {
        done(null, admin.id);
      });
      
      passport.deserializeUser(function(id, done) {
        Admin.findById(id, function(err, admin) {
          done(err, admin);
        });
      });
      
}
