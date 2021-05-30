var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DButils = require("../routes/utils/DButils");
const game_utils = require("./utils/game_utils");
const users_utils = require("./utils/users_utils");


router.get("/getDetails", async (req, res, next) => {
  //TODO: fix
  try {
    const league_details = await league_utils.getLeagueDetails();
    const closest_game = await league_utils.getClosestGame();
    const user_id = req.session.user_id;
    let three_favorit_game = [];
    if(user_id !== undefined){
      const match_ids = await users_utils.getFavoriteMatches(user_id);
      let match_ids_array = [];
      match_ids.map((element) => match_ids_array.push(element.matchId)); //extracting the players ids into array
      let results = await game_utils.getMatchesInfo(match_ids_array);
      results = results.filter((element) => {if(element[0] !== undefined){return !game_utils.isPastGame(element[0]);}return false;});
      for(let i = 0; i < results.length && i < 3 ; i++){three_favorit_game.push(results[i])}
    }
    const results = {league_details,closest_game,three_favorit_game}
    res.send(results);
  } catch (error) {
    next(error);
  }
});





router.get("/currentLeagueMatches", async (req, res, next) => {
  try {
    let category = req.query.category || 'date'; 
    let order = req.query.orderBy || 'ASC';
    console.log(category,order);
    res.send(await DButils.execQuery(`SELECT * FROM match ORDER BY ${category} ${order}`));
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
