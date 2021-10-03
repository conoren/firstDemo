module.exports = function(app: { get: (arg0: string, arg1: (req: { isAuthenticated: () => any; }, res: { redirect: (arg0: string) => void; }, next: () => any) => any, arg2: (req: any, res: any) => void) => void; post: (arg0: string, arg1: { (req: { isAuthenticated: () => any; }, res: { redirect: (arg0: string) => void; }, next: () => any): any; (req: { isAuthenticated: () => any; }, res: { redirect: (arg0: string) => void; }, next: () => any): any; (req: { isAuthenticated: () => any; }, res: { redirect: (arg0: string) => void; }, next: () => any): any; (req: { isAuthenticated: () => any; }, res: { redirect: (arg0: string) => void; }, next: () => any): any; }, arg2: { (req: any, res: any): void; (req: any, res: any): void; (req: any, res: any): void; (req: any, res: any): void; }) => void; }){
  app.get("/eventManger", checkNotAuthenticated, (req, res) => {
    res.render("eventManger.ejs");
  });

  app.post("/eventAdder", checkNotAuthenticated, (req, res) => {
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
  
  app.post("/eventDeleter", checkNotAuthenticated, (req, res) => {
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
  
  app.post("/eventJoin", checkNotAuthenticated, (req, res) => {
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
  
  app.post("/eventLeave", checkNotAuthenticated, (req, res) => {
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
}