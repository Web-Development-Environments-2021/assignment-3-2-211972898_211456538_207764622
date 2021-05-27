var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const coach_utils = require("./utils/coach_utils");


router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let players_details = [];
  let coach_details = [];
  try {
    const players_details = await players_utils.getPlayersByTeam(req.params.teamId);
    const coach_details = await coach_utils.getCoachInfoByTeam(req.params.teamId);
    //we should keep implementing team page.....
    // need to add past games and future games
    const team_details=[players_details,coach_details];
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
