"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcrypt = exports.initialize = void 0;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
exports.bcrypt = bcrypt;
var db_config_1 = require("./db.config");
function initialize(passport) {
    console.log("Initialized");
    var authenticateUser = function (email, password, done) {
        console.log(email, password);
        db_config_1.pool.query("SELECT * FROM users WHERE email = $1", [email], function (err, results) {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            if (results.rows.length > 0) {
                var user_1 = results.rows[0];
                console.log("ezt találtuk: " + results.rows[0].password);
                console.log("ez a beírt jelszó: " + user_1.password);
                bcrypt.compare(password, user_1.password, function (err, isMatch) {
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
        db_config_1.pool.query("SELECT * FROM users WHERE id = $1", [id], function (err, results) {
            if (err) {
                return done(err);
            }
            console.log("ID is " + results.rows[0].id);
            return done(null, results.rows[0]);
        });
    });
}
exports.initialize = initialize;
//# sourceMappingURL=passport-config.js.map