/*const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
//const dbConfig = require("./src/config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  sslmode: dbConfig.SSLMODE,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.events = require("./")


module.exports = db;



*/
const {Client} = require('pg')

const client = new Client({
    host:"localhost",
    user:"doadmin",
    host: "db-toth-aron-do-user-7298387-0.b.db.ondigitalocean.com",
    port: 25060,
    password: process.env.PGPW,
    sslmode = "require",
    database: "defaultdb"
})

//const pgdb = express()
//const port = process.env.PORT || 5432

client.connect();

//pgdb.listen(PORT, console.log('server started'))

client.query('Select * from users', (err,res)=>{
    if(!err){
        console.log(res.rows)
    }
    else{
        console.log(err.message)
    }
    client.end;
})