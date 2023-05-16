const express = require('express');
const swarmRouter = express.Router();
const { v4: uuidv4 } = require('uuid');
const userSchema = require('../models/userModel');
const swarmSchema = require('../models/swarmModel');

// GET request to retrieve all swarms
swarmRouter.get('/', async function (req, res, next) {
    // Retrieve all swarms from the database
    get_swarm = await swarmSchema.find();
    res.json(get_swarm);
});

// POST request to create or join a swarm
swarmRouter.post('/', async function (req, res, next) {
    try {        
        // Extract necessary information from the request body
        uuid = req.body.uuid;
        city = Buffer.from(req.body.city, 'base64').toString('ascii');
        country = Buffer.from(req.body.country, 'base64').toString('ascii');
        region = Buffer.from(req.body.region, 'base64').toString('ascii');

        // Check if a swarm already exists in the given country and region
        get_swarm = await swarmSchema.find({swarm_country: country, swarm_region: region });
        if (get_swarm.length > 0) {
            // If a swarm exists, join the existing swarm if there is space available
            swarm_id = get_swarm[0].swarm_id;
            swarm_max_size = get_swarm[0].swarm_max_size;
            swarm_current_size = get_swarm[0].swarm_current_size;
            swarm_users = get_swarm[0].swarm_users;
            if (swarm_current_size < swarm_max_size) {
                // Increment the swarm size and add the user to the swarm
                swarm_current_size += 1;
                swarm_users.push(uuid);
                // Update the swarm in the database
                await swarmSchema.updateOne({ swarm_id: swarm_id }, { swarm_current_size: swarm_current_size, swarm_users: swarm_users });
            } else {
                // If the swarm is already full, create a new swarm and add the user to it
                swarm_id = uuidv4();
                swarm_max_size = 50;
                swarm_current_size = 1;
                swarm_users = [uuid];
                // Create a new swarm object and save it to the database
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
            // If no swarm exists in the given country and region, create a new swarm and add the user to it
            swarm_id = uuidv4();
            swarm_max_size = 50;
            swarm_current_size = 1;
            swarm_users = [uuid];
            // Create a new swarm object and save it to the database
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
        // Return the swarm ID in the response
        res.json({ swarm_id: swarm_id });
    } catch (err) {
        // Handle any errors that occur during swarm creation or joining
        console.error(`Error while saving swarm `, err.message);
        next(err);
    }
});

module.exports = swarmRouter;