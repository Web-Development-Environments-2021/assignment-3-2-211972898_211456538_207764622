-- Create a new table called 'gameCalendar' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.gameCalendar', 'U') IS NOT NULL
DROP TABLE dbo.gameCalendar
GO
-- Create the table in the specified schema
CREATE TABLE dbo.gameCalendar
(
    gameCalendarId INT NOT NULL PRIMARY KEY, -- primary key column
    gameId INT NOT NULL,
    CONSTRAINT FK_gameToCalendar 
    FOREIGN KEY (gameId)
    REFERENCES dbo.match(matchId)
    -- specify more columns here
);
GO