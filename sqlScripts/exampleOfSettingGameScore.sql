-- Update rows in table 'TableName'
UPDATE dbo.match
SET
    [homeGoals] = 1,
    [awayGoals] = 2
    -- add more columns and values here
WHERE matchId=1	/* add search conditions here */
GO