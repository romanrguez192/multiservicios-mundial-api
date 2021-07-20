const express = require("express");
const cors = require("cors");
const mountRoutes = require("./routes");
const errorHandler = require("./errorHandler");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./passportConfig");

const app = express();
initializePassport(passport);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended:false }))
app.use(session({
  secret: process.env.SECRET || 'secreto',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// Settings
app.set("port", process.env.PORT || 4000);


// Routes
mountRoutes(app);

// Error Handling
app.use(errorHandler);

module.exports = app;
