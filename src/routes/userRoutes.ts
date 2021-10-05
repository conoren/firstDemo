const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// routes
router.post('/authenticate', authenticate);
router.get('/getusers', getAll);


function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

export default router;