const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
require("dotenv").config({path:'C:/Users/Ron/Documents/Github/assignment-3-2-211972898_211456538_207764622/.env'});
// const TEAM_ID = "85";

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

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

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    console.log(player_info.data.data);
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

async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

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

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getAllPlayerInfoById = getAllPlayerInfoById;
