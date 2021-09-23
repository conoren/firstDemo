const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')

const {Client} = require('pg')

const client = new Client({
    host:"localhost",
    user:"postgres",
    port: 5432,
    password: process.env.PGPW,
    database: "postgres"
})

const pgdb = express()
const port = process.env.PORT || 5432

client.connect();

pgdb.listen(PORT, console.log('server started'))

client.query('Select * from users', (res,req))