const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Client = require('../models/Client')
const Purchase = require('../models/Purchase')
const Product = require('../models/Product')

const {ensureAuthenticated} = require('../config/auth');

router.get('/dashboard', ensureAuthenticated, async (req, res) => { 

    let queryPurchase = Purchase.find({client: req.user._id})
    let purchases =await queryPurchase.exec();

    listProducts =[]

    purchases.forEach(function(purchase) {
        purchase.products.forEach(async function(product){
            let queryProduct = Product.findOne({_id: product.product})
            let prod = await queryProduct.exec();
            console.log(prod)
            prodAux = [prod.name, product.ammount]
            listProducts.push(prodAux)
        })
    })

    res.render('dashboard', {
        user: req.user,
        purchases,
        listProducts
    })
});

// Login Page
router.get('/login', (req, res) => { 
    if (req.isAuthenticated()) {
        if (req.user.address != undefined) {
            res.redirect('dashboard');
        }
    }
    res.render('login')
});

//Register page
router.get('/register', (req, res) => { res.render('register')});

// Register handle
router.post('/register', (req, res) => {
    const { name, email, address ,password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill all fields'});
    }

    if (password != password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
        });
    } else {
        Client.findOne({email: email})
            .then(client => {
                if (client) {
                    errors.push({msg: 'Email already registered'});
                    res.render('register', {
                        errors,
                        name,
                        address,
                        email,
                    });
                } else {
                    const newClient = new Client({
                        name,
                        address,
                        email,
                        password
                    });

                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newClient.password, salt, (err, hash) => {
                            if (err) throw err

                            newClient.password = hash;
                            newClient.save()
                                .then(client => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                    }));
                }
            });
    }
})

router.get('/updateClient',ensureAuthenticated, (req, res) => { res.render('updateClient')});

// Update handle
router.post('/updateClient',ensureAuthenticated, (req, res) => {
    let { name, adress, password, password2 } = req.body;
    let errors = [];
    let email = req.user.email

    if (!name) {
        name = req.user.name
    }

    if (!adress) {
        adress = req.user.email
    }

    if(!password2){
        password2 = req.user.password
    }

    if(!password){
        errors.push({msg: 'Please fill field password'});
    }


    console.log(errors.length)

    if (errors.length > 0) {
        res.render('updateClient', {
            errors,
        });
    }

    else{
        bcrypt.compare(password, req.user.password, (err, Match) =>{
            if (err) throw err

            if (Match){

                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(password2, salt, (err, hash) => {
                        if (err) throw err

                        console.log(req.user.password)
                        password2 = hash;
                        console.log(password2)
                        Client.findOneAndUpdate({login: req.user.login}, {$set: {name: name, email: email, password: password2} })
                            .then(admin => {
                            
                            }).catch(err => console.log(err))                            
                        }));
                res.render('updateClient')
            }
            else{
                console.log("senha errada")
                errors.push({msg: 'Password Invalid'});
                res.render('updateClient', {
                    errors,
                });  
            }
        })
    }
    
})

router.get('/delClient',ensureAuthenticated, (req, res) => {
    let login = req.user.login

        Client.findOneAndRemove({login: login})
            .then(client => {
                
        }).catch(err => console.log(err))
    
    res.redirect('/users/login')
})

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('client', {
        successRedirect: 'dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;