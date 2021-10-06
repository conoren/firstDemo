import {Pool} from 'pg'
import { User, Userxevents, Event } from '../interfaces/jwtInterfaces';
require("dotenv").config();


const pool = new Pool({
  user:process.env.PGUSER,
  host: "db-toth-aron-do-user-7298387-0.b.db.ondigitalocean.com",
  port: 25060,
  password: process.env.PGPW,
  ssl: { rejectUnauthorized: false },
  database: "defaultdb"
});

var users: User = pool.query(`SELECT * FROM users`,(err,results)=>{
  users=results.rows
})
var events: Event = pool.query(`SELECT * FROM events`,(err,results)=>{
  events=results.rows
})
var usersxevents: Userxevents = pool.query(`SELECT * FROM usersxevents`,(err,results)=>{
  usersxevents=results.rows
})


function checkAuthenticated(req: { isAuthenticated: () => any; }, res: { redirect: (arg0: string) => any; }, next: () => void) {
  if (req.isAuthenticated()) {
    return res.redirect("/index");
  }
  next();
}
function checkNotAuthenticated(req: { isAuthenticated: () => any; }, res: { redirect: (arg0: string) => void; }, next: () => any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

export {
  pool, checkAuthenticated, checkNotAuthenticated, users, events, usersxevents
};