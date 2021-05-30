var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const coach_utils = require("./utils/coach_utils");
const { DateTimeOffset } = require("mssql");


router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const players_details = await players_utils.getPlayersByTeam(req.params.teamId);
    const coach_details = await coach_utils.getCoachInfoByTeam(req.params.teamId);
    //we should keep implementing team page.....
    // need to divide by past games and future games && also get to game event calendar and extract the info
    const games = await DButils.execQuery(
      `SELECT * FROM dbo.match WHERE homeTeamId = '${req.params.teamId}' OR awayTeamId = '${req.params.teamId}'`
    );
    let pastGames = [];
    let upcomingGames = [];
    for(i = 0;i<games.length;i++){
      var currentDate = new Date();
      curr_hours = currentDate.getHours();
      curr_minutes = currentDate.getMinutes();
      curr_day = currentDate.getDate();
      curr_month = currentDate.getMonth();
      curr_year = currentDate.getFullYear();
      let date = games[i]["date"];
      game_year = date.getFullYear();
      game_month = date.getMonth();
      game_day = date.getDate();
      let hour = games[i]["hour"];
      game_hours = hour.getHours();
      game_minutes = hour.getMinutes();
      if(game_year<curr_year)
        pastGames.push(games[i]);
      else if (game_month<curr_month)
        pastGames.push(games[i]);
      else if (game_day<curr_day)
        pastGames.push(games[i]);
      else if (game_hour<curr_hour)
        pastGames.push(games[i]);
      else if (game_minutes<curr_minutes)
        pastGames.push(games[i]);
      else 
        upcomingGames.push(games[i]);
    }
    const team_details=[players_details,coach_details,pastGames,upcomingGames];
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;


var dates = {
  convert:function(d) {
      // Converts the date in d to a date-object. The input can be:
      //   a date object: returned without modification
      //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
      //   a number     : Interpreted as number of milliseconds
      //                  since 1 Jan 1970 (a timestamp) 
      //   a string     : Any format supported by the javascript engine, like
      //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
      //  an object     : Interpreted as an object with year, month and date
      //                  attributes.  **NOTE** month is 0-11.
      return (
          d.constructor === Date ? d :
          d.constructor === Array ? new Date(d[0],d[1],d[2]) :
          d.constructor === Number ? new Date(d) :
          d.constructor === String ? new Date(d) :
          typeof d === "object" ? new Date(d.year,d.month,d.date) :
          NaN
      );
  },
  compare:function(a,b) {
      // Compare two dates (could be of any type supported by the convert
      // function above) and returns:
      //  -1 : if a < b
      //   0 : if a = b
      //   1 : if a > b
      // NaN : if a or b is an illegal date
      // NOTE: The code inside isFinite does an assignment (=).
      return (
          isFinite(a=this.convert(a).valueOf()) &&
          isFinite(b=this.convert(b).valueOf()) ?
          (a>b)-(a<b) :
          NaN
      );
  },
  inRange:function(d,start,end) {
      // Checks if date in d is between dates in start and end.
      // Returns a boolean or NaN:
      //    true  : if d is between start and end (inclusive)
      //    false : if d is before start or after end
      //    NaN   : if one or more of the dates is illegal.
      // NOTE: The code inside isFinite does an assignment (=).
     return (
          isFinite(d=this.convert(d).valueOf()) &&
          isFinite(start=this.convert(start).valueOf()) &&
          isFinite(end=this.convert(end).valueOf()) ?
          start <= d && d <= end :
          NaN
      );
  }
}