-- Create a new table called 'FavoritePlayers' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.FavoriteTeams', 'U') IS NOT NULL
DROP TABLE dbo.FavoriteTeams
GO
-- Create the table in the specified schema
CREATE TABLE dbo.FavoriteTeams
(
    FavoriteTeamRecordId INT NOT NULL IDENTITY(1,1) PRIMARY KEY, -- primary key column
    user_id INT NOT NULL,
    teamId INT NOT NULL
    -- specify more columns here
);
GO