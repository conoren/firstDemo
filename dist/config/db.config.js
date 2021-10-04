"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNotAuthenticated = exports.checkAuthenticated = exports.pool = void 0;
require("dotenv").config();
var Pool = require("pg").Pool;
var pool = new Pool({
    user: process.env.PGUSER,
    host: "db-toth-aron-do-user-7298387-0.b.db.ondigitalocean.com",
    port: 25060,
    password: process.env.PGPW,
    ssl: { rejectUnauthorized: false },
    database: "defaultdb"
});
exports.pool = pool;
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/index");
    }
    next();
}
exports.checkAuthenticated = checkAuthenticated;
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
exports.checkNotAuthenticated = checkNotAuthenticated;
//# sourceMappingURL=db.config.js.map