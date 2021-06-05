-- Create a new table called 'FavoritePlayers' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.FavoriteMatches', 'U') IS NOT NULL
DROP TABLE dbo.FavoriteMatches
GO
-- Create the table in the specified schema
CREATE TABLE dbo.FavoriteMatches
(
    FavoriteMatchesrRecordId INT NOT NULL IDENTITY(1,1) PRIMARY KEY, -- primary key column
    user_id INT NOT NULL
    CONSTRAINT FK_userToFavMatches
    FOREIGN KEY (user_id)
    REFERENCES dbo.users(user_id),
    matchId INT NOT NULL
    CONSTRAINT FK_matchToFavMatches
    FOREIGN KEY (matchId)
    REFERENCES dbo.match(matchId)
    -- specify more columns here
);
GO