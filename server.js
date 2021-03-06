//======
require('dotenv').config();

var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var nodemailer = require('nodemailer');
var cookieSession = require('cookie-session');
var discord = require("discord.js");
var db = require("./models");
var flash = require('express-flash');
const mongoose = require("mongoose");
require('dotenv').config();
const routes = require("./routes");


//========

process.on('unhandledRejection', function (reason, p) { // moar reasons for unhandled rejections promises plz gibz me stack trace!
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

var PORT = process.env.PORT || 3001;

var app = express();


// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("client/build"));


// ==========For Passport=============
//load passport strategies
// app.use(require('./config/passport/passport.js')(passport, db.User));

app.use(cookieSession({
  httpOnly: true,
  maxAge: 30 * 60 * 1000,
  secure: false,
  overwrite: false,
  secret: 'keyboard cat'
}));


//Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use(flash());
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

require('./config/passport/passport.js')(passport);

//===============================
// Set Handlebars.
// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");
//==============================================
// Import routes and give the server access to them.
// require("./routes/profile_routes.js")(app,db);
// require('./routes/auth.js')(app,passport);
// require('./routes/forgot.js')(app,db.user);
// require("./routes/api-routes.js")(app);
// require("./routes/html-routes.js")(app);
//==============================================
//Listen with no sync

app.get("/auth/twitch",  passport.authenticate("twitch"));

app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function (req, res) {
  req.session.user = req.session.passport.user[0];
  console.log(req.session.user)
  return res.redirect("http://localhost:3000/browse");
});

app.listen(PORT, function() {
  console.log("App now listening at localhost:" + PORT);
});
app.use(routes);
//Syncing our sequelize models and then starting our Express app
//=============================================================
// db.sequelize.sync({ force: false }).then(function() {
//   app.listen(PORT, function() {
//     console.log("App listening on PORT " + PORT);
//   });
// });

// Routers
// app.use(require("./controllers/AuthController"));
// app.use(require("./controllers/userController"));


mongoose.Promise = global.Promise;
// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/Socialer"
);