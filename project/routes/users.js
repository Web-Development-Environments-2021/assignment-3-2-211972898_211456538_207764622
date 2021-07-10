var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");
const game_utils = require("./utils/game_utils");

/*Authenticate all incoming requests by middleware*/
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {res.sendStatus(401);}
});

// ------------------- PLAYERS -----------------------

/** This path gets body with playerId and save this player in the favorites list of the logged-in user*/
router.post("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_id = req.body.playerId;
    if(typeof(user_id) !='number' || typeof(player_id) !='number') {throw{ status:400 , message: 'one of the arguments is not specified correctly.'};}
    const users = await DButils.execQuery("SELECT playerId FROM FavoritePlayers WHERE user_id =" + user_id); // select all user from table
    if (users.find((x) => x.playerId === player_id)) // validate players is uniqe
      throw { status: 409, message: "the player is already marked as favorite by the user."};
    await users_utils.markPlayerAsFavorite(user_id, player_id);
    res.status(201).send("The player successfully saved as favorite");
  } catch (error) {next(error);}
});
/** This path gets body with playerId and delete this player in the favorites list of the logged-in user*/
router.delete("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_id = req.body.playerId;
    console.log(player_id,typeof(player_id));
    if(typeof(user_id) !='number' || typeof(player_id) !='number') {throw{ status:400 , message: 'one of the arguments is not specified correctly.'};}
    const users = await DButils.execQuery("SELECT playerId FROM FavoritePlayers WHERE user_id =" + user_id); // select all user from table
    if (!users.find((x) => x.playerId === player_id)) // validate players is uniqe
      throw { status: 409, message: "the player is not marked as favorite by the user."};
    await users_utils.removePlayerFromFavorite(user_id, player_id);
    res.status(201).send("The player successfully removed from favorites");
  } catch (error) {next(error);}
});

/* This path returns the favorites players that were saved by the logged-in user*/
router.get("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_ids = await users_utils.getFavoritePlayers(user_id);
    let player_ids_array = [];
    player_ids.map((element) => player_ids_array.push(element.playerId)); //extracting the players ids into array
    const results = await players_utils.getPlayersInfo(player_ids_array);
    console.log(results);
    res.status(200).send(results);
  } catch (error) {next(error);}
});

/* This path returns the favorites players that were saved by the logged-in user*/
router.get("/favoritePlayersIds", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_ids = await users_utils.getFavoritePlayers(user_id);
    let player_ids_array = [];
    player_ids.map((element) => player_ids_array.push(element.playerId)); //extracting the players ids into array
    res.status(200).send(player_ids_array);
    console.log(player_ids_array);
  } catch (error) {next(error);}
});
// ------------------- Teams -----------------------

/* This path gets body with playerId and save this player in the favorites list of the logged-in user*/
 router.post("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const team_id = req.body.teamId;
    if(typeof(user_id) !='number' || typeof(team_id) !='number'){throw{ status:400 , message: 'one of the arguments is not specified correctly.'};}
    const teams = await DButils.execQuery("SELECT teamId FROM FavoriteTeams WHERE user_id =" + user_id); // select all user from table
    if (teams.find((x) => x.teamId === team_id)) // validate teams is uniqe
      throw { status: 409, message: "the team already marked as favorite by the user."};
    await users_utils.markTeamAsFavorite(user_id, team_id);
    res.status(201).send("The Team successfully saved as favorite");
  } catch (error) {next(error);}
});

/*This path returns the favorites players that were saved by the logged-in user*/
router.get("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const team_ids = await users_utils.getFavoriteTeams(user_id);
    let team_ids_array = [];
    team_ids.map((element) => team_ids_array.push(element.teamId)); //extracting the players ids into array
    const results = await team_utils.getTeamsInfo(team_ids_array);
    res.status(200).send(results);
  } catch (error) {next(error);}
});


router.delete("/favoriteTeams", async (req, res, next) => {
  try {
    console.log("Here1");
    const user_id = req.session.user_id;
    const team_id = req.body.teamId;
    console.log("Here2");
    if(typeof(user_id) !='number' || typeof(user_id) !='number'){throw{ status:400 , message: 'one of the arguments is not specified correctly.'};}
    const teams = await DButils.execQuery("SELECT matchId FROM FavoriteTeams WHERE user_id =" + user_id); // select all user from table
    console.log("Here3");
    if (!teams.find((x) => x.teamId === team_id)) // validate match is uniqe
      throw { status: 409, message: "The Match is not in favorit"};
    console.log("Here4");
    await users_utils.removeTeamFromFavorite(user_id, team_id);
    res.status(201).send("The Match successfully removed from favorites");
  } catch (error) {next(error);}
});
// ------------------- MATCHES -----------------------
/* This path gets body with playerId and save this player in the favorites list of the logged-in user*/
router.post("/favoriteMatches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_id = req.body.matchId;
    if(typeof(user_id) !='number' || typeof(match_id) !='number'){throw{ status:400 , message: 'one of the arguments is not specified correctly.'};}
    const matches = await DButils.execQuery("SELECT matchId FROM FavoriteMatches WHERE user_id =" + user_id); // select all user from table
    if (matches.find((x) => x.matchId === match_id)) // validate match is uniqe
      throw { status: 409, message: "the team already marked as favorite by the user."};
    await users_utils.markMatchAsFavorite(user_id, match_id);
    res.status(201).send("The Match successfully saved as favorite");
  } catch (error) {next(error);}
});

/*This path returns the favorites players that were saved by the logged-in user*/
router.get("/favoriteMatches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_ids = await users_utils.getFavoriteMatches(user_id);
    console.log(match_ids);
    let match_ids_array = [];
    match_ids.map((element) => match_ids_array.push(element.matchId)); //extracting the players ids into array
    let results = await game_utils.getMatchesInfo(match_ids_array);
    const favorites = results.filter(element => (element[0]!=undefined) &&(!game_utils.isPastGame(element[0]))); //&& element[0].length>0 && );
    res.status(200).send(favorites);
  } catch(error){next(error);}
});

router.delete("/favoriteMatches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_id = req.body.matchId;
    if(typeof(user_id) !='number' || typeof(match_id) !='number'){throw{ status:400 , message: 'one of the arguments is not specified correctly.'};}
    const matches = await DButils.execQuery("SELECT matchId FROM FavoriteMatches WHERE user_id =" + user_id); // select all user from table
    if (!matches.find((x) => x.matchId === match_id)) // validate match is uniqe
      throw { status: 409, message: "The Match is not in favorit"};
    await users_utils.removeMatchFromFavorite(user_id, match_id);
    res.status(201).send("The Match successfully removed from favorites");
  } catch (error) {next(error);}
});

/* -------- Export Function -------- */
module.exports = router;
