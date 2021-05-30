//#region global imports
const DButils = require("./routes/utils/DButils");
const axios = require("axios");
const bcrypt = require("bcryptjs");
require("dotenv").config({path:'./../.env'});
//#endregion
//#region express configures
var express = require("express");
var path = require("path");
const session = require("client-sessions");
var logger = require("morgan");
var cors = require("cors");


var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: process.env.COOKIE_SECRET, // the encryption key
    duration: 24 * 60 * 60 * 1000, // expired after 20 sec
    activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration,
    cookie: {
      httpOnly: false,
    },
    //the session will be extended by activeDuration milliseconds
  })
);
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files
// DO NOT UNCOMMENT THIS SHIT
// middleware to serve all the needed static files under the dist directory - loaded from the index.html file
// https://expressjs.com/en/starter/static-files.html
// app.use(express.static("dist"));
// app.get("/api", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

const port = process.env.PORT || "3000";

const auth = require("./routes/auth");
const users = require("./routes/users");
const league = require("./routes/league");
const teams = require("./routes/teams");
const players = require("./routes/player");
const coaches = require("./routes/coach");
const { nextTick } = require("process");
//#endregion

//#region cookie middleware
app.use(function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
        }
        next();
      })
      .catch((error) => next());
  } else {
    next();
  }
});
//#endregion

//refirect path to /league/getDetails
app.get("/", async (req,res,next)=> {
  try{res.redirect('/league/getDetails');}
  catch(erro){next(error)}
});

// ----> For cheking that our server is alive
app.get("/alive", (req, res,next) => res.send("I'm alive"));

// About Page
app.get("/About", async (req, res,next)=>{
  let object = {
    text: "This is the project Guy Ron And Noam Built and here some link about the porject progress in the last couple of weeks",
    links:[
      'https://web-development-environments-2021.github.io/Assignment2_211456538_211972898_207764622/',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // SIGN if you have been ricked roilied [v/x]
    ],
  };
  res.send(object);
});

// Search 
app.get("/Search",async (req, res,next)=>{
  //TODO:(IN FRONT) try to deside in front or back and how to mannage it
  try{
    const query_type = req.query.type || 'team'; // the table we work on
    const query_value = req.query.query || ''; // the search string we get from user 
    const order = req.query.orderBy || 'ASC'; // in witch order we organize the row
    const position = req.query.position;
    const in_team = req.query.inTeam;
    let position_sql = true;
    let sql_query;
    switch(query_type){
      case 'team':
        sql_query = `SELECT * FROM teams WHERE '%${query_value}%' ORDER BY ${order}`;
        break;
      case 'player':
        if(position){position_sql = "position = ";}
        sql_query = `SELECT * FROM players WHERE '%${query_value}%' AND ${position_sql} ORDER BY ${order}`;
        break;
      case 'coach':
        if(position)
        sql_query = `SELECT * FROM coach WHERE '%${query_value}%' AND ${position_sql} ORDER BY ${order}`;
        break;   
      default:
        break;
    }
  }
  catch{

  }


  try{

    const type = req.query.In || 'team';
    const queryValue = req.query.Value || '';
    const order = req.query.orderBy || 'ASC';
    const game_position =  req.query.GamePosition|| true;
    const team_name = req.query.team_name || '';
    let table = type;
    let query =`SELECT * FROM ${table} ORDER BY ${order}`
    if(type == 'player' || type == 'coach'){
      query = `SELECT FROM ${type} WHERE position=${game_position} OR ${game_position} = TRUE`;
    }
    data = await DButils.execQuery(`SELECT * FROM ${table} WHERE teamName=${team_name} OR gamePosition=${game_position} ORDER BY ${order}`);
    data = data.filter((row)=>{row.name.includes(queryValue);});
    res.send(data);
  }
  catch(error){
    next(error);
  }
  
});

// Routings (modolar)
app.use("/", auth);
app.use("/users", users);
app.use("/league", league);
app.use("/teams", teams);
app.use("/players", players);
app.use("/coaches",coaches);

// Global-Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send(err.message);
});

// Create Server on @port
const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

// on server "End connection"(SINIT) close connection
process.on("SIGINT", function () {
  if (server) {server.close(() => console.log("server closed"));}
});




