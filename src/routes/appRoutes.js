"use strict";
/*const express = require("express");
//const { pool, checkAuthenticated, checkNotAuthenticated } = require("../config/db.config");
//require("../config/db.config").pool;
//require("../config/db.config").checkAuthenticated;
//require("../config/db.config").checkNotAuthenticated;
const dbConfig = require("../config/db.config");
const passportConfig = require("../config/passport-config");
//require("../config/passport-config").bcrypt;
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const app = express();
require("dotenv").config();

const PORT = 3000;

passportConfig.initializePassport(passport);

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.get("/", (_req: any, res: { render: (arg0: string) => void; }) => {
  res.render("login.ejs");
});

app.get("/eventManger", dbConfig.checkNotAuthenticated, (_req: any, res: { render: (arg0: string) => void; }) => {
  res.render("eventManger.ejs");
});

app.post("/eventAdder", dbConfig.checkNotAuthenticated, (req: { body: { name: any; description: any; }; flash: (arg0: string, arg1: string) => void; }, res: { render: (arg0: string, arg1: { errors: { message: string; }[]; name: any; description: any; }) => void; redirect: (arg0: string) => void; }) => {
  let { name, description } = req.body;

  let errors = [];
  let attenders: never[] = [];

  console.log({
    name,
    description,
  });

  if (!name || !description) {
    errors.push({ message: "Please enter all fields" });
  }

  if (errors.length > 0) {
    res.render("eventManager", { errors, name, description });
  } else {
    pool.query(
      `INSERT INTO events (name, description, attenders)
            VALUES ($1, $2, $3)
            RETURNING name, description`,
      [name, description, attenders],
      (err: any, results: { rows: any; }) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        req.flash("success_msg", "Event added.");
        res.redirect("/index");
      }
    );
  }
});
app.delete("/eventDeleter", dbConfig.checkNotAuthenticated, (req: { body: { name: any; }; flash: (arg0: string, arg1: string) => void; }, res: { render: (arg0: string, arg1: { errors: { message: string; }[]; name: any; }) => void; redirect: (arg0: string) => void; }) => {
  let { name } = req.body;

  let errors = [];

  console.log({
    name,
  });

  if (!name) {
    errors.push({ message: "Please enter the event name" });
  }

  if (errors.length > 0) {
    res.render("eventManager", { errors, name });
  } else {
    pool.query(`DELETE FROM events WHERE name=$1`, [name], (err: any, results: { rows: any; }) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      req.flash("success_msg", "Event deleted.");
      res.redirect("/index");
    });
  }
});
app.post("/eventJoin", dbConfig.checkNotAuthenticated, (req: { body: { name: any; id: any; }; flash: (arg0: string, arg1: string) => void; }, res: { render: (arg0: string, arg1: { errors: { message: string; }[]; name: any; }) => void; redirect: (arg0: string) => void; }) => {
  let { name, id } = req.body;

  let errors = [];

  console.log({
    name,
    id,
  });

  if (!name) {
    errors.push({ message: "Please enter the event name" });
  }

  if (errors.length > 0) {
    res.render("index", { errors, name });
  } else {
    pool.query(
      `UPDATE events SET attenders=$1 WHERE name=$2`,
      [[id], name],
      (err: any, results: { rows: any; }) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        req.flash("success_msg", "Joined.");
        res.redirect("/index");
      }
    );
  }
});
app.post("/eventLeave", dbConfig.checkNotAuthenticated, (req: { body: { name: any; id: any; }; flash: (arg0: string, arg1: string) => void; }, res: { render: (arg0: string, arg1: { errors: { message: string; }[]; name: any; }) => void; redirect: (arg0: string) => void; }) => {
  let { name, id } = req.body;

  let errors = [];

  console.log({
    name,
    id,
  });

  if (!name) {
    errors.push({ message: "Please enter the event name" });
  }

  if (errors.length > 0) {
    res.render("index", { errors, name });
  } else {
    pool.query(
      `UPDATE events SET attenders=$1 WHERE name=$2`,
      [[], name],
      (err: any, results: { rows: any; }) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        req.flash("success_msg", "Left.");
        res.redirect("/index");
      }
    );
  }
});

app.get("/register", dbConfig.checkAuthenticated, (_req: any, res: { render: (arg0: string) => void; }) => {
  res.render("register.ejs");
});
app.post("/register", async (req: { body: { name: any; email: any; password: any; password2: any; }; flash: (arg0: string, arg1: string) => void; }, res: { render: (arg0: string, arg1: { errors?: { message: string; }[]; name?: any; email?: any; password?: any; password2?: any; message?: string; }) => void; redirect: (arg0: string) => void; }) => {
  let { name, email, password, password2 } = req.body;

  let errors = [];

  console.log({
    name,
    email,
    password,
    password2,
  });

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
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
          pool.query(
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
    pool.query("SELECT * FROM events ", (error: any, results: { rows: any; }) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  };

  res.render("index.ejs", { name: req.user.name, events: req.pool });
});

app.get("/logout", (req: { logout: () => void; }, res: { render: (arg0: string, arg1: { message: string; }) => void; }) => {
  req.logout();
  res.render("login.ejs", { message: "You have logged out successfully" });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app, express;
*/ 
