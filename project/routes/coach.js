/* ------ Import libraries & set environment variables ------*/
var express = require("express");
var router = express.Router();
const coach_utils = require("./utils/coach_utils");

/* ----------------- ROUTING ---------------- */

//coachFullDetails
router.get("/coachFullDetails/:coachId", async (req, res, next) => {
  try {
    const coach_details = await coach_utils.getAllCoachInfoById(req.params.coachId);
    res.send(coach_details);
  } catch (error) 
  {
    try{
      throw {status:"404", message:"Coach not found(try another ID)"}
    }
    catch(error)
    {
      next(error);
    }
  }

});


/* -------- Export Function -------- */
module.exports = router;