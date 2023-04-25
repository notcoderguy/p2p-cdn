const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', async function (req, res, next) {
    try {
        const users = await userController.genUserID();
        res.json(users);
    } catch (err) {
        console.error(`Error while getting users `, err.message);
        next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const user = await userController.getUser(req.params.id);
        res.json(user);
    } catch (err) {
        console.error(`Error while getting user info `, err.message);
        next(err);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        const user = await userController.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (err) {
        console.error(`Error while updating user info `, err.message);
        next(err);
    }
});

module.exports = router;