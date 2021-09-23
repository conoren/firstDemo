const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')

const initializePassport = require('./passport-config')
initializePassport(passport)

const usersDB = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', (req,res)=>{
    res.render('index.ejs', {name: "Áron"})
})


app.get('/login', (req,res)=>{
    res.render('login.ejs')
})
app.post('/login',(req,res)=>{
    
})


app.get('/register', (req,res)=>{
    res.render('register.ejs')
})
app.post('/register',(req,res)=>{
    try{
        const hashedPassword = bcrypt.hash(req.body.password, 10)
        usersDB.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(usersDB)
})

app.listen(3000)