/* ------ Import libraries & set environment variables ------*/
var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");
require("dotenv").config({path:'./../.env'});

/* ----------------- ROUTING ---------------- */

// Registreition
router.post("/Register", async (req, res, next) => {
  // all input validition on FrontEnd
  try {
    const users = await DButils.execQuery("SELECT username FROM dbo.users"); // select all user from table
    if (users.find((x) => x.username === req.body.username)) // validate userName is uniqe
      throw { status: 409, message: "Username taken" };
    let hash_password = bcrypt.hashSync(req.body.password,parseInt(process.env.bcrypt_saltRounds));// Hash the password
    req.body.password = hash_password; // save in request
    await DButils.execQuery(`INSERT INTO dbo.users (username, password,firstName,lastName,country,email,image) VALUES ('${req.body.username}', '${hash_password}','${req.body.firstName}','${req.body.lastName}','${req.body.country}','${req.body.email}','${req.body.image}')`); // add the new username (SQL command)
    res.status(201).send("user created");// message to client
  } catch (error) {next(error);}
});

// Login
router.post("/Login", async (req, res, next) => {
  // All input validition in FrontEnd
  try {
    const user = (await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = '${req.body.username}'`))[0]; // select user info from database
    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }
    // Set cookie
    req.session.user_id = user.user_id;
    // return cookie
    res.status(200).send("login succeeded");// message to client-sessions
  }
  catch (error) {next(error);}
});

// Logout
router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

/* -------- Export Function -------- */
module.exports = router;
