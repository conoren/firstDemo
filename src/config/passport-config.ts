"use strict";
var LocalStrategy = require('passport-local').Strategy;
const loginPool = require("./db.config.js").pool;
var bcrypt = require('bcrypt');
function initialize(passport: { use: (arg0: any) => void; serializeUser: (arg0: (user: any, done: any) => any) => void; deserializeUser: (arg0: (id: any, done: any) => void) => void; }) {
    console.log("Initialized");
    var authenticateUser = function (email: any, password: any, done: (arg0: null, arg1: boolean, arg2: { message: string; } | undefined) => any) {
        console.log(email, password);
        loginPool.query("SELECT * FROM users WHERE email = $1", [email], function (err: any, results: { rows: string | any[]; }) {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            if (results.rows.length > 0) {
                var user_1 = results.rows[0];
                console.log("ezt találtuk: " + results.rows[0].password);
                console.log("ez a beírt jelszó: " + user_1.password);
                bcrypt.compare(password, user_1.password, function (err: any, isMatch: any) {
                    if (err) {
                        console.log(err);
                    }
                    if (isMatch) {
                        return done(null, user_1, { message: "Password is correct" });
                    }
                    else {
                        //password is incorrect
                        return done(null, false, { message: "Password is incorrect" });
                    }
                });
            }
            else {
                // No user
                return done(null, false, {
                    message: "No users found with this email address"
                });
            }
        });
    };
    passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, authenticateUser));
    passport.serializeUser(function (user, done) { return done(null, user.id); });
    passport.deserializeUser(function (id, done) {
        loginPool.query("SELECT * FROM users WHERE id = $1", [id], function (err: any, results: { rows: any[]; }) {
            if (err) {
                return done(err);
            }
            console.log("ID is " + results.rows[0].id);
            return done(null, results.rows[0]);
        });
    });
}
module.exports = {initializePassport:initialize, bcrypt:bcrypt};
