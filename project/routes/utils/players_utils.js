/* ------ Import libraries & set environment variables ------*/
const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271
require("dotenv").config({path:'./../.env'});

/* ----------------- Scope Function ---------------- */

// Get player from MONK BY team_ID
async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  //get infro from outer source
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>player_ids_list.push(player.player_id));
  return player_ids_list;
}

// get player info from MONK by team_ID
async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

// Extract Relevant Player Data by player_ID
function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    if (player_info.data.data === undefined){
      return undefined;
    }
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}

// Get Players By Team by player_ID
async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

//Get All Player Info By player_Id
async function getAllPlayerInfoById(playerId){
  const player = await axios.get(`${api_domain}/players/${playerId}`, {
    params: {
      include: "team",
      api_token: process.env.api_token,
    },
  });
  const { name} = player.data.data.team.data;
  const { fullname, image_path,position_id,common_name, nationality,birthdate,birthcountry,height,weight } = player.data.data;
  return {
    name: fullname,
    team_name: name,
    image: image_path,
    position: position_id,
    common_name : common_name,
    nationality : nationality,
    birthdate : birthdate,
    birthcountry : birthcountry,
    height : height, 
    weight : weight,
  };
}

// ---------------------  Search section   -------------------------

// get a players by name
async function getPlayerByName(playerName){
  try{
      let players = [];
      const results = await axios.get(`${api_domain}/players/search/${playerName}`, {
          params:{
              include: "team.league, position",
              api_token: process.env.api_token,
          },
      });
      results.data.data.map((player)=>{
        if (player.position != null && player.team_id != null){
          if(player.team != null){
              if(player.team.data != null){
                  if(player.team.data.league != null){
                      if (player.team.data.league.data.id == LEAGUE_ID){
                          if (player.fullname.includes(playerName)){
                              addPlayer(players, player);
                          }
                      }
                  }
              }
          }
      }
      });
      return players;
  }
  catch{
      return "There is a problem"
  }
}

// get players by name and position
async function GetPlayerByNameAndPos(playerName, pos){
  try{
      let players = [];
      const results = await axios.get(`${api_domain}/players/search/${playerName}`, {
          params:{
              include: "team.league, position",
              api_token: process.env.api_token,
          },
      });
      results.data.data.map((player)=>{
          if (player.team_id != null && player.position != null){
              if(player.team != null){
                  if(player.team.data != null){
                      if(player.team.data.league != null){
                          playerPos = player.position.data.name;
                          if (player.team.data.league.data.id == LEAGUE_ID && playerPos == pos){
                              if (player.fullname.includes(playerName)){
                                addPlayer(players, player);
                              }
                          }
                      }
                  }
              }
          }
      });
      return players;
  }
  catch{
      return "There is a problem"
  }
}

// get players by name and Team
async function GetPlayerByNameAndTeam(PlayerName, TeamName){
  try{
      let players = [];
      const results = await axios.get(`${api_domain}/players/search/${PlayerName}`, {
          params:{
              include: "team.league, position",
              api_token: process.env.api_token,
          },
      });
      results.data.data.map((player)=>{
          if (player.team_id != null && player.position != null){
              if(player.team != null){
                  if(player.team.data != null){
                      if(player.team.data.league != null){
                          cur_player_team = player.team.data.name;
                          if (player.team.data.league.data.id == LEAGUE_ID && cur_player_team == TeamName){
                              if (player.fullname.includes(PlayerName)){
                                  addPlayer(players, player);
                              }
                          }
                      }
                  }
              }
          }
      });
      return players;
  }
  catch{
      return "There is a problem"
  }
}

// get a team by their name
async function GetTeamByName(TeamName){
  try{
      let teams = [];
      const results = await axios.get(`${api_domain}/teams/search/${TeamName}`, {
          params:{
              include: "league",
              api_token: process.env.api_token,
          },
      });
      results.data.data.map((team)=>{
          if(team.league != null){
              if(team.league.data != null){
                  if(team.league.data.id == LEAGUE_ID){
                      teams.push({
                          team_id: team.id,
                          team_name: team.name,
                          team_logo: team.logo_path
                      });
                  }
              }
          }
      });
      return teams;
  }
  catch{
      return "There is a problem"
  }
}

function addPlayer(list, p1){
  const pos = p1.position.data.name;
  list.push(
      {
          player_id: p1.player_id,
          player_full_name: p1.fullname,
          player_team_name: p1.team.data.name,
          player_image: p1.image_path,
          player_position: pos         
  });
}

/* ----------------- Export  ---------------- */
exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getAllPlayerInfoById = getAllPlayerInfoById;

//Search section
exports.getPlayerByName = getPlayerByName;
exports.GetPlayerByNameAndPos =GetPlayerByNameAndPos;
exports.GetPlayerByNameAndTeam = GetPlayerByNameAndTeam;
exports.GetTeamByName = GetTeamByName;