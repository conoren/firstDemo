"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var router = express.Router();
var userService = require('./user.service');
// routes
router.post('/authenticate', authenticate);
router.get('/getusers', getAll);
function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(function (user) { return res.json(user); })
        .catch(next);
}
function getAll(req, res, next) {
    userService.getAll()
        .then(function (users) { return res.json(users); })
        .catch(next);
}
exports.default = router;
//# sourceMappingURL=user.js.map