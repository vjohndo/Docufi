-- CREATE DATABASE Docufi;
DROP TABLE IF EXISTS Searchterms;
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Entities;


CREATE TABLE Users (
    Id SERIAL,
    Email TEXT,
    FirstName TEXT,
    LastName Text,
    -- We will deactivate accounts - not delete
    AccountIsActive bool,
    Hash Text,
    PRIMARY KEY (Id),
    -- Want to make email unique
    UNIQUE (email)
);

CREATE TABLE Files (
    Id SERIAL,
    DocumentName TEXT,
    OriginalName TEXT,
    FileName TEXT,
    FilePath TEXT,
    UserId INT REFERENCES Users (Id),
    FileSize INTEGER,
    FileType TEXT,
    TextAnalysis JSON,
    Sentiment TEXT, 
    ConfidenceScores JSON,
    Processed BOOLEAN DEFAULT false,
    -- DateUploaded is ISO
    DateUploaded DATE,
    LastModifiedTime DATE,
    PRIMARY KEY (Id)
);

CREATE TABLE Entities (
    Id SERIAL,
    Entity Text,
    UNIQUE (Entity),
    PRIMARY KEY (Id)
);

CREATE TABLE Searchterms (
    FilesID int,
    EntitiesID int,
    FOREIGN KEY (FilesID) REFERENCES Files(Id),
    FOREIGN KEY (EntitiesID) REFERENCES Entities(Id)
);

-- password123
-- INSERT INTO Users (Email, FirstName, LastName, Hash) VALUES ('test1@email.com', 'test', 'login1', '$2b$10$oqdKaka0vRfS6bKBL6qFSuS.MzajDpyRzMUgHS43MOqGsLqchx.5K');
-- INSERT INTO Users (Email, FirstName, LastName, Hash) VALUES ('test2@email.com', 'test', 'login2', '$2b$10$oqdKaka0vRfS6bKBL6qFSuS.MzajDpyRzMUgHS43MOqGsLqchx.5K');
