// ========== IMPORTS ==========
const express = require("express");
const router = express.Router();
const User = require("../models/user")
const bcrypt = require("bcryptjs")


// ========== AUTHENTICATION ROUTES ==========
router.post("/register", async (req, res, next)=>{

	try {
	// check to make sure that user is not already signed in 
	// before they make another account 
		if (req.session.loggedIn) {
			req.session.message = "You Must Log Out Before Creating a New Account";
			res.redirect("/earfull/auth/register");
		} else {

			// check to make sure that user has entered a password and username 
			if (req.body.password === "" || req.body.username === "") {
				console.log("Null username and/or password");
				req.session.message = "Incorrect or Invalid Username and/or Password";
				res.redirect("/earfull/auth/register");
			} else {

				// check to make sure that user entered password they meant to enter  
				if (req.body.confirm !== req.body.password) {
					req.session.message = "You Must Enter the Same Password Twice";
					res.redirect("/earfull/auth/register");
				} else {

					// create hashed password 
					const password = req.body.password;
					const hashedPW = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

					// make new User 
					const newUser = {};
					newUser.username = req.body.username;
					newUser.email = req.body.email;
					newUser.password = hashedPW;

					// create User in database 
					const createdUser = await User.create(newUser);
					req.session.username = req.body.username;
					req.session.loggedIn = true;
					req.session.message = `Logged In As ${req.body.username}`;
					res.redirect("/earfull")
				}	
			}
		}
	} catch (err) {
		console.log(err);
		req.session.message = "Failed to register account. Please try again.";
		res.redirect("/earfull");
	}
});

router.post("/login", async (req, res, next)=>{
	
	try {

		// check if user is already logged in 
		if (req.session.loggedIn) {
			req.session.message = `You are already logged in. If you want to log in with a different account, you must first log out.`;
			res.redirect("/earfull/auth/login")
		} else {

			// check if password or username is null 
			if (req.body.password === "" || req.body.username === "") {
				console.log("Null username and/or password");
				req.session.message = "Incorrect or Invalid Username and/or Password";
				res.redirect("/earfull/auth/login");
			} else {

				// find current user 
					const foundUser = await User.findOne({username: req.body.username});
					
					// check that password is correct 
					if (bcrypt.compareSync(req.body.password, foundUser.password)) {
						req.session.username = req.body.username;
						req.session.loggedIn = true;
						req.session.message = `Logged in as ${req.body.username}`;
						res.redirect("/earfull")
					} else {
						console.log("Incorrect Username or password");
						req.session.message = "Incorrect or Invalid Username and/or Password";
						res.redirect("/earfull/auth/login");
					}
				} 
		}
	} catch (err) {
		req.session.message = "Incorrect or Invalid Username and/or Password";
		console.log(err);
		res.redirect("/earfull/auth/login");
	}
});

router.post("/logout", async (req, res, next)=>{
	// destroy session 
	try {
		const endSession = await req.session.destroy();
		res.redirect("/earfull")
	} catch (err) {
		console.log(err);
	}
});


// ========== GET ROUTES FOR REG / LOGIN ==========
router.get("/login", (req, res)=>{

	// capture message, then clear it 
	const message = req.session.message; 

	// ... unless the message is "Logged in"
	if (req.session.message) {
		if (req.session.message[0] !== "L") {
				req.session.message = "";
		}
	}

	// render appropriate page 
	res.render("home/login.ejs", {
		loggedIn: req.session.loggedIn,
		message: message,
		title: "EarFull Log In",
		header: "Log In"
	})
})


router.get("/register", (req, res)=>{

	// capture message, then clear it 
	const message = req.session.message; 

	// ... unless the message is "Logged in"
	if (req.session.message) {	
		if (req.session.message[0] !== "L") {
				req.session.message = "";
		}
	}

	// render appropriate page
	res.render("home/register.ejs", {
		loggedIn: req.session.loggedIn,
		message: message,
		title: "EarFull Registration",
		header: "Sign Up"
	})
})

//  ========== EXPORT ROUTER  ==========
module.exports = router;