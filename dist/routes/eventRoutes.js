"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventDbConfig = __importStar(require("../config/db.config"));
var eventExpr = require('express');
var router = new eventExpr.Router();
router.get("/eventManager", eventDbConfig.checkNotAuthenticated, function (_req, res) {
    console.log("=== EVENT MANAGER ====");
    res.render("eventManager.ejs");
});
router.post("/eventAdder", eventDbConfig.checkNotAuthenticated, function (req, res) {
    var _a = req.body, name = _a.name, description = _a.description;
    var errors = [];
    var attenders = [];
    var valami = "sz\u00F6veg " + errors.join() + " ehoehri";
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
        eventDbConfig.pool.query("INSERT INTO events (name, description, attenders)\n                VALUES ($1, $2, $3)\n                RETURNING name, description", [name, description, attenders], function (err, results) {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            req.flash("success_msg", "Event added.");
            res.redirect("/index");
        });
    }
});
router.post("/eventDeleter", eventDbConfig.checkNotAuthenticated, function (req, res) {
    var name = req.body.name;
    var errors = [];
    console.log({
        name: name,
    });
    if (!name) {
        errors.push("Please enter the event name");
    }
    if (errors.length > 0) {
        res.render("eventManager", { errors: errors, name: name });
    }
    else {
        eventDbConfig.pool.query("DELETE FROM events WHERE name=$1", [name], function (err, results) {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            req.flash("success_msg", "Event deleted.");
            res.redirect("/index");
        });
    }
});
router.post("/eventJoin", eventDbConfig.checkNotAuthenticated, function (req, res) {
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
        eventDbConfig.pool.query("UPDATE events SET attenders=$1 WHERE name=$2", [[id], name], function (err, results) {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            req.flash("success_msg", "Joined.");
            res.redirect("/index");
        });
    }
});
router.post("/eventLeave", eventDbConfig.checkNotAuthenticated, function (req, res) {
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
        eventDbConfig.pool.query("UPDATE events SET attenders=$1 WHERE name=$2", [[], name], function (err, results) {
            if (err) {
                throw err;
            }
            console.log(results.rows);
            req.flash("success_msg", "Left.");
            res.redirect("/index");
        });
    }
});
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map