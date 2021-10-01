"use strict";
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
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/index");
    }
    next();
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
module.exports = { pool: pool, checkAuthenticated: checkAuthenticated, checkNotAuthenticated: checkNotAuthenticated };
