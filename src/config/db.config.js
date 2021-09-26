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

module.exports = { pool };