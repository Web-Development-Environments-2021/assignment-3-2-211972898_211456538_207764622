-- Create a new table called 'Users' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL
DROP TABLE dbo.users
GO
-- Create the table in the specified schema
CREATE TABLE dbo.users
(
    user_id INT NOT NULL IDENTITY(1,1) PRIMARY KEY, -- primary key column
    username [NVARCHAR](8) NOT NULL UNIQUE,
    password [NVARCHAR](300) NOT NULL
    -- specify more columns here
);
GO