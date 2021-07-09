/* ------ Import libraries & set environment variables ------*/
var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const coach_utils = require("./utils/coach_utils");
const game_utils = require("./utils/game_utils");
const team_utils = require("./utils/team_utils");
const { DateTimeOffset } = require("mssql");

/* ----------------- ROUTING ---------------- */

// Get- Team Full Details
router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const team_id = req.params.teamId;
    // check if team_id is a number
    let isnum = /^\d+$/.test(team_id);
    if(!isnum){throw {status:409, message:'Team_id should be a number'};}
    const team_detail = await team_utils.getTeamInfo(req.params.teamId);
    const players_details = await players_utils.getPlayersByTeam(req.params.teamId);
    const coach_details = await coach_utils.getCoachInfoByTeam(req.params.teamId);
    //we should keep implementing team page.....
    // need to divide by past games and future games && also get to game event calendar and extract the info
    const games = await DButils.execQuery(`SELECT * FROM dbo.match WHERE homeTeamId = '${team_id}' OR awayTeamId = '${team_id}'`);
    let pastGames = [];
    let upcomingGames = [];
    for(i = 0;i<games.length;i++){
      if(game_utils.isPastGame(games[i])){
        if (games[i]["calendarId"] != null){
          const events = await DButils.execQuery(
            `SELECT description FROM dbo.calendarEvents WHERE calendarId='${games[i]["calendarId"]}'`
          );
          games[i]["calendarEvents"] = events;
        }
        pastGames.push(games[i]);      
      }
      else{upcomingGames.push(games[i]);}
    }
    const team_details=[players_details,coach_details,pastGames,upcomingGames,team_detail];
    res.send(team_details);
  } catch (error) {next(error);}
});

/* -------- Export Function -------- */
module.exports = router;