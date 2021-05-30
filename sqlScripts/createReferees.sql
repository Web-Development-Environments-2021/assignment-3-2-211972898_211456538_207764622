-- Create a new table called 'referee' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.referee', 'U') IS NOT NULL
DROP TABLE dbo.referee
GO
-- Create the table in the specified schema
CREATE TABLE dbo.referee
(
    refereeId INT NOT NULL PRIMARY KEY, -- primary key column
    fullname [NVARCHAR](50) NOT NULL
);
GO