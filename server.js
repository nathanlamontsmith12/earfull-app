// ========== RUN DATABASE FILE ==========
require("./db/db");

// ========== IMPORT MODULES ==========
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
 

// ========== SET APP ==========
const app = express();


// ========== SET PORT ==========
const PORT = 3000;


// ========== SET UP SESSION ==========
const sessionSecret = require("./sessionSecret.js");
app.use(session({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: false
}))


// ========== EARLY MIDDLEWARE ========== 
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: false}));


// ========== CONTROLLERS ========== 
const usersController = require("./controllers/usersController")
app.use("/earfull/auth", usersController);
const episodesController = require("./controllers/episodesController")
app.use("/earfull/episodes", episodesController);

// on any server action, clears out req.session.message if it is 
// anything other than "Logged in as ${username}"
app.use(function (req, res, next) {
	if (req.session.message) {
		if (req.session.message[0] !== "L") {
			req.session.message = "";
			next();
		}
	} else {
		next();
	}
})

// ========== OTHER MIDDLEWARE ========== 
app.use(express.static("public"));



// ========== ROUTES ==========
// Home route  
app.get("/earfull", (req, res)=>{
	res.render("home/home.ejs", {
		message: req.session.message,
		loggedIn: req.session.loggedIn,
		title: "EarFull Home",
		header: "EarFull"
	});
})


// ========== RUN SERVER ========== 
app.listen(PORT, ()=>{
	console.log("Server is listening on port " + PORT);
})
