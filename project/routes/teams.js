var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const coach_utils = require("./utils/coach_utils");
const game_utils = require("./utils/game_utils");
const { DateTimeOffset } = require("mssql");


router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const players_details = await players_utils.getPlayersByTeam(req.params.teamId);
    const coach_details = await coach_utils.getCoachInfoByTeam(req.params.teamId);
    //we should keep implementing team page.....
    // need to divide by past games and future games && also get to game event calendar and extract the info
    const games = await DButils.execQuery(
      `SELECT * FROM dbo.match WHERE homeTeamId = '${req.params.teamId}' OR awayTeamId = '${req.params.teamId}'`
    );
    let pastGames = [];
    let upcomingGames = [];
    for(i = 0;i<games.length;i++){
      if(game_utils.isPastGame(games[i]["date"], games[i]["hour"]))
        pastGames.push(games[i]);
      else upcomingGames.push(games[i]);
    }
    const team_details=[players_details,coach_details,pastGames,upcomingGames];
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;