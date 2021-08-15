const mongoose = require('mongoose');

// TODO: Adicionar campo login
const ClientSchema = new mongoose.Schema ( {
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;