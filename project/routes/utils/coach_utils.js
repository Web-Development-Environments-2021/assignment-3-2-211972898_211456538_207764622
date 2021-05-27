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

exports.getCoachInfoByTeam = getCoachInfoByTeam;