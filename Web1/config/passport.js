const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Client = require('../models/Client');
const Admin = require('../models/Admin');

module.exports = function (passport) {
    passport.use('client',
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            Client.findOne({ email: email })
                .then(client => {
                    if (!client) {
                        return done(null, false, { message: 'Email not registered' });
                    }

                    //Match password
                    bcrypt.compare(password, client.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, client);
                        } else {
                            return done(null, false, { message: 'Wrong password' });
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    );

    passport.use('admin',
        new LocalStrategy({ usernameField: 'login' }, (login, password, done) => {
            Admin.findOne({ login: login, password: password })
                .then(admin => {
                    if (!admin) {
                        return done(null, false, { message: 'Login not registered' });
                    }

                    return done(null, admin);
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser(function (obj, done) {
        let type = obj.address === undefined ? 'admin' : 'client';
        done(null, { id: obj.id, type: type });
    });

    passport.deserializeUser(function (obj, done) {
        console.log(obj);
        if (obj.type == 'client') {
            Client.findById(obj.id, function (err, client) {
                done(err, client);
            });
        } else if (obj.type == 'admin') {
            Admin.findById(obj.id, function (err, admin) {
                done(err, admin);
            });
        }

    });
}