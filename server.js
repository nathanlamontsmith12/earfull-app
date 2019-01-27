// run database file 
require("./db/db");

// import modules 
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
 

// set app
const app = express();

// set PORT 
const PORT = 3000;

// session set up
const sessionSecret = require("./sessionSecret.js");

app.use(session({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: false
}))

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: false}));


// CONTROLLERS 
const usersController = require("./controllers/usersController")
app.use("/earfull/auth", usersController);


// Other Middleware 
app.use(express.static("static"));


// Home Route 
app.get("/earfull", (req, res)=>{
	res.render("home/home.ejs", {
		message: req.session.message,
		logged: req.session.logged,
		title: "Earfull Home",
		header: "Earfull"
	});
})



// Run Server 
app.listen(PORT, ()=>{
	console.log("Server is listening on port " + PORT);
})
