// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const User = require("../models/user")
const bcrypt = require("bcryptjs")


// ========== AUTHENTICATION ROUTES ==========
router.post("/auth/register", async (req, res, next)=>{

	try {
	// check to make sure that user is not already signed in 
	// before they make another account 
		if (req.session.loggedIn) {
			req.session.message = "You Must Log Out Before Creating a New Account";
			res.redirect("/earfull/user/auth/register");
		} else {

			// check to make sure that user has entered a password and username 
			if (req.body.password === "" || req.body.username === "") {
				console.log("Null username and/or password");
				req.session.message = "Incorrect or Invalid Username and/or Password";
				res.redirect("/earfull/user/auth/register");
			} else {

				// check to make sure that user entered password they meant to enter  
				if (req.body.confirm !== req.body.password) {
					req.session.message = "You Must Enter the Same Password Twice";
					res.redirect("/earfull/user/auth/register");
				} else {

					// create hashed password 
					const password = req.body.password;
					const hashedPW = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

					// make new User 
					const newUser = {};
					newUser.username = req.body.username;
					newUser.email = req.body.email;
					newUser.password = hashedPW;

					// create User in database & set session info: 
					const createdUser = await User.create(newUser);
					req.session.username = createdUser.username;
					req.session.userId = createdUser._id;
					req.session.loggedIn = true;
					req.session.message = `Logged in as ${req.session.username}`;
					res.redirect("/earfull")
				}	
			}
		}
	} catch (err) {
		console.log(err);
		req.session.message = "Failed to register account. Please try again.";
		res.redirect("/earfull/user/auth/register");
		// next(400, err);
			// --> 400 (Bad Request) Error; for later, when we implement more robust 
			// error handling — for now, the redirect + message should suffice 
	}
});

router.post("/auth/login", async (req, res, next)=>{
	
	try {

		// check if user is already logged in 
		if (req.session.loggedIn) {
			req.session.message = `You are already logged in. If you want to log in with a different account, you must first log out.`;
			res.redirect("/earfull/user/auth/login")
		} else {

			// check if password or username is null 
			if (req.body.password === "" || req.body.username === "") {
				console.log("Null username and/or password");
				req.session.message = "Incorrect or Invalid Username and/or Password";
				res.redirect("/earfull/user/auth/login");
			} else {

				// find current user 
					const foundUser = await User.findOne({username: req.body.username});
					
					// check that password is correct 
					if (bcrypt.compareSync(req.body.password, foundUser.password)) {
						req.session.username = foundUser.username;
						req.session.userId = foundUser._id;
						req.session.loggedIn = true;
						req.session.message = `Logged in as ${req.body.username}`;
						res.redirect("/earfull")
					} else {
						console.log("Incorrect Username or password");
						req.session.message = "Incorrect or Invalid Username and/or Password";
						res.redirect("/earfull/user/auth/login");
					}
				} 
		}
	} catch (err) {
		req.session.message = "Incorrect or Invalid Username and/or Password";
		console.log(err);
		res.redirect("/earfull/user/auth/login");
		// next(400, err); 
			// --> 400 (Bad Request) Error; for later, when we implement more robust 
			// error handling — for now, the redirect + message should suffice 
	}
});

router.post("/auth/logout", async (req, res, next)=>{
	// destroy session 
	try {
		const endSession = await req.session.destroy();
		res.redirect("/earfull")
	} catch (err) {
		console.log(err);
	}
});


// ========== GET ROUTES FOR REG / LOGIN ==========
router.get("/auth/login", (req, res)=>{

	// capture message, then clear it 
	const messageToDisplay = req.session.message; 

	// ... unless it is "Logged in as ...."
	if (req.session.message) {
		if (req.session.message[0] !== "L") {
			req.session.message = "";
		}
	}

	// render appropriate page 
	res.render("home/login.ejs", {
		loggedIn: req.session.loggedIn,
		message: messageToDisplay,
		title: "EarFull Log In",
		header: "Log In"
	})
})


router.get("/auth/register", (req, res)=>{

	// capture message, then clear it 
	const messageToDisplay = req.session.message; 

	// ... unless it is "Logged in as ...."
	if (req.session.message) {
		if (req.session.message[0] !== "L") {
			req.session.message = "";
		}
	}

	// render appropriate page
	res.render("home/register.ejs", {
		loggedIn: req.session.loggedIn,
		message: messageToDisplay,
		title: "EarFull Registration",
		header: "Sign Up"
	})
})



// ========== GET ROUTES FOR USER'S PAGES ==========

// User Redirect 
router.get("/find", (req, res)=>{
	if (req.session.loggedIn) {
		res.redirect(`/earfull/user/${req.session.userId}`)
	} else {
		req.session.message = "You need to be logged in to view your page";
		res.redirect("/earfull/user/auth/login"); // may need to implement better error handling later;
	}
})
 
// User Show Page 
router.get("/:id", async (req, res, next) => {
	try {
		if (!req.session.loggedIn) {
			req.session.message = "You must be logged in to view your page";
			res.redirect("/earfull/user/auth/login");
		} else {
			console.log(req.params.id);
			console.log();
			const currentUser = await User.findOne({_id: req.params.id});
			res.render("user/show.ejs", {
				user: currentUser,
				loggedIn: req.session.loggedIn,
				title: "Your EarFull Page", 
				header: `${currentUser.username}'s EarFull Page`,
				message: req.session.message
			})
		}
	} catch (err) {
		res.send(err); // will definitely need to implement better error handling than this later!
	}
})



//  ========== EXPORT ROUTER  ==========
module.exports = router;

