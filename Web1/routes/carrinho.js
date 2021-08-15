const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var cookieParser = require('cookie-parser');

const Product = require('../models/Product')
const Purchase = require('../models/Purchase')

const {ensureAuthenticated} = require('../config/auth');

router.get('/carrinhoDeCompra', async function (req, res){
    products_list = [];

    products = req.cookies;
    keys = Object.keys(products)
    console.log(keys.length)
    for(let a=0;a<keys.length;a++){
        let query = Product.findOne({_id: keys[a]})
        let result = await query.exec().catch((err) => {});
        if (result) {
            result.quant = Object.values(products)[a]
            products_list.push(result);
        }
    } 

    if (products_list.length == 0)
        return res.send("Seu carrinho esta vazio")

    console.log(products)
    res.render('carrinhoDeCompras',{
        products: products_list
    })
});

router.post('/comprarProduto', async function(req, res){
    const {ProductID} = req.body;
    console.log(ProductID);

    var products = req.cookies;
    let query = Product.findOne({_id: ProductID})
    let product = await query.exec();
    
    if (products[`${ProductID}`] == undefined){
        res.cookie(`${ProductID}`, `1`, { maxAge: Date.now() + 900000, httpOnly: false });
    }
    else{
        let quant = parseInt(products[ProductID]);
        quant += 1;
        res.cookie(`${ProductID}`, `${quant}`, { maxAge: Date.now() + 900000, httpOnly: false });
        // products = products +";"+Object.values(JSON.parse(JSON.stringify(product)));
    }

    return res.redirect('/carrinhoDeCompra');
});

router.post('/atualizarQuantidade/:id_produto', async function(req, res){
    const {qnt} = req.body;
    const {id_produto} = req.params;

    var products = req.cookies;
    res.cookie(`${id_produto}`, `${qnt}`, { maxAge: Date.now() + 900000, httpOnly: false , e});

    return res.redirect('/carrinhoDeCompra');
});

router.post('/removerProdutoCarrinho/:id_produto', async function(req, res){
    const {id_produto} = req.params;

    var products = req.cookies;
    // res.cookie(`${id_produto}`, `${0}`, { expires: Date.now() + 1, httpOnly: false});
    res.clearCookie(`${id_produto}`)

    return res.redirect('/carrinhoDeCompra');
});

router.post('/finalizarCompra',ensureAuthenticated ,async function (req, res){
    product_list = [];
    client = req.user._id
    products = req.cookies;
    keys = Object.keys(products)
    console.log(keys.length)
    for(let a=0;a<keys.length;a++){
        qnt = req.cookies[keys[a]]
        productAux = {product: keys[a], ammount: qnt}
        let query = Product.findOne({_id: keys[a]})
        let result = await query.exec().catch((err) => {});
        res.clearCookie(keys[a])
        if (result) 
            product_list.push(productAux) 
    } 
    const newPurchase = new Purchase({
        client,
        products: product_list
    })

    newPurchase.save()

    res.render('carrinhoDeCompras',{
        products: products_list
    })
});



module.exports = router;
