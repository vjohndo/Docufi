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

INSERT INTO Users (Email, FirstName, LastName, Hash) VALUES ('testlogin1@email.com', 'test', 'login1', '$2b$10$oqdKaka0vRfS6bKBL6qFSuS.MzajDpyRzMUgHS43MOqGsLqchx.5K');
INSERT INTO Users (Email, FirstName, LastName, Hash) VALUES ('testlogin2@email.com', 'test', 'login2', '$2b$10$oqdKaka0vRfS6bKBL6qFSuS.MzajDpyRzMUgHS43MOqGsLqchx.5K');
