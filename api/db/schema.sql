-- Spectergram Database Schema
-- This script creates the necessary tables for the application

-- Users table (if not already created)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user' AND xtype='U')
BEGIN
    CREATE TABLE [user] (
        id INT PRIMARY KEY IDENTITY(1,1),
        username NVARCHAR(50) NOT NULL UNIQUE,
        gmail NVARCHAR(100) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        last_login DATETIME2 NULL
    );
END;
GO

-- Friendships table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='friendships' AND xtype='U')
BEGIN
    CREATE TABLE friendships (
        id INT PRIMARY KEY IDENTITY(1,1),
        user_id INT NOT NULL,
        friend_id INT NOT NULL,
        status NVARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES [user](id) ON DELETE CASCADE,
        FOREIGN KEY (friend_id) REFERENCES [user](id) ON DELETE NO ACTION,
        -- Ensure no duplicate friendships
        CONSTRAINT UQ_friendship UNIQUE (user_id, friend_id),
        -- Ensure user can't friend themselves
        CONSTRAINT CHK_not_self CHECK (user_id != friend_id)
    );
END;
GO

-- Create index for faster friend lookups
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_friendships_user_id' AND object_id = OBJECT_ID('friendships'))
BEGIN
    CREATE INDEX IX_friendships_user_id ON friendships(user_id);
END;
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_friendships_friend_id' AND object_id = OBJECT_ID('friendships'))
BEGIN
    CREATE INDEX IX_friendships_friend_id ON friendships(friend_id);
END;
GO

-- User presence table (for tracking online status)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_presence' AND xtype='U')
BEGIN
    CREATE TABLE user_presence (
        user_id INT PRIMARY KEY,
        status NVARCHAR(20) DEFAULT 'offline', -- online, offline, away
        last_seen DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES [user](id) ON DELETE CASCADE
    );
END;
GO
