const dummyData = require('./dummy-data')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require('path'); 

const app = express()

app.engine("hbs", expressHandlebars({
  defaultLayout: 'main.hbs'
}))

app.get('/', function(request, response){
   const model = {
    humans: dummyData.humans
  }
  response.render("show-all-humans.hbs", model) 
})

app.listen(8080)

app.get('/about', function(request, response){
  response.render("about.hbs")
})

app.get('/index', function(request, response){
  response.render("index.hbs")
})

app.get('/contact', function(request, response){
  response.render("contact.hbs")
})



app.use('/dist', express.static(path.join(__dirname, 'dist')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/static', express.static(path.join(__dirname, 'views')))

