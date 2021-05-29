var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const coach_utils = require("./utils/coach_utils");


router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const players_details = await players_utils.getPlayersByTeam(req.params.teamId);
    const coach_details = await coach_utils.getCoachInfoByTeam(req.params.teamId);
    //we should keep implementing team page.....
    // need to divide by past games and future games && also get to game event calendar and extract the info
    const games = await DButils.execQuery(
      `SELECT * FROM dbo.match WHERE homeTeamId = '${req.params.teamId}' OR awayTeamId = '${req.params.teamId}'`
    );
    for(i = 0;i<games.length;i++){
      console.log(games[i]);
      // let hour = new Date(String(games[i]["hour"]).split("T")[1]);
      // let date = String(games[i]["date"]).split("T")[0];
      // let dateString = date.concat("T".concat(hour))
      // console.log(dateString)
      // let currDate = new Date();
      // console.log(currDate);
    }
    // pastGames = [];
    // upcomingGames = [];
    const team_details=[players_details,coach_details,games];
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
