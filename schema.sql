-- CREATE DATABASE Docufi;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
                       Id SERIAL,
                       Email TEXT,
                       FirstName TEXT,
                       LastName Text,
                       Hash Text
);


