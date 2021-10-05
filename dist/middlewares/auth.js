"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.jwt = void 0;
var expressJwt = require('express-jwt');
//const config = require('config.json');
//require("dotenv").config();
//module.exports = jwt;
function jwt() {
    var secret = process.env.SESSION_SECRET;
    return expressJwt({ secret: secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/authenticate'
        ]
    });
}
exports.jwt = jwt;
function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }
    // default to 500 server error
    return res.status(500).json({ message: err.message });
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=auth.js.map