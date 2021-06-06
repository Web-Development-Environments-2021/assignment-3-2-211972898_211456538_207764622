/* ------ Import libraries & set environment variables ------*/
var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");

/* ----------------- ROUTING ---------------- */

//Get- PlayerFullDetails
router.get("/playerFullDetails/:playerId", async (req, res, next) => {
  try {
    const player_id = req.params.playerId;
    let isnum = /^\d+$/.test(player_id);
    if(!isnum){throw {status:409, message:'player_Id should be a number'};}
    const players_details = await players_utils.getAllPlayerInfoById(player_id);
    res.send(players_details);
  } catch (error) {next(error);}
});

/* -------- Export Function -------- */
module.exports = router;
