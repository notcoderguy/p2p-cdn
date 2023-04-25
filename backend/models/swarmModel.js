const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const swarmSchema = new Schema({
    swarm_id: {
        type: String,
        required: true,
        unique: true
    },
    swarm_max_size: {
        type: Number,
        required: true,
        unique: false
    },
    swarm_current_size: {
        type: Number,
        required: true,
        unique: false
    },
    swarm_users: {
        type: Array,
        required: true,
        unique: false
    },
    swarm_city: {
        type: String,
        required: false,
        unique: false
    },
    swarm_country: {
        type: String,
        required: false,
        unique: false
    },
    swarm_region: {
        type: String,
        required: false,
        unique: false
    },
});

const Swarm = mongoose.model('Swarm', swarmSchema);

module.exports = Swarm;