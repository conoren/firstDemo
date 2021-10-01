require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user:process.env.PGUSER,
  host: "db-toth-aron-do-user-7298387-0.b.db.ondigitalocean.com",
  port: 25060,
  password: process.env.PGPW,
  ssl: { rejectUnauthorized: false },
  database: "defaultdb"
});

function checkAuthenticated(req: { isAuthenticated: () => any; }, res: { redirect: (arg0: string) => any; }, next: () => void) {
  if (req.isAuthenticated()) {
    return res.redirect("/index");
  }
  next();
}
function checkNotAuthenticated(req: { isAuthenticated: () => any; }, res: { redirect: (arg0: string) => void; }, next: () => any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = { pool, checkAuthenticated, checkNotAuthenticated };