const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
require("dotenv").config({path:'./../.env'});
const DButils = require("./DButils");

function isPastGame(game){
    // if the game has been passed or it is upcoming game
    let gameDate = game.date; 
    let gameTime= game.hour;
    var currentDate = new Date();
    curr_hours = currentDate.getHours();
    
    curr_minutes = currentDate.getMinutes();
    curr_day = currentDate.getDate();
    curr_month = currentDate.getMonth();
    curr_year = currentDate.getFullYear();

    game_year = gameDate.getFullYear();
    game_month = gameDate.getMonth();
    game_day = gameDate.getDate();
    game_hours = gameTime.getHours();
    game_minutes = gameTime.getMinutes();

    if(game_year<curr_year)
        return true;
    else if (game_year==curr_year && game_month<curr_month)
        return true;
    else if (game_year==curr_year && game_month==curr_month &&game_day<curr_day)
        return true;
    else if (game_year==curr_year && game_month==curr_month &&game_day==curr_day && game_hour<curr_hour)
        return true;
    else if (game_year==curr_year && game_month==curr_month &&game_day==curr_day && game_hour==curr_hour && game_minutes<=curr_minutes)
        return true;
    else 
        return false;

}

async function markMatchAsFavorite(user_id, match_id){
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