const express = require('express')
const expressHandlebars = require('express-handlebars')
var path=require("path")
const app = express()
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({
  extended: false
}))

const blogs = [{
  id: 0,
  title: "Bahja",
  content: "I like you"
}, {
  id: 1,
  title: "Lol",
  content: "Hejsan"
}]

const guestbooks = [{
  id: 0,
  title: "Bahja",
  content: "I like you"
}, {
  id: 1,
  title: "Bahja",
  content: "LOL"
}]

app.engine("hbs", expressHandlebars({
  defaultLayout: 'main.hbs'
}))

app.get('/', function(request, response){
  const model = {
    isLoggedIn: true,

  }
  response.render("home.hbs", model)
})
app.get('/contact', function(request, response){
  const model = {
    isLoggedIn: true,
  }
  response.render('contact.hbs', model)
})

app.get('/admin', function(request, response){
  const model = {
    blogs: blogs,
    isLoggedIn: true,
  }
  response.render('admin.hbs', model)
})

app.post('/admin', function(request, response){
  const content = request.body.content
  const title = request.body.title
  const blog = {
    id: blogs.length + 1,
    title, 
    content,
  }
  blogs.push(blog)
  response.redirect('/blogposts')
})

app.get('/guestbook', function(request, response){
  const model = {
    guestbooks: guestbooks,
    isLoggedIn: true,
  }
  response.render('guestbook.hbs', model)
})

app.post('/guestbook', function(request, response){
  const content = request.body.content
  const title = request.body.title
  const guestbook = {
    id: guestbooks.length + 1,
    title, 
    content,
  }
  guestbooks.push(guestbook)
  response.redirect('/guestbook')
})

app.get('/updateguestbookposts/:id', function(request, response) {
  const id = request.params.id
  const guestbook = guestbooks.find(
    h => h.id == id
  )
  const model = {
    guestbook,
    isLoggedIn: true,
    title: "Update guestbook"
  }
  response.render('updateguestbookposts.hbs', model)
})

app.post('/updateguestbookposts/:id', function(request, response) {
  const id = request.params.id
  const newTitle = request.body.title
  const newContent = request.body.content
  const guestbook = guestbooks.find(
    h => h.id == id
  )
  guestbook.title = newTitle
  guestbook.content = newContent

  response.redirect("/guestbook")
})

app.get('/updateblogpost/:id', function(request, response) {
  const id = request.params.id
  const blog = blogs.find(
    h => h.id == id
  )
  const model = {
    blog,
    isLoggedIn: true,
    title: "Update blogpost"
  }
  response.render('updateblogpost.hbs', model)
})

app.post('/updateblogpost/:id', function(request, response) {
  const id = request.params.id
  const newTitle = request.body.title
  const newContent = request.body.content
  const blog = blogs.find(
    h => h.id == id
  )
  blog.title = newTitle
  blog.content = newContent

  response.redirect("/blogposts")
})

app.get('/blogposts', function(request, response){
  const id = request.params.id
  const blog = blogs.find(
    h => h.id == id
  )
  const model = {
    blogs,
    isLoggedIn: true
  }
  response.render('blogposts.hbs', model)
})
app.get('/login', function(request, response){
  const model = {
    layout: false,
  }
  response.render('login.hbs', model)
})
app.get("/home", function(request, response){
  const model = {
    isLoggedIn: true,
  }
  response.render("home.hbs", model)
})
app.get("/about", function(request, response){
  const model={
    isLoggedIn: true
  }
  response.render("about.hbs")
})
app.get("/guestbook", function(request, response){
  const model = {
    isLoggedIn: true,
  }
  response.render("guestbook.hbs", model)
})

app.post('/deletepost/:id', function(request, response) {
  const id = request.params.id
  const postIndex = blogs.findIndex(
    h => h.id == id
  )
  blogs.splice(postIndex, 1)
  response.redirect('/blogposts')
})

app.post('/deletegpost/:id', function(request, response) {
  const id = request.params.id
  const gpostIndex = guestbooks.findIndex(
    h => h.id == id
  )
  guestbooks.splice(gpostIndex, 1)
  response.redirect('/guestbook')
})


app.listen(8080)
app.use('/dist', express.static(path.join(__dirname, 'dist')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/views', express.static(path.join(__dirname, 'views')))