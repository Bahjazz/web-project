const express = require('express')
const bcrypt = require('bcrypt')
var csrf = require('csurf')
var path = require("path")
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const { request } = require('http')
const { title } = require('process')
const expressSession = require("express-session")
const { Console, error } = require('console')
const correctUsername = "Bahja"
const correctPassword = "$2b$10$xNQaZ2YOyqJxGvBZLyRfsudGpNTQdWgsERhNm2lcDYBAUHqR9mG8G"
const session = require('express-session')
//const saltRounds= 10;
const SQLiteStore = require('connect-sqlite3')(expressSession)
const db = require('./db')
const blogpostsRouter = require('./routers/blogposts-router')
const guestboksRouter = require('./routers/guestbook-router')
const portfolioRouter = require('./routers/portfolio-router')


/*
bcrypt.genSalt(saltRounds, function (err, salt) {
  bcrypt.hash(correctPassword, salt , function(err, hash
   ){
     console.log(hash);
   })
  
})
*/

const app = express()

app.engine("hbs", expressHandlebars({
  defaultLayout: 'main.hbs'
}))

app.listen(8080), function () {
  console.log("started as port 8080")
}
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(expressSession({
  secret: "absdefdshjdjfvcbvcvhh",
  saveUninitialized: false,
  resave: false,
  store: new SQLiteStore()
}))

app.use(function (request, response, next) {
  response.locals.isLoggedIn = request.session.isLoggedIn
  next()
})
app.use(csrf())

app.use(function(request, response, next){
  response.locals.csrfToken = request.csrfToken();
  next()
})
app.use("/blogposts", blogpostsRouter)
app.use("/guestbook", guestboksRouter)
app.use("/portfolio", portfolioRouter)



app.get("/home", function (request, response) {

  response.render("home.hbs")
})
app.get("/about", function (request, response) {

  response.render("about.hbs")
})


app.get('/', function (request, response) {

  response.render("home.hbs")
})

app.get('/contact', function (request, response) {

  response.render('contact.hbs')
})

app.get("/login", function (request, response) {
  const model = {
    loginError: false
  }
  response.render('login.hbs', model)

})

app.get('/error', function(request, response){
  request.session.isLoggedIn=true
  response.render()
})
app.post("/login", function (request, response) {
  console.log("LOGIN")
  const enteredUsername = request.body.username
  const enteredPassword = request.body.password
  console.log(enteredUsername);
  console.log(correctUsername);
  if (enteredUsername == correctUsername) {
    bcrypt.compare(enteredPassword, correctPassword, function (err, result) {
      if (result) {
        request.session.isLoggedIn = true
        console.log("Userdata correct")
        response.redirect('/blogposts/admin')
      } else {
        const model = {
          loginError: true
        }
        response.render('login.hbs', model)

      }
    })

  } else {
    console.log("Userdata wrong")
    const model = {
      loginError: true
    }
    response.render('login.hbs', model)
  }

})



app.get('/logout', function (request, response) {
  request.session.isLoggedIn = false
  response.redirect('/home')

})


app.use('/dist', express.static(path.join(__dirname, 'dist')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/views', express.static(path.join(__dirname, 'views')))
