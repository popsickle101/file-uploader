
const express = require("express");
const expressSession = require('express-session');
const methodOverride = require('method-override');





const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Pool } = require("pg");
const passport = require("passport");
const { setApp } = require("cli");
const LocalStrategy = require('passport-local').Strategy;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const userController = require('./controllers/userController');
const userRoutes = require('./routes/userRouter');
const folderRoutes=require('./routes/folderRouter')
const fileRoutes=require('./routes/fileRouter')
const bcryptjs = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' })





app.set("view engine", "ejs");
app.use(
    expressSession({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000 
      },
      secret: 'a santa at nasa',
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 2 * 60 * 1000,  
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );
  

app.use(passport.session());

app.use('/', userRoutes);

app.use('/', folderRoutes);
app.use('/', fileRoutes);


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcryptjs.compare(password, user.password);
      if (!match) {
        
        return done(null, false, { message: "Incorrect password" })
      }
      
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    done(null, user);
  } catch(err) {
    done(err);
  }
});



  app.listen(3000, () => console.log("app listening on port 3000!"));