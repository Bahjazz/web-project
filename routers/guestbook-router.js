const express = require('express')
const db = require('../db')
const router = express.Router()
const MIN_BLOG_TITLE_LENGTH = 2
var csrf = require('csurf')
module.exports = router
router.use(function (request, response, next) {
  response.locals.isLoggedIn = request.session.isLoggedIn
  next()
})
router.use(csrf())

router.use(function(request, response, next){
  response.locals.csrfToken = request.csrfToken();
  next()
})

function getErrorForPost(title, content){
  const validationErrors = []
	
	if(title.length < MIN_BLOG_TITLE_LENGTH ){
    validationErrors.push("title must be at least "+MIN_BLOG_TITLE_LENGTH+" characters.")

  }if(content.length < MIN_BLOG_TITLE_LENGTH ){
    validationErrors.push("content must be at least "+ MIN_BLOG_TITLE_LENGTH+" characters.")
  }
  return validationErrors
}
router.get('/', function (request, response) {
    db.getGuestbook(function(error,guestbook){
      if (error) {
        console.log(error)
        const model ={
          dbError:true
        }
        response.render("error.hbs", { error: " it is not working try again later " })
      } else {
        const model = {
          guestbook,
          dbError: false     
        }
        response.render('guestbook.hbs', model)
      }
    })
  })
  
  router.post('/guestbook', function (request, response) {
    const content = request.body.content
    const title = request.body.title
    const validationErrors = getErrorForPost(title, content);
  if(validationErrors.length==0){
      db.createGuestbook(title, content,function(error){
      if (error) {
        console.log(error)
        const model = {
          dbError: true
        }
        response.redirect('/guestbook', model)
      } else {
        response.redirect('/guestbook')
      }
    })
  }else{
    const model ={
      validationErrors,
    }
    response.render('guestbook.hbs', model)
  }

  })
  
  router.get('/updateguestbookposts/:id', function (request, response) {
    const id = request.params.id
     db.getGuestbookById(id,function(error,guestbook){
      console.log(error)
      if(error){
      const model ={
        dbError:true
      }
      response.render("error.hbs", { error: " it is not working try again later " })
    }else{
      const model = {
      dbError:false,
      guestbook,
      title: "Update guestbook"
  
    }
  
    response.render('updateguestbookposts.hbs', model)
    }

  })
})
  
  router.post('/updateguestbookposts/:id', function (request, response) {
    const id = request.params.id
    const newTitle = request.body.title
    const newContent = request.body.content
    const validationErrors = getErrorForPost(newContent, newTitle);
    if(!request.session.isLoggedIn){
      validationErrors.push("you have to login to update the guestbook")
    }
    if(validationErrors.length==0){
     db.updateGuestbookById(newContent,newTitle, id,function(error){
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
    }else{
      const model={
        guestbook:{
          id,
          content:newContent,
          title:newTitle
        },
        validationErrors
      }
      response.render('updateguestbookposts.hbs', model)
    }
  })
  
  router.post('/deleteguestbookposts/:id', function (request, response) {
    const id = request.params.id
    db.deleteGuestbookById(id,function(error){
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
  router.get('/guestbooks/:id', function (request, response) {
    const id = request.params.id
    db.getGuestbookById(id,function(error,guestbook){
      if (error) {
        console.log(error)
        const model ={
          dbErrorOccured:true
        }
        response.render("error.hbs", { error: " it is not working try again later " })
  
      } else {
        const model = {
          guestbook,
          dbErrorOccured: false
        }
        response.render("guestbooks.hbs", model)
      }
  
    })
  })
