const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    ip: {
        type: String,
        required: true,
        unique: false
    },
    city: {
        type: String,
        required: false,
        unique: false
    },
    country: {
        type: String,
        required: false,
        unique: false
    },
    region: {
        type: String,
        required: false,
        unique: false
    },
    swarm: {
        type: String,
        required: false,
        unique: false
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;