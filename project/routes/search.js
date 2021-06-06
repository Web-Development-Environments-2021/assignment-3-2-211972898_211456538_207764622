var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

/**
 * Search a player by name
 */
router.get("/playersByName/:player_query", async (req, res, next)=>{
    try{
        const playerInfo = await players_utils.getPlayerByName(req.params.player_query);
        console.log(playerInfo);
        if (typeof playerInfo === 'string' || playerInfo instanceof String){
            res.status(404).send("There was a problem with the search");
        }
        else{
            res.status(200).send(playerInfo);
        }
    }
    catch(error){
        next(error);
    }
});

/**
 * Search a player by name and position name
 */
router.get("/playersByPos/:player_query/:position_query", async (req, res, next)=>{
    try{
        const playerInfo = await players_utils.GetPlayerByNameAndPos(req.params.player_query, req.params.position_query);
        if (typeof playerInfo === 'string' || playerInfo instanceof String){
            res.status(404).send("There was a problem with the search");
        }
        else{
            res.status(200).send(playerInfo);
        }
    }
    catch(error){
        next(error);
    }
});

/**
 * Search a player by name, filter by team name
 */
router.get("/playersByTeam/:player_query/:team_query", async (req, res, next)=>{
    try{
        const playerInfo = await players_utils.GetPlayerByNameAndTeam(req.params.player_query, req.params.team_query);
        if (typeof playerInfo === 'string' || playerInfo instanceof String){
            res.status(404).send("There was a problem with the search");
        }
        else{
            res.status(200).send(playerInfo);
        }
    }
    catch(error){
        next(error);
    }
});

/**
 * Search a team by name
 */
router.get("/teams/:team_query", async (req, res, next)=>{
    try{
        const teams = await players_utils.GetTeamByName(req.params.team_query);
        // We can check if its empty on clinet side
        if (typeof teams === 'string' || teams instanceof String){
            res.status(404).send("There was a problem with the search");
        }
        else{
            res.status(200).send(teams);
        }
    }
    catch(error){
        next(error);
    }
});

module.exports = router;