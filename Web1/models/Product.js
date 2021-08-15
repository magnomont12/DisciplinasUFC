const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema ( {
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    photo: {
        data: Buffer, 
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    categories: {
        type: [String],
        required: true,
    }

    
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;