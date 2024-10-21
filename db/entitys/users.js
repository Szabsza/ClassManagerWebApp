import crypto from 'crypto';
import { executeQuery } from '../db.js';

export const dropTableUsers = () => {
  const commandInSQL = 'DROP TABLE IF EXISTS Users;';
  return executeQuery(commandInSQL);
};

export const createTableUsers = () => {
  const commandInSQL = `
    CREATE TABLE IF NOT EXISTS Users (
        UserID int auto_increment,
        UserName varchar(255) UNIQUE,
        PRIMARY KEY(UserID),
        Password varchar(255),
        Type varchar(20)
    );
  `;
  return executeQuery(commandInSQL);
};

export const createUser = (UserName, Password, Role) => {
  const commandInSQL = `
    INSERT INTO Users (UserName, Password, Type)
    VALUES(?, ?, ?);
  `;

  const hashSize = 32;
  const saltSize = 16;
  const hashAlgorithm = 'sha512';
  const iterations = 1000;

  const salt = crypto.randomBytes(saltSize);
  const hash = crypto.pbkdf2Sync(Password, salt, iterations, hashSize, hashAlgorithm);
  const hashWithSalt = Buffer.concat([hash, salt]).toString('hex');

  return executeQuery(commandInSQL, [UserName, hashWithSalt, Role]);
};

export const insertNewUser = (transferData) => {
  const commandInSQL = `
    INSERT INTO Users (UserName, Password, Type)
    VALUES(?, ?, ?);
  `;
  return executeQuery(commandInSQL, [transferData.UserName, transferData.Password, transferData.Role]);
};

// nincs hasznalva
export const getUserFields = () => {
  const commandInSQL = `
      SELECT * FROM Users;
  `;
  return executeQuery(commandInSQL);
};

// tanar tantargyhoz valo hozzarendelesenel (validacio)
export const selectUser = (UserID) => {
  const commandInSQL = `
      SELECT * FROM Users WHERE UserID = ?;
  `;
  return executeQuery(commandInSQL, [UserID]);
};

// bejelentkezesnel (validacio)
export const selectUserByName = (UserName) => {
  const commandInSQL = `
      SELECT * FROM Users WHERE UserName = ?;
  `;
  return executeQuery(commandInSQL, [UserName]);
};

// tanar letrehozasanal vagy torlesenel (validacio)
export const selectTeachersByName = (transferData) => {
  const commandInSQL = `
    SELECT * FROM Users WHERE UserName = ? and Type = 'teacher';
  `;
  return executeQuery(commandInSQL, [transferData.UserName]);
};

// tanarok megjelenitesenel
export const selectTeachers = () => {
  const commandInSQL = `
    SELECT * FROM Users WHERE Type = 'teacher';
  `;
  return executeQuery(commandInSQL, []);
};

// tanarok torlesenel
export const deleteTeacher = (transferData) => {
  const commandInSQL = `
    DELETE FROM Users WHERE UserName = ? and Type = 'teacher';
  `;
  return executeQuery(commandInSQL, [transferData.UserName]);
};

// nincs hasznalva
export const selectTeacherPartOfSubjectByUsername = (UserName) => {
  const commandInSQL = `
    SELECT *
    FROM Users
    JOIN Applies ON Applies.UserID = Users.UserID
    WHERE Users.Username = ?;
  `;
  return executeQuery(commandInSQL, [UserName]);
};

// tanarok keresenel (validacio)
export const selectTeachersPartOfSubjectBySubjectID = (SubjectID) => {
  const commandInSQL = `
    SELECT Users.UserName
    FROM Users
    JOIN Applies ON Applies.UserID = Users.UserID
    WHERE Applies.SubjectID = ?;
  `;
  return executeQuery(commandInSQL, [SubjectID]);
};

// tanar keres validacional hasznalva
export const selectTeacherPartOfSubject = (UserName, SubjectID) => {
  const commandInSQL = `
    SELECT *
    FROM Users
    JOIN Applies ON Applies.UserID = Users.UserID
    WHERE Users.Username = ? AND Applies.SubjectID = ?;
  `;
  return executeQuery(commandInSQL, [UserName, SubjectID]);
};
