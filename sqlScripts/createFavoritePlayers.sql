-- Create a new table called 'FavoritePlayers' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.FavoritePlayers', 'U') IS NOT NULL
DROP TABLE dbo.FavoritePlayers
GO
-- Create the table in the specified schema
CREATE TABLE dbo.FavoritePlayers
(
    FavoritePlayersId INT NOT NULL PRIMARY KEY, -- primary key column
    userId [NVARCHAR](50) NOT NULL,
    playerId [NVARCHAR](50) NOT NULL
    -- specify more columns here
);
GO