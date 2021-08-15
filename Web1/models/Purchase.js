const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema ( {
    date: {
        type: Date,
        default: Date.now,
    },
    client: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    products: {
        type: [Object],
    },
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);

module.exports = Purchase;