/* ------ Import libraries & set environment variables ------*/
var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const coach_utils = require("./utils/coach_utils");
const game_utils = require("./utils/game_utils");
const { DateTimeOffset } = require("mssql");

/* ----------------- ROUTING ---------------- */

// Get- Team Full Details
router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const players_details = await players_utils.getPlayersByTeam(req.params.teamId);
    const coach_details = await coach_utils.getCoachInfoByTeam(req.params.teamId);
    //we should keep implementing team page.....
    // need to divide by past games and future games && also get to game event calendar and extract the info
    const team_id = req.params.teamId;
    if(typeof(team_id) !=='number'){throw new Error('Team_id should be a number');}
    const games = await DButils.execQuery(`SELECT * FROM dbo.match WHERE homeTeamId = '${team_id}' OR awayTeamId = '${team_id}'`);
    let pastGames = [];
    let upcomingGames = [];
    for(i = 0;i<games.length;i++){
      if(game_utils.isPastGame(games[i])){pastGames.push(games[i]);}
      else{upcomingGames.push(games[i]);}
    }
    const team_details=[players_details,coach_details,pastGames,upcomingGames];
    res.send(team_details);
  } catch (error) {next(error);}
});

/* -------- Export Function -------- */
module.exports = router;