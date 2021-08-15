const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureAdminAuthenticated} = require('../config/auth');

const Product = require('../models/Product')

router.get('/', (req, res) => {
        Product.find({})
        .then(product => {
            arrayProducts = []
            arrayNames = []
            arrayDescriptions =[]
            arrayPrices = []
            arrayIds = []

            for(a=0; a<product.length; a++){
                arrayProducts.push(Object.values(JSON.parse(JSON.stringify(product[a]))));
            }
            //[0] = name [1]=descripion [2]=price
            for(a=0; a<product.length; a++){
                arrayNames.push(product[a].name)
                arrayDescriptions.push(product[a].description)
                arrayPrices.push(product[a].price)
                arrayIds.push(product[a]._id)
            }
            res.render('welcome',{
                names: arrayNames,
                descriptions: arrayDescriptions,
                prices: arrayPrices,
                ids: arrayIds
            })
        }).catch(err => console.log(err));
});

module.exports = router;