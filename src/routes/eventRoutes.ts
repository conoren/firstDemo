import * as eventDbConfig  from "../config/db.config";
const eventExpr = require('express')
//import express from 'express';
const router = new eventExpr.Router()

router.get("/eventManager", eventDbConfig.checkNotAuthenticated, (_req: any, res: { render: (arg0: string) => void; }) => {
    console.log("=== EVENT MANAGER ====")
    res.render("eventManager.ejs");
});

router.post("/eventAdder", eventDbConfig.checkNotAuthenticated, (req: { body: { name: any; description: any; }; flash: (arg0: string, arg1: string) => void; }, res: { render: (arg0: string, arg1: { errors: { message: string; }[]; name: any; description: any; }) => void; redirect: (arg0: string) => void; }) => {
    let { name, description } = req.body;
  
    let errors: { message: string; }[] = [];
    let attenders: never[] = [];
    let valami = `szöveg ${errors.join()} ehoehri`
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
      eventDbConfig.pool.query(
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
  
  router.post("/eventDeleter", eventDbConfig.checkNotAuthenticated, (req,res) => {
    let { name } = req.body;
  
    let errors: string[] = [];
  
    console.log({
      name,
    });
  
    if (!name) {
      errors.push("Please enter the event name");
    }
  
    if (errors.length > 0) {
      res.render("eventManager", { errors, name });
    } else {
      eventDbConfig.pool.query(`DELETE FROM events WHERE name=$1`, [name], (err: any, results: { rows: any; }) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        req.flash("success_msg", "Event deleted.");
        res.redirect("/index");
      });
    }
  });

  router.post("/eventJoin", eventDbConfig.checkNotAuthenticated, (req: { body: { name: any; id: any; }; flash: (arg0: string, arg1: string) => void; }, res: { render: (arg0: string, arg1: { errors: { message: string; }[]; name: any; }) => void; redirect: (arg0: string) => void; }) => {
    let { name, id } = req.body;
  
    let errors:{ message: string; }[] = [];
  
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
      eventDbConfig.pool.query(
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
  
  router.post("/eventLeave", eventDbConfig.checkNotAuthenticated, (req: { body: { name: any; id: any; }; flash: (arg0: string, arg1: string) => void; }, res: { render: (arg0: string, arg1: { errors: { message: string; }[]; name: any; }) => void; redirect: (arg0: string) => void; }) => {
    let { name, id } = req.body;
  
    let errors:{ message: string; }[] = [];
  
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
      eventDbConfig.pool.query(
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

export default router;