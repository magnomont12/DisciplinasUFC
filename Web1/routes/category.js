const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Category = require('../models/Category')

const {ensureAuthenticated, ensureAdminAuthenticated} = require('../config/auth');

router.get('/registerCategory', ensureAdminAuthenticated, (req, res) => {
    res.render('registerCategory', {
        user: req.user
    })
});


// Register handle
router.post('/registerCategory', (req, res) => {
    const { name, description } = req.body;
    let errors = [];

    if (!name || !description) {
        errors.push({msg: 'Please fill all fields'});
    }

    if (errors.length > 0) {
        res.render('registerCategory', {
            errors,
        });
    } else {
        Category.findOne({name: name})
            .then(category => {
                if (category) {
                    errors.push({msg: 'Category already registered'});
                    res.render('registerCategory', {
                        errors,
                        name,
                    });
                } else {
                    const newCategory = new Category({
                        name,
                        description
                    });

                    newCategory.save()
                        .then(category => {
                            req.flash('success_msg', 'Category Registred');
                            res.redirect('/registerCategory');
                        })
                        .catch(err => console.log(err));
                }
            });
    }
})





module.exports = router;