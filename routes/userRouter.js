

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport=require('passport')
const { ensureAuthenticated } = require('../middlewares/middleware.js'); 
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// Route for rendering the login page
router.get("/", (req, res) => {
    res.render("login", { user: req.user });
  });
  


// Route for rendering the sign-up page
router.get('/sign-up', (req, res) => res.render('sign-up'));


// Route for handling sign-up form submissions
router.post('/sign-up', userController.signUp);



//login route


router.post(
    "/log-in",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/fail",
      
    })
  );


  //logout route
router.get("/log-out", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });


  
  //route for uploading files
  router.get('/upload', ensureAuthenticated, (req, res) => {
    res.render('upload');
  });
  
  router.post('/upload', ensureAuthenticated, upload.single('file'), (req, res) => {
    console.log(req.file);
    res.send('File uploaded successfully');
  });



module.exports = router;
