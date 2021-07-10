/* ------ Import libraries & set environment variables ------*/
const DButils = require("./DButils");


/* -------- Scope Function -------- */

//mark Player As Favorite by (user_id, player_id)
async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(`insert into dbo.FavoritePlayers values ('${user_id}',${player_id})`);
}

async function removePlayerFromFavorite(user_id, player_id) {
  await DButils.execQuery(`delete from dbo.FavoritePlayers where (user_id='${user_id}' AND playerId='${player_id}')`);
}
async function removeMatchFromFavorite(user_id, match_id) {
  await DButils.execQuery(`delete from dbo.FavoriteMatches where (user_id='${user_id}' AND matchId='${match_id}')`);
}

async function removeTeamFromFavorite(user_id, team_id) {
  await DButils.execQuery(`delete from dbo.FavoriteTeams where (user_id='${user_id}' AND teamId='${team_id}')`);
}

// get favorit player of user
async function getFavoritePlayers(user_id) {
  const player_ids = await DButils.execQuery(`select playerId from dbo.FavoritePlayers where user_id='${user_id}'`);
  return player_ids;
}

// mark team as favorit
async function markTeamAsFavorite(user_id, team_id) {
  await DButils.execQuery(`insert into dbo.FavoriteTeams values ('${user_id}',${team_id})`);
}

// get user favorit team
async function getFavoriteTeams(user_id) {
  const team_id = await DButils.execQuery(`select teamId from dbo.FavoriteTeams where user_id='${user_id}'`);
  return team_id;
}

//mark Match As Favorite by (user_id, player_id)
async function markMatchAsFavorite(user_id, match_id) {
  await DButils.execQuery(`insert into dbo.FavoriteMatches values ('${user_id}',${match_id})`);
}

// get favorit mathces
async function getFavoriteMatches(user_id) {
  const match_ids = await DButils.execQuery(`select matchId from dbo.FavoriteMatches where user_id='${user_id}'`);
  return match_ids;
}


/* -------- Export Function -------- */
exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.removePlayerFromFavorite = removePlayerFromFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.markTeamAsFavorite = markTeamAsFavorite;
exports.getFavoriteTeams = getFavoriteTeams;
exports.getFavoriteMatches = getFavoriteMatches;
exports.markMatchAsFavorite = markMatchAsFavorite;
exports.removeMatchFromFavorite = removeMatchFromFavorite;
exports.removeTeamFromFavorite = removeTeamFromFavorite;