// IMPORTS
const express = require("express");
const router = express.Router();
const User = require("../models/user")
const bcrypt = require("bcryptjs")


// GET ROUTES FOR REG / LOGIN
router.get("/login", (req, res)=>{
	res.render("home/login.ejs", {
		title: "Log in to Earfull",
		header: "Log In"
	})
})

router.get("/register", (req, res)=>{
	res.render("home/register.ejs", {
		title: "Earfull Registration",
		header: "Sign Up"
	})
})

// SESSION ROUTES
router.post("/register", (req, res)=>{
	console.log("Registration Route Fired");
	res.render("home/home.ejs", {
		title: "Earfull Home",
		header: "Earfull"
	})
});

router.post("/login", (req, res)=>{
	console.log("Login Route Fired");
	res.render("home/home.ejs", {
		title: "Earfull Home",
		header: "Earfull"
	})
});

router.post("/logout", (req, res)=>{
	console.log("Logout route fired");
	res.redirect("/earfull")
});

module.exports = router;