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

function getErrorForPost(name, content){
  const validationErrors = []
		
    if(name.length < MIN_BLOG_TITLE_LENGTH ){
      validationErrors.push("name must be at least "+MIN_BLOG_TITLE_LENGTH+" characters.")
  
    }if(content.length < MIN_BLOG_TITLE_LENGTH ){
      validationErrors.push("content must be at least "+ MIN_BLOG_TITLE_LENGTH+" characters.")
  
    } return validationErrors
  }

router.get('/', function (request, response) {
    const id = request.params.id
   db.getPortfolio(function(error,portfolio){
      if (error) {
        console.log(error)
        response.render("error.hbs", { error: " it is not working try again later " })
      } else {
        const model = {
          portfolio,
          dbErrorOccured:false
        }
        response.render("portfolio.hbs", model)
      }
    })
  })
  
  router.post('/portfolio', function (request, response) {      
    const name = request.body.name
    const content = request.body.content
    const validationErrors = getErrorForPost(name, content);
    if(validationErrors.length==0){
      db.createPortfolio(name, content,function(error){
      if (error) {
        console.log(error)
        response.redirect('/portfolio')
      } else {
        const model = {
          dbError: false
        }
        response.redirect('/portfolio')
  
      }
  
    })
  }else{
    const model ={
      validationErrors
    }
    response.render("portfolio.hbs", model)

  }
  })
  
  router.get('/update-portfolio/:id', function (request, response) {
    const id = request.params.id
    db.getPortfoliopostById(id,function(error,portfolio){
      console.log(error)
      if (error) {
        const model={
          dbError:true
        }
        response.render("update-portfolio.hbs", model)
      } else {
        const model = {
          portfolio,
          dbError: false
        }
        response.render("update-portfolio.hbs", model)
      }
    })
  })
  
  router.post('/update-portfolio/:id', function (request, response) {
    const id = request.params.id  
    const newName = request.body.name
    const newContent = request.body.content
    const validationErrors = getErrorForPost(newContent, newName);
    if(!request.session.isLoggedIn){
      validationErrors.push("you have to login to update the portfolio") 
    }
    if(validationErrors.length==0){
    db.updatePortfoliopostById(newContent,newName, id,function(error){
      if (error) {
        console.log(error)
        const model ={
          portfolio, 
          dbErrorOccured:true
        }
        response.redirect('/portfolio', model)

      } else {
        response.redirect('/portfolio')
      }
  
    })
  }else{
    const model={
      blogpost:{
        id, 
        name:newName,
        content:newContent

      }, 
      validationErrors
    }
    response.render("update-portfolio.hbs", model)
  }
  })
  
  
  router.post('/deleteportfoliopost/:id', function (request, response) {
    const id = request.params.id
    db.deletePortfoliopostById(id,function(error){
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
  router.get('/portfolios/:id', function(request, response){
    const id = request.params.id
    db.getPortfoliopostById(id,function(error,portfolio){
  
      if(error){
        console.log(error)
        const model ={
          dbErrorOccured:true
        }
        response.render("error.hbs", { error: " it is not working try again later " })
  
      }else{
        const model = {
          portfolio, 
          dbErrorOccured: false
  
        }
        response.render('portfolios.hbs', model)
      }
    })
  })
  
