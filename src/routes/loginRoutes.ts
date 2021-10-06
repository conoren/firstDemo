import * as DbConfig  from "../config/db.config";
import bcrypt from 'bcrypt';
import passport from "passport";

const eventExpr = require('express')
const router = new eventExpr.Router()

router.get("/", (req, res) => {
  res.render("login.ejs");
});

router.get("/register", DbConfig.checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

router.post("/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  let errors: { message: string; }[] = [];

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
    DbConfig.pool.query(
      `SELECT * FROM users
            WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.render("register", {
            message: "Email already registered",
          });
        } else {
          DbConfig.pool.query(
            `INSERT INTO users (name, email, password)
                    VALUES ($1, $2, $3)
                    RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
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

router.get("/login", DbConfig.checkAuthenticated, (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/index", DbConfig.checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());

  const getAllEvents = (request, response) => {
    DbConfig.pool.query("SELECT * FROM events ", (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  };

  res.render("index.ejs", { name: req.user.name, events: req.pool });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.render("login.ejs", { message: "You have logged out successfully" });
});

export default router;