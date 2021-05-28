var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");


router.get("/playerFullDetails/:playerId", async (req, res, next) => {
  try {
    const players_details = await players_utils.getAllPlayerInfoById(req.params.playerId);
    res.send(players_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
