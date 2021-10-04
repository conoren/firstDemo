"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require("express");
var dbConfig = require("./config/db.config");
var passportConfig = require("./config/passport-config");
var passport = require("passport");
var flash = require("express-flash");
var session = require("express-session");
var swaggerUi = require('swagger-ui-express');
var swaggerFile = require('./doc/swagger-output.json');
var eventRouter = require('./routes/event');
var app = express();
//const routes = require('./routes/eventRoutes')(app);
require("dotenv").config();
var PORT = 3000;
passportConfig.initializePassport(passport);
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(eventRouter);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get("/", function (_req, res) {
    res.render("login.ejs");
});
app.get("/eventManger", dbConfig.checkNotAuthenticated, function (_req, res) {
    res.render("eventManger.ejs");
});
app.post("/eventAdder", dbConfig.checkNotAuthenticated, function (req, res) {
    var _a = req.body, name = _a.name, description = _a.description;
    var errors = [];
    var attenders = [];
    console.log({
        name: name,
        description: description,
    });
    if (!name || !description) {
        errors.push({ message: "Please enter all fields" });
    }
    if (errors.length > 0) {
        res.render("eventManager", { errors: errors, name: name, description: description });
    }
    else {
        dbConfig.pool.query("INSERT INTO events (name, description, attenders)\n            VALUES ($1, $2, $3)\n            RETURNING name, description", [name, description, attenders], function (err, results) {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            req.flash("success_msg", "Event added.");
            res.redirect("/index");
        });
    }
});
app.delete("/eventDeleter", dbConfig.checkNotAuthenticated, function (req, res) {
    var name = req.body.name;
    var errors = [];
    console.log({
        name: name,
    });
    if (!name) {
        errors.push({ message: "Please enter the event name" });
    }
    if (errors.length > 0) {
        res.render("eventManager", { errors: errors, name: name });
    }
    else {
        dbConfig.pool.query("DELETE FROM events WHERE name=$1", [name], function (err, results) {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            req.flash("success_msg", "Event deleted.");
            res.redirect("/index");
        });
    }
});
app.post("/eventJoin", dbConfig.checkNotAuthenticated, function (req, res) {
    var _a = req.body, name = _a.name, id = _a.id;
    var errors = [];
    console.log({
        name: name,
        id: id,
    });
    if (!name) {
        errors.push({ message: "Please enter the event name" });
    }
    if (errors.length > 0) {
        res.render("index", { errors: errors, name: name });
    }
    else {
        dbConfig.pool.query("UPDATE events SET attenders=$1 WHERE name=$2", [[id], name], function (err, results) {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            req.flash("success_msg", "Joined.");
            res.redirect("/index");
        });
    }
});
app.post("/eventLeave", dbConfig.checkNotAuthenticated, function (req, res) {
    var _a = req.body, name = _a.name, id = _a.id;
    var errors = [];
    console.log({
        name: name,
        id: id,
    });
    if (!name) {
        errors.push({ message: "Please enter the event name" });
    }
    if (errors.length > 0) {
        res.render("index", { errors: errors, name: name });
    }
    else {
        dbConfig.pool.query("UPDATE events SET attenders=$1 WHERE name=$2", [[], name], function (err, results) {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            req.flash("success_msg", "Left.");
            res.redirect("/index");
        });
    }
});
app.get("/register", dbConfig.checkAuthenticated, function (_req, res) {
    res.render("register.ejs");
});
app.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, password2, errors, hashedPassword_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, password2 = _a.password2;
                errors = [];
                console.log({
                    name: name,
                    email: email,
                    password: password,
                    password2: password2,
                });
                if (!name || !email || !password || !password2) {
                    errors.push({ message: "Please enter all fields" });
                }
                if (password.length < 6) {
                    errors.push({ message: "Password must be a least 6 characters long" });
                }
                if (password !== password2) {
                    errors.push({ message: "Passwords do not match" });
                }
                if (!(errors.length > 0)) return [3 /*break*/, 1];
                res.render("register", { errors: errors, name: name, email: email, password: password, password2: password2 });
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, passportConfig.bcrypt.hash(password, 10)];
            case 2:
                hashedPassword_1 = _b.sent();
                console.log(hashedPassword_1);
                // Validation passed
                dbConfig.pool.query("SELECT * FROM users\n          WHERE email = $1", [email], function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(results.rows);
                    if (results.rows.length > 0) {
                        return res.render("register", {
                            message: "Email already registered",
                        });
                    }
                    else {
                        dbConfig.pool.query("INSERT INTO users (name, email, password)\n                  VALUES ($1, $2, $3)\n                  RETURNING id, password", [name, email, hashedPassword_1], function (err, results) {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash("success_msg", "You are now registered. Please log in");
                            res.redirect("/login");
                        });
                    }
                });
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/login", dbConfig.checkAuthenticated, function (req, res) {
    res.render("login.ejs");
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true,
}));
app.get("/index", dbConfig.checkNotAuthenticated, function (req, res) {
    console.log(req.isAuthenticated());
    var getAllEvents = function (request, response) {
        dbConfig.pool.query("SELECT * FROM events ", function (error, results) {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    };
    res.render("index.ejs", { name: req.user.name, events: req.pool });
});
app.get("/logout", function (req, res) {
    req.logout();
    res.render("login.ejs", { message: "You have logged out successfully" });
});
app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
