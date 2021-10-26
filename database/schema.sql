-- CREATE DATABASE Docufi;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
                       Id SERIAL,
                       Email TEXT,
                       FirstName TEXT,
                       LastName Text,
                       Hash Text
);

INSERT INTO Users (Email, FirstName, LastName, Hash) VALUES ('testlogin1@email.com', 'test', 'login1', 'wordpass');
INSERT INTO Users (Email, FirstName, LastName, Hash) VALUES ('testlogin2@email.com', 'test', 'login2', 'wordpass');
