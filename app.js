const express = require('express')
const sqlite3 = require('sqlite3')
const expressHandlebars = require('express-handlebars')
var path = require("path")
const app = express()
const bodyParser = require('body-parser')

const { request } = require('http')
const { title } = require('process')
const expressSession = require("express-sessions")
const correctUsername = "Bahjazz"
const correctPassword = "bahja12"

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

app.engine("hbs", expressHandlebars({
  defaultLayout: 'main.hbs'
}))
app.use(express.static("static"))

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(expressSession({
  secret: "absdefdshjdjfvcbvcvhh",
  saveUninitialized: false,
  resave: false
}))

app.get("/home", function (request, response) {
  const model = {
    isLoggedIn: true,
  }
  response.render("home.hbs", model)
})
app.get("/about", function (request, response) {
  const model = {
    isLoggedIn: true,
  }
  response.render("about.hbs", model)
})

app.use(function (request, response, next) {
  response.locals.isLoggedIn = request.session.isLoggedIn
  next()
})

app.get('/', function (request, response) {
  const model = {
    isLoggedIn: true,

  }
  response.render("home.hbs", model)
})

app.get('/contact', function (request, response) {
  const model = {
    isLoggedIn: true,
  }
  response.render('contact.hbs', model)
})

app.get('/admin', function (request, response) {
  const query = "SELECT * FROM blogposts ORDER BY id"
  db.all(query, function (error, blogpost) {
    if (error) {
      console.log(error)
      // send back.error page.   
      const model = {
        dbErrorOccured: true
      }
      response.render('admin.hbs', model)
    } else {
      const model = {
        blogpost,
        isLoggedIn: true,
        dbErrorOccured: false
      }
      response.render('admin.hbs', model)
    }
  })

})

app.post('/admin', function (request, response) {
  const content = request.body.content
  const title = request.body.title
  const query = "INSERT INTO blogposts( title, content) VALUES (?, ?)"
  const values = [title, content]
  db.run(query, values, function (error) {

    if (error) {
      console.log(error)
      // dispaly error.
    } else {
      response.redirect('/blogposts/' + this.lastID)
    }
  })
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
        isLoggedIn: true
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
  db.get(query, values, function (error) {
    if (error) {
      console.log(error)
      const model = {
        blogposts,
        isLoggedIn: true,
        dbError: true
      }
      response.redirect('/guestbook')
    } else {
      const model = {
        blogposts,
        isLoggedIn: true,
        dbError: false
      }
      response.redirect('/guestbook')

    }

  })
})

app.get('/updateguestbookposts/:id', function (request, response) {
  const id = request.params.id
  const query = "SELECT * FROM guestbooks where id =?";
  const model = {
    guestbook,
    isLoggedIn: true,
    title: "Update guestbook"
  }
  response.render('updateguestbookposts.hbs', model)
})

app.post('/updateguestbookposts/:id', function (request, response) {
  const id = request.params.id
  const query = "UPDATE guestbookposts SET content = ?, title =? WHERE id ="
  const newTitle = request.body.title
  const newContent = request.body.content
  const values = [newTitle, newContent, id]
  guestbook.title = newTitle
  guestbook.content = newContent
  db.run(query, values, function (error) {
    if (error) {
      console.log(error)
      const model = {
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
  const values = [id]
  db.get(query, values, function (error) {
    if (error) {
      console.log(error)
      const model = {
        blogposts,
        isLoggedIn: true,
        dbError: true
      }
      response.render("updateblogpost.hbs", model)
    } else {
      const model = {
        blogposts,
        isLoggedIn: true,
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
  const query = "UPDATE blogposts SET name = ? WHERE id =?";
  db.run(query, values, function (error, blogposts) {
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

app.get('/blogposts/:id', function (request, response) {
  const id = request.params.id
  const query = "SELECT * FROM blogposts WHERE id =?";
  const values = [id]
  db.all(query, values, function (error, blogposts) {
    if (error) {
      console.log(error)
      const model = {
        blogposts,
        dbErrorOccured: true
      }
      response.render("blogposts.hbs", model)
    } else {
      const model = {
        blogposts,
        dbErrorOccured: false
      }
      response.render("blogposts.hbs", model)
    }
  })
})



app.get("/guestbook", function (request, response) {
  const id = request.params.id
  const query = "SELECT* FROM guestbook WHERE id =?"
  const values = [id]
  db.get(query, values, function (error, guestbook) {
    if (error) {
      console.log(error)
      const model = {
        dbErrorOccured: true
      }
      response.render("guestbook.hbs", model)
    } else {
      const model = {
        dbErrorOccured: false
      }
      response.render("guestbook.hbs", model)

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

app.post('/deleteguestpost/:id', function (request, response) {
  const id = request.params.id
  const query = "DELETE FROM guestbook WHERE id = ?"
  db.get(query, values, function (error, blogpost) {
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

app.get('/blogpost/:id', function (request, response) {
  const id = request.params.id
  const query = "SELECT * FROM blogposts WHERE id = ?"
  const values = [id]
  db.get(query, values, function (error, blogpost) {
    if (error) {
      console.log(error)
      const model = {
        dbErrorOccured: true
      }
      response.render("blogpost.hbs", model)
    } else {
      const model = {
        dbErrorOccured: false
      }
      response.render("blogpost.hbs", model)
    }

  })
})

app.get('/login', function (request, response, next) {
  const model = {
    layout: false,
  }
  response.render('login.hbs', model)

})
app.post('/login', function (request, response) {
  const username = request.body.username
  const Password = request.body.password
  if (username == correctUsername && Password == correctPassword) {
    request.session.isLoggedIn = true
    response.redirect('/')
  } else {
    // TODO: dont redirect,display error massage
  } response.redirect('/login.hbs')
  const model = {
    layout: false,

  }

})
app.get('/home', function (request, response) {
  request.session.isLoggedIn = false
  response.redirect('/home')

})

app.listen(8080)
app.use('/dist', express.static(path.join(__dirname, 'dist')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/views', express.static(path.join(__dirname, 'views')))
