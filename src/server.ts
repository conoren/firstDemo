import eventRouter from './routes/eventRoutes'
import loginRouter from './routes/loginRoutes'
import userRouter from './routes/userRoutes'
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { jwt } from './middlewares/auth'


const passportConfig = require("./config/passport-config");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./doc/swagger-output.json');

const app = express();

require("dotenv").config();

const PORT = 3000;

app.use(jwt())

app.use(cors());

passportConfig.initialize(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.urlencoded({ extended: false }));
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
app.use(userRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});