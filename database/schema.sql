-- CREATE DATABASE Docufi;
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    Id SERIAL,
    Email TEXT,
    FirstName TEXT,
    LastName Text,
    -- We will deactivate accounts - not delete
    AccountIsActive bool,
    Hash Text,
    PRIMARY KEY (Id)
);

INSERT INTO Users (Email, FirstName, LastName, Hash) VALUES ('shaunn@me.com', 'Shaunn', 'Diamond','abc123');

CREATE TABLE Files (
    Id SERIAL,
    DocumentName TEXT,
    OriginalName TEXT,
    FileName TEXT,
    FilePath TEXT,
    UserId INT REFERENCES Users (Id),
    FileSize INTEGER,
    FileType TEXT,
    -- DateUploaded is ISO
    DateUploaded DATE,
    LastModifiedTime DATE,
    PRIMARY KEY (Id)
);




