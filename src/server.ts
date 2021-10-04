//import express from 'express'
const express = require('express')
const dbConfig = require("./config/db.config");
const passportConfig = require("./config/passport-config");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./doc/swagger-output.json');
//const eventRouter = require('./routes/event')
import router from './routes/event'
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

app.use(router);


app.get("/", (_req: any, res: { render: (arg0: string) => void; }) => {
  res.render("login.ejs");
});

app.get("/register", dbConfig.checkAuthenticated, (_req: any, res: { render: (arg0: string) => void; }) => {
  res.render("register.ejs");
});

app.post("/register", async (req: { body: { name: any; email: any; password: any; password2: any; }; flash: (arg0: string, arg1: string) => void; },res: { render: (arg0: string, arg1: { errors?: { message: string; }[]; name?: any; email?: any; password?: any; password2?: any; message?: string; }) => void; redirect: (arg0: string) => void; }) => {
  var { name, email, password, password2 } = req.body;

  let errors: string[] = [];

  console.log({
    name,
    email,
    password,
    password2,
  });

  if (!name || !email || !password || !password2) {
    errors.push("Please enter all fields");
  }

  if (password.length < 6) {
    errors.push("Password must be a least 6 characters long");
  }

  if (password !== password2) {
    errors.push("Passwords do not match");
  }

  if (errors.length > 0) {
    res.render("register", { name, email, password, password2 });
  } else {
    const hashedPassword = await passportConfig.bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    dbConfig.pool.query(
      `SELECT * FROM users
          WHERE email = $1`,
      [email],
      (err: any, results: { rows: string | any[]; }) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.render("register", {
            message: "Email already registered",
          });
        } else {
            dbConfig.pool.query(
            `INSERT INTO users (name, email, password)
                  VALUES ($1, $2, $3)
                  RETURNING id, password`,
            [name, email, hashedPassword],
            (err: any, results: { rows: any; }) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/login");
            }
          );
        }
      }
    );
  }
});

app.get("/login", dbConfig.checkAuthenticated, (req: any, res: { render: (arg0: string) => void; }) => {
  res.render("login.ejs");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/index", dbConfig.checkNotAuthenticated, (req: { isAuthenticated: () => any; user: { name: any; }; pool: any; }, res: { render: (arg0: string, arg1: { name: any; events: any; }) => void; }) => {
  console.log(req.isAuthenticated());

  const getAllEvents = (request: any, response: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): void; new(): any; }; }; }) => {
    dbConfig.pool.query("SELECT * FROM events ", (error: any, results: { rows: any; }) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  };

  res.render("index.ejs", { name: req.user.name, events: req.pool });
});

app.get("/logout", (req: { logout: () => void; }, res: { render: (arg0: string, arg1: { message: string; }) => void; }, message: any) => {
  req.logout();
  res.render("login.ejs", { message: "You have logged out successfully" });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});