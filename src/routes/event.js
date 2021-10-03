"use strict";
var eventDbConfig = require("../config/db.config");
var eventExpr = require('express');
var router = new eventExpr.Router();
router.get("/eventManger", eventDbConfig.checkNotAuthenticated, function (_req, res) {
    res.render("index.ejs");
});
module.exports = router;
