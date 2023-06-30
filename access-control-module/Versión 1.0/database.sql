CREATE DATABASE IF NOT EXISTS script;

USE script;


CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);


CREATE TABLE groups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255)
);


CREATE TABLE users_group (
  user_id INT,
  group_id INT,
  role VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (group_id) REFERENCES groups(id),
  PRIMARY KEY (user_id, group_id)
);


CREATE TABLE data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);


CREATE TABLE group_access (
  group_id INT,
  data_id INT,
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (data_id) REFERENCES data(id),
  PRIMARY KEY (group_id, data_id)
);


CREATE TABLE access (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL
);



