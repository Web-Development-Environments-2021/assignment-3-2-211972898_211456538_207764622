-- Create a new table called 'match' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.match', 'U') IS NOT NULL
DROP TABLE dbo.match
GO
-- Create the table in the specified schema
CREATE TABLE dbo.match
(
    matchId INT NOT NULL IDENTITY(1,1) PRIMARY KEY, -- primary key column
    date DATE NOT NULL,
    hour TIME NOT NULL,
    homeTeamId INT NOT NULL,
    awayTeamId INT NOT NULL,
    stadium [VARCHAR] (20) NOT NULL,
    refereeId INT NOT NULL,
    homeGoals INT,
    awayGoals INT,
    calendarId INT,
    CONSTRAINT FK_refereeToMatch 
    FOREIGN KEY (refereeId)
    REFERENCES dbo.referee(refereeId)
    -- specify more columns here
);
GO