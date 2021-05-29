var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DButils = require("../routes/utils/DButils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.post("/addMatches", async (req, res, next) => {
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
    console.log(matchCalendarId);
    await DButils.execQuery(
      `INSERT INTO dbo.calendarEvents (calendarId,description) VALUES ('${matchCalendarId[0]["matchCalendarId"]}','${req.body.event}')`    
      );
    res.status(201).send("Event added to match calendar");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
