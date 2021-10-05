import eventRouter from './routes/eventRoutes'
import loginRouter from './routes/loginRoutes'

const express = require('express')
const passportConfig = require("./config/passport-config");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./doc/swagger-output.json');

const app = express();

require("dotenv").config();

const PORT = 3000;

passportConfig.initialize(passport);

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(eventRouter);
app.use(loginRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});