"use strict";
module.exports = function (app) {
    app.get("/eventManger", checkNotAuthenticated, function (req, res) {
        res.render("eventManger.ejs");
    });
    app.post("/eventAdder", checkNotAuthenticated, function (req, res) {
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
            pool.query("INSERT INTO events (name, description, attenders)\n                VALUES ($1, $2, $3)\n                RETURNING name, description", [name, description, attenders], function (err, results) {
                if (err) {
                    throw err;
                }
                console.log(results.rows);
                req.flash("success_msg", "Event added.");
                res.redirect("/index");
            });
        }
    });
    app.post("/eventDeleter", checkNotAuthenticated, function (req, res) {
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
            pool.query("DELETE FROM events WHERE name=$1", [name], function (err, results) {
                if (err) {
                    throw err;
                }
                console.log(results.rows);
                req.flash("success_msg", "Event deleted.");
                res.redirect("/index");
            });
        }
    });
    app.post("/eventJoin", checkNotAuthenticated, function (req, res) {
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
            pool.query("UPDATE events SET attenders=$1 WHERE name=$2", [[id], name], function (err, results) {
                if (err) {
                    throw err;
                }
                console.log(results.rows);
                req.flash("success_msg", "Joined.");
                res.redirect("/index");
            });
        }
    });
    app.post("/eventLeave", checkNotAuthenticated, function (req, res) {
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
            pool.query("UPDATE events SET attenders=$1 WHERE name=$2", [[], name], function (err, results) {
                if (err) {
                    throw err;
                }
                console.log(results.rows);
                req.flash("success_msg", "Left.");
                res.redirect("/index");
            });
        }
    });
};
