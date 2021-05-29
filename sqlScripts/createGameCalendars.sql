-- Create a new table called 'gameCalendar' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.matchCalendar', 'U') IS NOT NULL
DROP TABLE dbo.matchCalendar
GO
-- Create the table in the specified schema
CREATE TABLE dbo.matchCalendar
(
    matchCalendarId INT NOT NULL IDENTITY(1,1) PRIMARY KEY, -- primary key column
    matchId INT UNIQUE NOT NULL,
    CONSTRAINT FK_matchToCalendar 
    FOREIGN KEY (matchId)
    REFERENCES dbo.match(matchId)
    -- specify more columns here
);
GO