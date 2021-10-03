const eventDbConfig = require("../config/db.config");
const eventExpr = require('express')
const router = new eventExpr.Router()

router.get("/eventManger", eventDbConfig.checkNotAuthenticated, (_req: any, res: { render: (arg0: string) => void; }) => {
    res.render("eventManager.ejs");
});

module.exports = router;