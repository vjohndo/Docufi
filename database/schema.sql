-- CREATE DATABASE Docufi;
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    Id SERIAL,
    Email TEXT,
    FirstName TEXT,
    LastName Text,
    Hash Text,
    PRIMARY KEY (Id)
);

INSERT INTO Users (Email, FirstName, LastName, Hash) VALUES ('shaunn@me.com', 'Shaunn', 'Diamond','abc123');

CREATE TABLE Files (
    Id SERIAL,
    Name TEXT,
    UserId INT,
    SizeBytes INTEGER,
    Type TEXT,
    DateUploaded DATE,
    PRIMARY KEY (Id),
    CONSTRAINT fk_user
            FOREIGN KEY (Id)
                   REFERENCES Users(Id)
);




