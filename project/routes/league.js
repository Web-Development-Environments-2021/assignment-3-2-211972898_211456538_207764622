/* ------ Import libraries & set environment variables ------*/
var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DButils = require("../routes/utils/DButils");
const game_utils = require("./utils/game_utils");
const users_utils = require("./utils/users_utils");
const { Time } = require("mssql");

/* ----------------- ROUTING ---------------- */

//Get- GetDetails
router.get("/getDetails", async (req, res, next) => {
  //TODO: fix
  try {
    // get all information needed from utils
    const league_details = await league_utils.getLeagueDetails();
    if(league_details == 0) { res.send([]);}
    else
    {
      const closest_game = await league_utils.getClosestGame();
      const user_id = req.session.user_id;
      let three_favorite_games = [];
      if(user_id !== undefined){
        const match_ids = await users_utils.getFavoriteMatches(user_id);
        let match_ids_array = [];
        match_ids.map((element) => match_ids_array.push(element.matchId)); //extracting the players ids into array
        let results = await game_utils.getMatchesInfo(match_ids_array);
        results = results.filter((element) => {if(element[0] !== undefined){return !game_utils.isPastGame(element[0]);}return false;});
        for(let i = 0; i < results.length && i < 3 ; i++){three_favorite_games.push(results[i])}
      }
      const results = {league_details,closest_game,three_favorite_games}
      res.send(results);
    }
  } catch (error) {
    next(error);
  }
});

//Get- Get CurrentLeuge Matches
router.get("/currentLeagueMatches", async (req, res, next) => {
  try {
    const games = await DButils.execQuery(
      `SELECT * FROM dbo.match`
    );
    let pastGames = [];
    let upcomingGames = [];
    for(i = 0;i<games.length;i++){
      if(game_utils.isPastGame(games[i])){
        console.log("fuckkk");
        // here we need to find the calendar
        console.log(games[i]);
        if (games[i]["calendarId"] != null){
          console.log(games[i]);
          const events = await DButils.execQuery(
            `SELECT description FROM dbo.calendarEvents WHERE calendarId='${games[i]["calendarId"]}'`
          );
          games[i]["calendarEvents"] = events;
        }
        pastGames.push(games[i]);
      }
      else {
        console.log(games[i]);
        delete games[i]["homeGoals"];
        delete games[i]["awayGoals"];
        delete games[i]["calendarId"];
        upcomingGames.push(games[i]);
      }
    }

    const team_details=[pastGames,upcomingGames];
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});
    // let category = req.query.category || 'date'; 
    // let order = req.query.orderBy || 'ASC';
    // console.log(category,order);
    // res.send(await DButils.execQuery(`SELECT * FROM match ORDER BY ${category} ${order}`)); catch (error) {next(error);}

//Post- ADD Matches
router.post("/addMatch", async (req, res, next) => {
  try {
    // get all info from body
    userId = req.session.user_id;
    const adminUserId = (await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = 'admin'`))[0]["user_id"]; // select user info from database
    if (userId!==adminUserId){
      throw { status: 403, message: "Forbidden"};
    }
    const date = req.body.date;
    const time = req.body.hour;
    const homeTeamId = req.body.homeTeamId;
    const awayTeamId = req.body.awayTeamId;
    const stadium = req.body.stadium;
    const referee = req.body.refereeId;
    let time_split = time.split(':');
    let date_split = date.split('-');
    // Validate
    //Time
    let input_validition = time_split.length == 3 && time_split[0].length == 2 && parseInt(time_split[0]) >= 0 && parseInt(time_split[0]) < 24; //  0<= match_hour <24
    input_validition &= time_split[1].length == 2 && parseInt(time_split[1]) >= 0 && parseInt(time_split[1]) < 60; //  0<= match_minute < 60
    input_validition &= time_split[2].length == 2 && parseInt(time_split[2]) >= 0 && parseInt(time_split[2]) < 60; //  0<= match_minute < 60
    if(!input_validition){ throw { status: 400, message: "Invalid detail about Time"};}
    //Date
    input_validition &= date_split.length == 3 && date_split[0].length == 4 && parseInt(date_split[0]) >= 0; //  0<= match_year
    input_validition &= date_split[1].length == 2 && parseInt(date_split[1]) >= 0 && parseInt(date_split[1]) <= 12; //  0<= match_month <= 12
    input_validition &= date_split[2].length == 2 && parseInt(date_split[2]) >= 0 && parseInt(date_split[2]) <= 31; //  0<= match_day <= 31
    const isRefreeInDB = await DButils.execQuery(`SELECT * FROM referee WHERE refereeId = ${referee}`);
    if(!input_validition){ throw { status: 400, message: "Invalid detail about Date"};}
    else if(typeof(stadium) != 'string'){throw new Error('Invalid stadium value')}
    else if(!isRefreeInDB || isRefreeInDB.length == 0){throw { status: 400, message: "RefereeId not in DB"};}
    await DButils.execQuery(`INSERT INTO dbo.match (date, hour, homeTeamId, awayTeamId, stadium,refereeId) VALUES ('${date}', '${time}','${homeTeamId}','${awayTeamId}','${stadium}','${referee}')`);
    res.status(201).send("Match added");
  } catch (error) {next(error);}
});

//Post- Add Match Result
router.post("/addMatchResult", async (req, res, next) => {
  try {
    userId = req.session.user_id;
    const adminUserId = (await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = 'admin'`))[0]["user_id"]; // select user info from database
    if (userId!==adminUserId){
      throw new Error("Player Id should be a number");
    }
    const home_goal = req.body.homeGoals;
    const away_goal = req.body.awayGoals;
    const match_id = req.body.matchId;
    let validInfo = typeof(home_goal) == 'number' && typeof(away_goal) == 'number';
    validInfo &= home_goal >=0 && away_goal>= 0;
    if(!validInfo){throw new Error('home/away Goals should be a number bigger then 0');}
    await DButils.execQuery(`UPDATE dbo.match SET homeGoals='${home_goal}', awayGoals='${away_goal}' WHERE matchId='${match_id}'`);
    res.status(201).send("Match result added");
  } catch (error) {next(error);}
});

//Post- Crate Match Calendar
router.post("/createMatchCalendar", async (req, res, next) => {
  try {
    userId = req.session.user_id;
    const adminUserId = (await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = 'admin'`))[0]["user_id"]; // select user info from database
    if (userId!==adminUserId){
      throw new Error("Player Id should be a number");
    }
    await DButils.execQuery(`INSERT INTO dbo.matchCalendar (matchId) VALUES ('${req.body.matchId}')`);
    let matchCalendarId = await DButils.execQuery(`SELECT matchCalendarId FROM dbo.matchCalendar WHERE matchId='${req.body.matchId}'`) 
    if(!matchCalendarId || matchCalendarId.length == 0){throw new Error('Invalid MatchID')}
    await DButils.execQuery(`UPDATE dbo.match SET calendarId='${matchCalendarId[0]["matchCalendarId"]}' WHERE matchId='${req.body.matchId}'`);
    res.status(201).send("Match calendar created");
  } catch (error) {next(error);}
});

//Post- Add Event To Match calendar
router.post("/addEventToMatchCalendar", async (req, res, next) => {
  try {
    userId = req.session.user_id;
    const adminUserId = (await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = 'admin'`))[0]["user_id"]; // select user info from database
    if (userId!==adminUserId){
      throw new Error("Player Id should be a number");
    }
    // first we find the matchCalendarId
    let matchCalendarId = await DButils.execQuery(`SELECT matchCalendarId FROM dbo.matchCalendar WHERE matchId='${req.body.matchId}'`)
    if(!matchCalendarId || matchCalendarId.length == 0){throw new Error('Invalid MatchID')}
    await DButils.execQuery(`INSERT INTO dbo.calendarEvents (calendarId,description) VALUES ('${matchCalendarId[0]["matchCalendarId"]}','${req.body.description}')`);
    res.status(201).send("Event added to match calendar");
  } catch (error) {next(error);}
});

//Post- Add Refereee
router.post("/addReferee", async (req, res, next) => {
  try {
    userId = req.session.user_id;
    const adminUserId = (await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = 'admin'`))[0]["user_id"]; // select user info from database
    if (userId!==adminUserId){
      throw new Error("Player Id should be a number");
    }
    const full_name = req.body.fullname;
    if(typeof(full_name) !== 'string'){throw new Error('Full name have to be a string');}
    await DButils.execQuery(`INSERT INTO dbo.referee (fullname) VALUES ('${full_name}')`);
    res.status(201).send("Referee created");
  } catch (error) {next(error);}
});

/* -------- Export Function -------- */
module.exports = router;
