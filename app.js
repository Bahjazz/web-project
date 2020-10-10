const express = require('express')
const sqlite3 = require('sqlite3')
const expressHandlebars = require('express-handlebars')
var path = require("path")
const app = express()
const bodyParser = require('body-parser')
const { request } = require('http')
const { title } = require('process')
const expressSession = require("express-session")
const { Console } = require('console')
const correctUsername = "Bahja"
const correctPassword = "$2b$10$xNQaZ2YOyqJxGvBZLyRfsudGpNTQdWgsERhNm2lcDYBAUHqR9mG8G"
const bcrypt= require('bcrypt')
//const saltRounds= 10;
const db = new sqlite3.Database("my-database.db")

db.run(`
   CREATE TABLE IF NOT EXISTS guestbook(
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
   )
  `)
db.run(`
  CREATE TABLE IF NOT EXISTS blogposts(
   Id INTEGER PRIMARY KEY AUTOINCREMENT,
   title TEXT,
   content TEXT
  )
 `)

 db.run(`
 CREATE TABLE IF NOT EXISTS portfolio(
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  content TEXT
 )
`)

 /*
 bcrypt.genSalt(saltRounds, function (err, salt) {
   bcrypt.hash(correctPassword, salt , function(err, hash
    ){
      console.log(hash);
    })
   
 })
 */
  
 app.listen(8080), function(){
  console.log("started as port 8080")
}

app.engine("hbs", expressHandlebars({
  defaultLayout: 'main.hbs'
}))

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(expressSession({
  secret: "absdefdshjdjfvcbvcvhh",
  saveUninitialized: false,
  resave: false
}))


app.get("/home", function (request, response) {
  
  response.render("home.hbs")
})
app.get("/about", function (request, response) {
  
  response.render("about.hbs")
})

app.use(function (request, response, next) {
  response.locals.isLoggedIn = request.session.isLoggedIn
  next()
})

app.get('/', function (request, response) {

  response.render("home.hbs")
})

app.get('/contact', function (request, response) {
 
  response.render('contact.hbs')
})

app.get('/admin', function (request, response) {
  response.render('admin.hbs')
})

app.post('/admin', function (request, response) {
  const content = request.body.content
  const title = request.body.title
  const query = "INSERT INTO blogposts( title, content) VALUES (?, ?)"
  const values = [title, content]
  db.run(query, values, function(error) {
    if (error) {
      console.log(error)
      // dispaly error.
    } else {
      response.redirect('/blogposts')
    }
  })
})



app.get('/updateguestbookposts/:id', function (request, response) {
  const id = request.params.id
  const query = "SELECT * FROM guestbook where id =?";
  db.get(query,[id] ,function(error, guestbook){
    console.log(error)
  const model = {
    guestbook,
    title: "Update guestbook"

  }
  response.render('updateguestbookposts.hbs', model)
})
})

app.post('/updateguestbookposts/:id', function (request, response) {
  const id = request.params.id
  const query = "UPDATE guestbook SET content = ?, title =? WHERE id =?"
  const newTitle = request.body.title
  const newContent = request.body.content
  const values = [newContent,newTitle, id]
  db.get(query, values, function (error, guestbook) { 

    if (error) {
      console.log(error)
      const model = {
        guestbook,
        dbErrorOccured: true
      }
      response.redirect("/guestbook")

    } else {
      const model = {
        dbErrorOccured: false
      }
      response.redirect("/guestbook")

    }
  })

})

app.get('/updateblogpost/:id', function (request, response) {
  const id = request.params.id
  const query = "SELECT * FROM blogposts WHERE id =?";
  db.get(query,[id], function (error,blogpost) {
    if (error) {
      console.log(error)
    } else {
      const model = {
        blogpost,
        dbError: false
      }
      response.render("updateblogpost.hbs", model)
    }
  })
})

app.post('/updateblogpost/:id', function (request, response) {
  const id = request.params.id
  const newTitle = request.body.title
  const newContent = request.body.content
  const values = [newTitle, newContent, id]
  const query = "UPDATE blogposts SET title = ?, content = ? WHERE id =?"
  db.run(query, values, function (error, blogpost) {
    if (error) {      
      console.log(error)
      const model ={
        blogpost,
        dbErrorOccured:true
      }
      response.redirect('/blogposts')
    } else {
      const model = {
          dbErrorOccured: false
        
      }
      response.redirect('/blogposts')
    }

  })
})

app.get('/blogposts', function (request, response) {
  const id = request.params.id
  const query = "SELECT * FROM blogposts ORDER BY id";
  db.all(query, [id], function (error, blogposts) {
    if (error) {
      console.log(error)
    } else {
      const model = {
        blogposts,
      }
      response.render("blogposts.hbs", model)
    }
  })
})

app.post('/blogposts', function (request, response) {      
  const model = {
        blogpost: blogposts,
      }
      response.render("blogposts.hbs", model)
  })

app.get('/guestbook', function (request, response) {
  const query = "SELECT * FROM guestbook ORDER BY id DESC"
  db.all(query, function (error, guestbook) {
    if (error) {
      console.log(error)
      // send back.error page. 
    } else {
      const model = {
        guestbook,
        
      }
      response.render('guestbook.hbs', model)
    }
  })
})



app.post('/guestbook', function (request, response) {
  const content = request.body.content
  const title = request.body.title
  const query = "INSERT INTO guestbook(title, content) VALUES (?, ?)"
  const values = [title, content]
  db.get(query, values, function (error, guestbook) {
    if (error) {
      console.log(error)
      response.redirect('/guestbook', model)
    } else {
      const model = {
        dbError: false
      }
      response.redirect('/guestbook')

    }

  })
})



app.post('/deletepost/:id', function (request, response) {
  const id = request.params.id
  const query = "DELETE FROM blogposts WHERE id = ?"
  db.run(query, [id], function (error) {
    if (error) {
      console.log(error)
      const model = {
        dbErrorOccured: true
      }
      response.redirect('/blogposts')
    } else {
      const model = {
        dbErrorOccured: false
      }
      response.redirect('/blogposts')
    }

  })
})
app.post('/deleteguestbookposts/:id', function (request, response) {
  const id = request.params.id
  const query = "DELETE FROM guestbook WHERE id = ?"
  db.get(query, [id], function (error) {
    if (error) {
      console.log(error)
      const model = {
        dbErrorOccured: true
      }
      response.redirect('/guestbook')
    } else {
      const model = {
        dbErrorOccured: false
      }
      response.redirect('/guestbook')
    }
  })
})

app.get('/blogpost/:id', function(request, response){
  const id = request.params.id
  const query = "SELECT * FROM blogposts WHERE id = ?"
  db.get(query, [id], function(error, blogposts){
    if(error){
      console.log(error)
    }else{
      const model = {
        blogposts
      }
      response.render('blogpost.hbs', model)
    }
  })
})
app.get('/guestbooks/:id', function (request, response) {
  const id = request.params.id
  const query = "SELECT * FROM guestbook WHERE id = ?"
  const values = [id]
  db.get(query, values, function (error, guestbook) {
    if (error) {
      console.log(error)
    } else {
      const model = {
        guestbook,
        dbErrorOccured: false
      }
      response.render("guestbooks.hbs", model)
    }

  })
})

app.get('/portfolio', function (request, response) {
  const id = request.params.id
  const query = "SELECT * FROM portfolio ORDER BY id DESC";
  db.all(query, [id], function (error, portfolio) {
    if (error) {
      console.log(error)
    } else {
      const model = {
        portfolio,
      }
      response.render("portfolio.hbs", model)
    }
  })
})



app.post('/portfolio', function (request, response) {      
  const name = request.body.name
  const content = request.body.content
  const query = "INSERT INTO portfolio(name, content) VALUES (?, ?)"
  const values = [name, content]
  db.get(query, values, function (error, portfolio) {
    if (error) {
      console.log(error)
      response.redirect('/portfolio')
    } else {
      const model = {
        portfolio,
        dbError: false
      }
      response.redirect('/portfolio')

    }

  })
})

app.get('/update-portfolio/:id', function (request, response) {
  const id = request.params.id
  const query = "SELECT * FROM portfolio WHERE id = ?";
  db.get(query,[id], function (error,portfolio) {
    if (error) {
      console.log(error)
    } else {
      const model = {
        portfolio,
        dbError: false
      }
      response.render("update-portfolio.hbs", model)
    }
  })
})

app.post('/update-portfolio/:id', function (request, response) {
  const id = request.params.id  
  const newName = request.body.name
  const newContent = request.body.content
  const values = [newName, newContent, id]  
  const query = "UPDATE portfolio SET name = ?, content = ? WHERE id =?"
  db.run(query, values, function (error, portfolio) {
    if (error) {
      console.log(error)
      const model = {
        portfolio,
        dbErrorOccured: true
      }
      response.redirect('/portfolio')

    } else {
      const model = {
        dbErrorOccured: false
      }
      response.redirect('/portfolio')
    }

  })
})


app.post('/deleteportfoliopost/:id', function (request, response) {
  const id = request.params.id
  const query = "DELETE FROM portfolio WHERE id = ?"
  db.run(query, [id], function (error) {
    if (error) {
      console.log(error)
      const model = {
        dbErrorOccured: true
      }
      response.redirect('/portfolio')
    } else {
      const model = {
        dbErrorOccured: false
      }
      response.redirect('/portfolio')
    }

  })
})
app.get('/portfolios/:id', function(request, response){
  const id = request.params.id
  const query = "SELECT * FROM portfolio WHERE id = ?"
  db.get(query, [id], function(error, portfolio){
    if(error){
      console.log(error)
    }else{
      const model = {
        portfolio
      }
      response.render('portfolios.hbs', model)
    }
  })
})

app.get("/login" , function (request, response) {
  const model = {
    loginError: false
  }
  response.render('login.hbs', model)

})


app.post("/login" , function (request, response) { 
  console.log("LOGIN")
   const enteredUsername = request.body.username
   const enteredPassword = request.body.password
   console.log(enteredUsername);
   console.log(correctUsername);
  if (enteredUsername == correctUsername) {
    bcrypt.compare(enteredPassword, correctPassword, function(err,result){
      if (result) {
        request.session.isLoggedIn = true
        console.log("Userdata correct")
        response.redirect('/admin')
      }else {
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
