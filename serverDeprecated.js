require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const { pool } = require('./src/config/db.config.js')
const {Client} = require('pg')

const client = new Client({
    user:process.env.PGUSER,
    host: "db-toth-aron-do-user-7298387-0.b.db.ondigitalocean.com",
    port: 25060,
    password: process.env.PGPW,
    ssl: { rejectUnauthorized: false },
    database: "defaultdb"
})

client.connect();

const initializePassport = require('./passport-config') //Login miatt
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs') 
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
//requestek parsolására
app.use(express.json())


app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})
  
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


app.get('/eventManger', checkAuthenticated, (req,res)=>{
  res.render('eventManger.ejs')
})
  

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})  
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})
  

app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

//ha jogod van, mehet tovább. különben go login screen
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}
//ha autentikálva van, megy alapértelmezettre. ha nem, megy a megadottra
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
  



client.query('Select * from users', (err,res)=>{
    if(!err){
        console.log(res.rows)
    }
    else{
        console.log(err.message)
    }
    client.end;
})

app.listen(3000)