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

// NOTE: This middleware can be moved depending on what static files we end up using 
// in our public folder
app.use(express.static("public")); 




// ========== USERS CONTROLLER + MIDDLEWARE ========== 
const usersController = require("./controllers/usersController")
app.use("/earfull/user", usersController);

// Bc of its placement here, the custom middleware code below should run 
// for any route that "makes it out" of the usersController.  
// So error messages ("incorrect log in" etc.) from the usersCont code should 
// be displayed exactly once before being wiped out on the next command — so... 

// !!! We want the users controller to be our first controller to run, 
// and we want this middleware IMMEDIATELY after — then other controllers, 
// other middleware, etc. 

app.use((req, res, next) => {

	// set message to "logged in as USERNAME" if user is logged in... 
	// bc there's no "awaiting" here, we RETURN next() in order to immediately 
	// move on to the next middleware in line  

	if (req.session.loggedIn) {
		req.session.message = `Logged in as ${req.session.username}`;
	} 

	if (!req.session.loggedIn) {
		req.session.loggedIn = false;
		req.session.userId = false;
	}

	return next();
})



// ========== OTHER CONTROLLERS ========== 
const episodesController = require("./controllers/episodesController")
app.use("/earfull/episodes", episodesController);

const playlistsController = require("./controllers/playlistsController");
app.use("/earfull/playlists", playlistsController);




// ========== OTHER MIDDLEWARE ========== 



// ========== ROUTES ==========
// Home route  
app.get("/earfull", (req, res)=>{
	res.render("home/home.ejs", {
		message: req.session.message,
		loggedIn: req.session.loggedIn,
		userId: req.session.userId,
		title: "EarFull Home",
		header: "EarFull"
	});
})


// ========== RUN SERVER ========== 
app.listen(PORT, ()=>{
	console.log("Server is listening on port " + PORT);
})
