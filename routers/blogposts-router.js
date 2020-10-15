const express = require('express')
const router = express.Router()
var csrf = require('csurf')
module.exports = router
const db = require('../db')
const MIN_BLOG_TITLE_LENGTH = 2

router.use(function (request, response, next) {
  response.locals.isLoggedIn = request.session.isLoggedIn
  next()
})
router.use(csrf())

router.use(function (request, response, next) {
  response.locals.csrfToken = request.csrfToken();
  next();
})

function getErrorForPost(title, content) {
  const validationErrors = []
  if (title.length < MIN_BLOG_TITLE_LENGTH) {
    validationErrors.push("title must be at least " + MIN_BLOG_TITLE_LENGTH + " characters.")

  } if (content.length < MIN_BLOG_TITLE_LENGTH) {
    validationErrors.push("content must be at least " + MIN_BLOG_TITLE_LENGTH + " characters.")
  }
  return validationErrors
}

router.get('/admin', function (request, response) {
  response.render('admin.hbs')
})

router.post('/admin', function (request, response) {
  const title = request.body.title
  const content = request.body.content
  const validationErrors = getErrorForPost(title, content);
  if (!request.session.isLoggedIn) {
    validationErrors.push("you have to login first")
  }
  if (validationErrors.length == 0) {
    db.createBlogposts(title, content, function (error) {
      if (error) {
        console.log(error)
        // dispaly error.
      } else {
        response.redirect('/blogposts')
      }
    })
  } else {
    const model = {
      validationErrors
    }
    response.render('admin.hbs', model)

  }
})

router.get("/", function (request, response) {
  const id = request.params.id
  db.getBlogposts(function (error, blogposts) {
    if (error) {
      response.render("error.hbs", { error: " it is not working try again later " })
      console.log(error)
    } else {
      const model = {
        blogposts,
      }
      response.render("blogposts.hbs", model)
    } 
  })
})
router.post('/', function (request, response) {
  const model = {
    blogpost: blogposts,
  }
  response.render("blogposts.hbs", model)
})

router.get('/updateblogpost/:id', function (request, response) {
  const id = request.params.id
  db.getBlogpostById(id, function (error, blogpost) {
    if (error) {
      console.log(error)
      const model = {
        dbError: true
      }
      response.render("error.hbs", { error: " it is not working try again later " })

    } else {
      const model = {
        blogpost,
        dbError: false
      }
      response.render("updateblogpost.hbs", model)
    }
  })
})

router.post('/updateblogpost/:id', function (request, response) {
  const id = request.params.id
  const newTitle = request.body.title
  const newContent = request.body.content
  const validationErrors = getErrorForPost(newContent, newTitle);
  if (!request.session.isLoggedIn) {
    validationErrors.push("you have to login to update the blogpost")
  }
  if (validationErrors.length == 0) {
    db.updateBlogpostById(newContent, newTitle, id, function (error) {
      if (error) {
        console.log(error)
        const model = {
          blogpost,
          dbErrorOccured: true
        }
        response.redirect('/blogposts', model)
      } else {
        response.redirect('/blogposts')
      }
    })
  } else {
    const model = {
      blogpost: {
        id,
        content: newContent,
        title: newTitle
      },
      validationErrors
    }
    response.render("updateblogpost.hbs", model)
  }

})

router.post('/deletepost/:id', function (request, response) {
  const id = request.params.id
  db.deletePostById(id, function (error) {
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


router.get('/blogpost/:id', function (request, response) {
  const id = request.params.id
  db.getBlogpostById(id, function (error, blogpost) {

    if (error) {
      console.log(error)
      const model = {
        dbErrorOccured: true
      }
      response.render('blogpost.hbs', model)
    } else {
      const model = {
        blogpost,
        dbErrorOccured: false
      }
      response.render('blogpost.hbs', model)
    }
  })
})



