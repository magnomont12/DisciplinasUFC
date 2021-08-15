const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Admin = require('../models/Admin')
const Product = require('../models/Product')

const {ensureAuthenticated, ensureAdminAuthenticated} = require('../config/auth');

// Login Page
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.address == undefined) {
            res.redirect('admin_dashboard');
        }
    }
    res.render('admin_login')
});

/** 
 * Dessa pagina se acessam os outros relatórios
 * Visualiza e remove compras
 * */ 
router.get('/admin_dashboard', ensureAdminAuthenticated, (req, res) => { 
    res.render('admin_dashboard', {
        user: req.user
    })
});
/** 
 * O relatorio deve mostrar a quantidade de compras que os usuarios realizou
 * em um determinado período
 * */ 
router.get('/relatorios/compras', ensureAdminAuthenticated, async (req, res) => {
});

/** 
 * Mostrar os produtos que estao faltando no estoque
 * */
router.get('/relatorios/estoque', ensureAdminAuthenticated, async (req, res) => {

    console.log("fdsfsdfds")
    let query = Product.find().where('stock').lte(0).sort({description: -1})
    let products = await query.exec();
    console.log(products)
    res.render('relatorioEstoque', {
        products
    })
});

/** 
 * Mostrar o saldo recebido por dia 
 * */
router.get('/relatorios/saldo', ensureAdminAuthenticated, async (req, res) => {
});

//Update page
router.get('/updateAdmin',ensureAdminAuthenticated, (req, res) => { res.render('updateAdmin')});

// Update handle
router.post('/updateAdmin',ensureAdminAuthenticated, (req, res) => {
    let { name, email, password, password2 } = req.body;
    let errors = [];
    let login = req.user.login

    if (!name) {
        name = req.user.name
    }

    if (!email) {
        email = req.user.email
    }

    if(!password2){
        password2 = req.user.password
    }

    if(!password){
        errors.push({msg: 'Please fill field password'});
    }
    if(password != req.user.password){
        errors.push({msg: 'Password Invalid'});
    }

    if (errors.length > 0) {
        res.render('updateAdmin', {
            errors,
        });
    }
    else{
        Admin.findOneAndUpdate({login: req.user.login, password: password}, {$set: {name: name, email: email, password: password2} })
            .then(admin => {
                
        }).catch(err => console.log(err))
    }

    
    res.render('updateAdmin')
})

router.get('/delAdmin',ensureAdminAuthenticated, (req, res) => {
    let login = req.user.login

        Admin.findOneAndRemove({login: login})
            .then(admin => {
                
        }).catch(err => console.log(err))
    res.redirect('/admin/login')
})

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('admin', {
        successRedirect: 'admin_dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/admin/login');
});

module.exports = router;