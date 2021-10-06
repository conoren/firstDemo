"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersxevents = exports.events = exports.users = exports.checkNotAuthenticated = exports.checkAuthenticated = exports.pool = void 0;
var pg_1 = require("pg");
require("dotenv").config();
var pool = new pg_1.Pool({
    user: process.env.PGUSER,
    host: "db-toth-aron-do-user-7298387-0.b.db.ondigitalocean.com",
    port: 25060,
    password: process.env.PGPW,
    ssl: { rejectUnauthorized: false },
    database: "defaultdb"
});
exports.pool = pool;
var users = pool.query("SELECT * FROM users", function (err, results) {
    exports.users = users = results.rows;
});
exports.users = users;
var events = pool.query("SELECT * FROM events", function (err, results) {
    exports.events = events = results.rows;
});
exports.events = events;
var usersxevents = pool.query("SELECT * FROM usersxevents", function (err, results) {
    exports.usersxevents = usersxevents = results.rows;
});
exports.usersxevents = usersxevents;
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