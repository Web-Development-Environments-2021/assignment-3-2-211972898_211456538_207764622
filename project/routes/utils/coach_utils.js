/* ------ Import libraries & set environment variables ------*/
const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

/* -------- Scope Function -------- */

// return coach info by team id
async function getCoachInfoByTeam(team_id) {
  // get team by api from outer source
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "coach",
      api_token: process.env.api_token,
    },
  })
  // get fullname,image_path, and team name
  const { fullname, image_path} = team.data.data.coach.data;
  const { name } = team.data.data;
  return {
    name: fullname,
    image: image_path,
    team_name: name,
  };
}

async function getAllCoachInfoById(coachId){
  // get coach info from outer source
  const coach = await axios.get(`${api_domain}/coaches/${coachId}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
 
  // information
  const { fullname, image_path,common_name, nationality,birthdate,birthcountry, team_id} = coach.data.data;
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  const { name} = team.data.data;
  return {
    name: fullname,
    team_name: name,
    image: image_path,
    common_name : common_name,
    nationality : nationality,
    birthdate : birthdate,
    birthcountry : birthcountry,
  };
}

/* -------- Export Function -------- */
exports.getCoachInfoByTeam = getCoachInfoByTeam;
exports.getAllCoachInfoById = getAllCoachInfoById;