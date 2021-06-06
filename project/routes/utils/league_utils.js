/* ------ Import libraries & set environment variables ------*/
const axios = require("axios");
const LEAGUE_ID = 271;
const DButils = require("./DButils");
require("dotenv").config({path:'./../.env'});

/* -------- Scope Function -------- */

// get all (name,seasonName,currentStageName) about the league
async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  if(league.data.data.current_stage_id == null) { return 0;}  // status: 404, message: "League stage is null"};
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
  };
  
}

// create distance in int format from date
function distanceFromDate(game) {
  if(game == undefined) return -1;
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

  let x = game_year * 60*24*30*12 + game_month * 60*24*30 + game_day * 60*24 + game_hours*60 + game_minutes;
  let y = curr_year * 60*24*30*12 + curr_month * 60*24*30 + curr_day * 60*24 + curr_hours*60 + curr_minutes;
  return x-y;
}

// get The closest game from database to this date
async function getClosestGame(){
  /* chose all games and order them by date */
  const games = await DButils.execQuery(`SELECT * FROM dbo.match`);
  let lastGame = undefined;
  games.forEach((game)=>{
    if(distanceFromDate(game) > 0 ){
      if(lastGame === undefined || distanceFromDate(game) <= distanceFromDate(lastGame)){lastGame = game;}
    }
  });
  return lastGame;
}

/* -------- Export Function -------- */
exports.getLeagueDetails = getLeagueDetails;
exports.getClosestGame = getClosestGame;