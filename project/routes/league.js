var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

router.post("/addGames", async (req, res, next) => {
  try {
    // add the new game
    await DButils.execQuery(
      `INSERT INTO dbo.match (username, password) VALUES ('${req.body.username}', '${hash_password}')`
    );
    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
