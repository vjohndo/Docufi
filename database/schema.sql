-- CREATE DATABASE Docufi;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
                        id SERIAL,
                        email TEXT,
                        firstName TEXT,
                        lastName Text,
                        hash Text,
                        UNIQUE (email)

);

INSERT INTO Users (Email, FirstName, LastName, Hash) VALUES ('testlogin1@email.com', 'test', 'login1', 'wordpass');
INSERT INTO Users (Email, FirstName, LastName, Hash) VALUES ('testlogin2@email.com', 'test', 'login2', 'wordpass');
