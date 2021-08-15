const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var cookieParser = require('cookie-parser');


const Category = require('../models/Category')
const Product = require('../models/Product')
const {ensureAuthenticated, ensureAdminAuthenticated} = require('../config/auth');

router.get('/registerProduct', ensureAdminAuthenticated, (req, res) => {
    Category.find({}, {name: 1, _id: 0})
        .then(category => {
            let arrayCategories = []
            if (category.length <= 0) {
                res.redirect('/registerCategory');
            }else{
                for(a=0; a<category.length; a++){
                    arrayCategories.push(Object.values(JSON.parse(JSON.stringify(category[a]))))
                }
                res.render('registerProduct', {
                    categories: arrayCategories
                });
            }
        }).catch(err => console.log(err));
})

router.post('/registerProduct', (req, res) => {

    const { name, description, price, photo ,stock, categories } = req.body;
    let errors = [];
    
    if (!name || !description || !price || !photo || !stock || !categories) {
        errors.push({msg: 'Please fill all fields'});
    }

    Category.find({}, {name: 1, _id: 0})
        .then(category => {
            let arrayCategories = []
            for(a=0; a<category.length; a++){
                arrayCategories.push(Object.values(JSON.parse(JSON.stringify(category[a]))))
            }
            if (errors.length > 0) {
                res.render('registerProduct', {
                    errors,
                    categories: arrayCategories
                });
            }
            else{
                const newProduct = new Product({
                    name,
                    description,
                    price,
                    photo,
                    stock,
                    categories
                })
                newProduct.save()
                res.render('registerProduct', {
                    categories: arrayCategories
                });
            }

            
        }).catch(err => console.log(err));
    
})

module.exports = router