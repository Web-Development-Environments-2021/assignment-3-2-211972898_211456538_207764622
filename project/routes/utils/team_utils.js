const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
require("dotenv").config({path:'./../.env'});

async function getTeamsInfo(teams_ids_list) {
    let promises = [];
    teams_ids_list.map((id) =>
      promises.push(
        axios.get(`${api_domain}/teams/${id}`, {
          params: {
            api_token: process.env.api_token,
            // include: "team",
          },
        })
      )
    );
    let teams_info = await Promise.all(promises);
    return extractRelevantTeamData(teams_info);
  }

async function getTeamInfo(team_id) {
  const team_info = await axios.get(`${api_domain}/teams/${team_id}`, {
      params: {
        api_token: process.env.api_token,
      },
  });
  return extractTeamData(team_info);
}

function extractTeamData(team_info) {
  if (team_info.data.data === undefined){
    return undefined;
  }
  const { name, logo_path, founded } = team_info.data.data;
  return {
    name: name,
    image: logo_path,
    founded: founded,
  };
}
  
function extractRelevantTeamData(teams_info) {
    return teams_info.map((team_info) => {
      if (team_info.data.data === undefined){
        return undefined;
      }
      const { name, logo_path, founded } = team_info.data.data;
      return {
        name: name,
        image: logo_path,
        founded: founded,
      };
    });
  }
  
  
exports.getTeamsInfo = getTeamsInfo
exports.getTeamInfo = getTeamInfo;