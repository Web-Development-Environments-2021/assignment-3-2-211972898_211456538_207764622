const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
require("dotenv").config({path:'./../.env'});
const DButils = require("./DButils");

async function getTeams(user_id, match_id){
    await DButils.execQuery(
        `insert into dbo.FavoriteMatches values ('${user_id}',${match_id})`
    );
}

async function getMatchesInfo(matches_ids_list) {
    let promises = [];
    matches_ids_list.map((id) =>promises.push( DButils.execQuery(`SELECT * FROM dbo.match WHERE matchId = '${id}'`)));
    let matches_info = await Promise.all(promises);
    return matches_info;
}
  
  

exports.isPastGame = isPastGame;
exports.markMatchAsFavorite = markMatchAsFavorite;
exports.getMatchesInfo = getMatchesInfo;