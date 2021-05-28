const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getCoachInfoByTeam(team_id) {
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
      params: {
        include: "coach",
        api_token: process.env.api_token,
      },
    });
    const { fullname, image_path } = team.data.data.coach.data;
    const { name } = team.data.data;
    return {
      name: fullname,
      image: image_path,
      team_name: name,
    };
}

async function getAllCoachInfoById(coachId){
  const coach = await axios.get(`${api_domain}/coaches/${coachId}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
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

exports.getCoachInfoByTeam = getCoachInfoByTeam;
exports.getAllCoachInfoById = getAllCoachInfoById;