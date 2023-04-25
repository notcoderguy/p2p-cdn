const express = require('express');
const swarmRouter = express.Router();
const { v4: uuidv4 } = require('uuid');
const userSchema = require('../models/userModel');
const swarmSchema = require('../models/swarmModel');

swarmRouter.get('/', async function (req, res, next) {
    get_swarm = await swarmSchema.find();
    res.json(get_swarm);
});

swarmRouter.post('/', async function (req, res, next) {
    try {        
        uuid = req.body.uuid;
        city = Buffer.from(req.body.city, 'base64').toString('ascii');
        country = Buffer.from(req.body.country, 'base64').toString('ascii');
        region = Buffer.from(req.body.region, 'base64').toString('ascii');

        get_swarm = await swarmSchema.find({swarm_country: country, swarm_region: region });
        if (get_swarm.length > 0) {
            swarm_id = get_swarm[0].swarm_id;
            swarm_max_size = get_swarm[0].swarm_max_size;
            swarm_current_size = get_swarm[0].swarm_current_size;
            swarm_users = get_swarm[0].swarm_users;
            if (swarm_current_size < swarm_max_size) {
                swarm_current_size += 1;
                swarm_users.push(uuid);
                await swarmSchema.updateOne({ swarm_id: swarm_id }, { swarm_current_size: swarm_current_size, swarm_users: swarm_users });
            } else {
                swarm_id = uuidv4();
                swarm_max_size = 50;
                swarm_current_size = 1;
                swarm_users = [uuid];
                const swarm = new swarmSchema({
                    swarm_id: swarm_id,
                    swarm_max_size: swarm_max_size,
                    swarm_current_size: swarm_current_size,
                    swarm_users: swarm_users,
                    swarm_city: city,
                    swarm_country: country,
                    swarm_region: region,
                });
                await swarm.save();
            }
        } else {
            swarm_id = uuidv4();
            swarm_max_size = 50;
            swarm_current_size = 1;
            swarm_users = [uuid];
            const swarm = new swarmSchema({
                swarm_id: swarm_id,
                swarm_max_size: swarm_max_size,
                swarm_current_size: swarm_current_size,
                swarm_users: swarm_users,
                swarm_city: city,
                swarm_country: country,
                swarm_region: region,
            });
            await swarm.save();
        }
        res.json({ swarm_id: swarm_id });
    } catch (err) {
        console.error(`Error while saving swarm `, err.message);
        next(err);
    }
});

module.exports = swarmRouter;