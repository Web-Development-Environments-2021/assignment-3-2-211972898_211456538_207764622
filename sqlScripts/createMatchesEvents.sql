-- Create a new table called 'calendarEvents' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.calendarEvents', 'U') IS NOT NULL
DROP TABLE dbo.calendarEvents
GO
-- Create the table in the specified schema
CREATE TABLE dbo.calendarEvents
(
    calendarEventsId INT NOT NULL IDENTITY(1,1) PRIMARY KEY, -- primary key column
    calendarId INT NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT FK_eventToCalendar 
    FOREIGN KEY (calendarId)
    REFERENCES dbo.matchCalendar(matchCalendarId)
    -- specify more columns here
);
GO