const express = require('express');
const userRouter = express.Router();
const { v4: uuidv4 } = require('uuid');
const userSchema = require('../models/userModel');
const mmdb = require('@maxmind/geoip2-node').Reader;
const fs = require('fs');

const mmdbBuffer = fs.readFileSync('./GeoLite2-City.mmdb');
const mmdbReader = mmdb.openBuffer(mmdbBuffer);

userRouter.get('/', async function (req, res, next) {
    try {
        const uuid = uuidv4();
        res.json({ uuid });
    } catch (err) {
        console.error(`Error while generating userID `, err.message);
        next(err);
    }
});

userRouter.post('/', async function (req, res, next) {
    try {
        uuid = req.body.uuid;
        ip_encoded = req.body.ip;
        ip = Buffer.from(ip_encoded, 'base64').toString('ascii');

        ip_record = await mmdbReader.city(ip);
        country = ip_record.country.names.en;
        city = ip_record.city.names.en;
        region = ip_record.continent.names.en;
                
        const user = new userSchema({
            uuid: uuid,
            ip: ip,
            city: city,
            country: country,
            region: region,
        });

        try {
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

userRouter.get('/:uuid', async function (req, res, next) {
    try {
        const user = await userSchema.findOne({ uuid: req.params.uuid });
        res.json(user);
    } catch (err) {
        console.error(`Error while getting user info `, err.message);
        next(err);
    }
});

userRouter.put('/:uuid/:swarmid', async function (req, res, next) {
    try {
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