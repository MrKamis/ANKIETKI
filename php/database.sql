CREATE DATABASE ankietki;

USE ankietki;

CREATE TAble listOfAnkiet(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title TEXT,
    options TEXT,
    created TIMESTAMP,
    password TEXT,
    logs TEXT
);