CREATE DATABASE todoapp;

CREATE TABLE todos (
  id VARCHAR(255) PRIMARY KEY,
  user_email VARCHAR(255),
  title VARCHAR(30),
  progress INT,
  date VARCHAR(300)
);

CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  hashed_password VARCHAR(255)
);

SELECT * FROM todos;

INSERT INTO todos(id, user_email, title, progress, date) VALUES('0', 'rafael@test.com', 'first todo', 10, '2023-03-06T22:09:18.948Z');
