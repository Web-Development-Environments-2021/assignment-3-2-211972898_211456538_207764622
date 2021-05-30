-- Create a new table called 'FavoritePlayers' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.FavoriteMatches', 'U') IS NOT NULL
DROP TABLE dbo.FavoriteMatches
GO
-- Create the table in the specified schema
CREATE TABLE dbo.FavoriteMatches
(
    FavoriteMatchesrRecordId INT NOT NULL IDENTITY(1,1) PRIMARY KEY, -- primary key column
    user_id INT NOT NULL,
    matchId INT NOT NULL
    -- specify more columns here
);
GO