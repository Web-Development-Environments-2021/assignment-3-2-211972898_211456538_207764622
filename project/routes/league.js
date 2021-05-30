var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DButils = require("../routes/utils/DButils");
const game_utils = require("./utils/game_utils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.get("/currentLeagueMatches", async (req, res, next) => {
  try {
    const games = await DButils.execQuery(
      `SELECT * FROM dbo.match`
    );
    let pastGames = [];
    let upcomingGames = [];
    for(i = 0;i<games.length;i++){
      if(game_utils.isPastGame(games[i]["date"], games[i]["hour"])){
        // here we need to find the calendar
        if (games[i]["calendarId"] != null){
          //console.log(games[i]);
          const events = await DButils.execQuery(
            `SELECT description FROM dbo.calendarEvents WHERE calendarId='${games[i]["calendarId"]}'`
          );
          games[i]["calendarEvents"] = events;
          pastGames.push(games[i]);
        }
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

router.post("/addMatch", async (req, res, next) => {
  try {
    // add the new game
    // TODO: Validate all of the details so the DB wont stuck
    await DButils.execQuery(
      `INSERT INTO dbo.match (date, hour, homeTeamId, awayTeamId, stadium) VALUES ('${req.body.date}', '${req.body.hour}','${req.body.homeTeamId}','${req.body.awayTeamId}','${req.body.stadium}')`    );
    res.status(201).send("Match added");
  } catch (error) {
    next(error);
  }
});

router.post("/addMatchResult", async (req, res, next) => {
  try {
    // add the new game
    // TODO: Validate all of the details so the DB wont stuck
    await DButils.execQuery(
      `UPDATE dbo.match SET homeGoals='${req.body.homeGoals}', awayGoals='${req.body.awayGoals}' WHERE matchId='${req.body.matchId}'`);
    res.status(201).send("Match result added");
  } catch (error) {
    next(error);
  }
});

router.post("/createMatchCalendar", async (req, res, next) => {
  try {
    // add the new game
    // TODO: Validate all of the details so the DB wont stuck
    await DButils.execQuery(
      `INSERT INTO dbo.matchCalendar (matchId) VALUES ('${req.body.matchId}')`    
    );
    matchCalendarId = await DButils.execQuery(`SELECT matchCalendarId FROM dbo.matchCalendar WHERE matchId='${req.body.matchId}'`) 
    await DButils.execQuery(
      `UPDATE dbo.match SET calendarId='${matchCalendarId[0]["matchCalendarId"]}' WHERE matchId='${req.body.matchId}'`);
    res.status(201).send("Match calendar created");
  } catch (error) {
    next(error);
  }
});

router.post("/addEventToMatchCalendar", async (req, res, next) => {
  try {
    // add the new game
    // TODO: Validate all of the details so the DB wont stuck
    // first we find the matchCalendarId
    matchCalendarId = await DButils.execQuery(`SELECT matchCalendarId FROM dbo.matchCalendar WHERE matchId='${req.body.matchId}'`)
    console.log(req.body.matchId);
    await DButils.execQuery(
      `INSERT INTO dbo.calendarEvents (calendarId,description) VALUES ('${matchCalendarId[0]["matchCalendarId"]}','${req.body.description}')`    
      );
    res.status(201).send("Event added to match calendar");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
