const express = require('express');
const userRouter = express.Router();
const { v4: uuidv4 } = require('uuid');
const userSchema = require('../models/userModel');
const mmdb = require('@maxmind/geoip2-node').Reader;
const fs = require('fs');

const mmdbBuffer = fs.readFileSync('./GeoLite2-City.mmdb');
const mmdbReader = mmdb.openBuffer(mmdbBuffer);

// GET request to generate a unique user ID
userRouter.get('/', async function (req, res, next) {
    try {
        // Generate a UUID for the user
        const uuid = uuidv4();
        res.json({ uuid });
    } catch (err) {
        console.error(`Error while generating userID `, err.message);
        next(err);
    }
});

// POST request to save user information
userRouter.post('/', async function (req, res, next) {
    try {
        // Extract necessary information from the request body
        uuid = req.body.uuid;
        ip_encoded = req.body.ip;
        ip = Buffer.from(ip_encoded, 'base64').toString('ascii');

        // Retrieve geolocation information based on the IP address
        ip_record = await mmdbReader.city(ip);
        country = ip_record.country.names.en;
        city = ip_record.city.names.en;
        region = ip_record.continent.names.en;
                
        // Create a new user object with the extracted information
        const user = new userSchema({
            uuid: uuid,
            ip: ip,
            city: city,
            country: country,
            region: region,
        });

        try {
            // Save the user object to the database
            const savedUser = await user.save();
            res.json(savedUser);
        } catch (err) {
            console.error(`Error while saving user `, err.message);
            next(err);
        }
    } catch (err) {
        console.error(`Error while saving user `, err.message);
        next(err);
    }
});

// GET request to retrieve user information based on UUID
userRouter.get('/:uuid', async function (req, res, next) {
    try {
        // Find the user in the database based on the UUID parameter
        const user = await userSchema.findOne({ uuid: req.params.uuid });
        res.json(user);
    } catch (err) {
        console.error(`Error while getting user info `, err.message);
        next(err);
    }
});

// PUT request to update user's swarm information
userRouter.put('/:uuid/:swarmid', async function (req, res, next) {
    try {
        // Find the user in the database based on the UUID parameter and update the swarm field
        const user = await userSchema.findOneAndUpdate(
            { uuid: req.params.uuid },
            { swarm: req.params.swarmid }
        );
        res.json(user);
    } catch (err) {
        console.error(`Error while updating user info `, err.message);
        next(err);
    }
});

module.exports = userRouter;
