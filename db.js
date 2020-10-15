
const sqlite3 = require('sqlite3')
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

/*guestbook*/


exports.getGuestbook = function(callback){
    const query = "SELECT * FROM guestbook ORDER BY id DESC";
     db.all(query, function(error,guestbook){
        callback(error, guestbook)
     })
}
exports.createGuestbook = function(title, content, callback){
   const query = "INSERT INTO guestbook(title, content) VALUES (?, ?)"
   const values = [title, content]
    db.run(query, values, function (error) {
               callback(error)
})

}

exports.updateGuestbookById =function(newContent,newTitle, id, callback){
   const query = "UPDATE guestbook SET content = ?, title =? WHERE id =?"
   const values = [newContent,newTitle, id]
   db.get(query, values, function (error, guestbook) { 
    callback(error)

    })

}
exports.deleteGuestbookById = function(id, callback){
const query = "DELETE FROM guestbook WHERE id = ?"
const values =[id]
  db.get(query, values, function (error) {
     callback(error)
  })
}
exports.getGuestbookById= function(id, callback){
   const query = "SELECT * FROM guestbook where id =?";
   const values = [id] 
   db.get(query,values,function(error, guestbook){
     callback(error,guestbook)
   })
}

 /*blogpost*/


exports.getBlogposts =function(callback){
   const query = "SELECT * FROM blogposts ORDER BY id DESC";
   db.all(query, function (error, blogposts) {
      callback(error, blogposts)
   })
}
exports.createBlogposts = function(title, content, callback){
   const query = "INSERT INTO blogposts( title, content) VALUES (?, ?)"
   const values = [title, content]
   db.run(query, values, function(error) {
          callback(error)
   })
}

exports.getBlogpostById= function(id, callback){
   const query = "SELECT * FROM blogposts where id =?";
   const values = [id] 
   db.get(query,values,function(error, blogpost){
     callback(error,blogpost)
   })
}
exports.updateBlogpostById =function(newContent,newTitle, id, callback){
   const query = "UPDATE blogposts SET content = ?, title =? WHERE id =?"
   const values = [newContent,newTitle, id]
   db.get(query, values, function (error, blogpost) { 
    callback(error)

    })

}
exports.deletePostById = function(id, callback){
const query = "DELETE FROM blogposts WHERE id = ?"
const values =[id]
  db.get(query, values, function (error) {
     callback(error)
  })
}

/*portfolio*/

exports.getPortfolio = function(callback){
   const query = "SELECT * FROM portfolio ORDER BY id DESC";
   db.all(query, function (error, portfolio) {
      callback(error, portfolio)

      })

}
exports.createPortfolio = function(name,content,callback){
   const query = "INSERT INTO portfolio(name, content) VALUES (?, ?)"
   const values = [name, content]
   db.get(query, values, function (error) {
       callback(error)
})
}


exports.getPortfoliopostById= function(id, callback){
   const query = "SELECT * FROM portfolio where id =?";
   const values = [id] 
   db.get(query,values,function(error, portfolio){
     callback(error,portfolio)
   })
}
exports.updatePortfoliopostById =function(newContent,newName, id, callback){
   const query = "UPDATE portfolio SET name = ?, content = ? WHERE id =?"
   const values = [newName,newContent, id]
   db.get(query, values, function (error) { 
    callback(error)

    })

}
exports.deletePortfoliopostById = function(id, callback){
const query = "DELETE FROM portfolio WHERE id = ?"
const values =[id]
  db.get(query, values, function (error) {
     callback(error)
  })
}












