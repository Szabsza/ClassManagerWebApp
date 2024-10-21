import { executeQuery } from '../db.js';

export const dropTableApplies = () => {
  const commandInSQL = 'DROP TABLE IF EXISTS Applies;';
  return executeQuery(commandInSQL);
};

export const createTableApplies = () => {
  const commandInSQL = `
    CREATE TABLE IF NOT EXISTS Applies (
        UserID int REFERENCES Users(UserID),
        SubjectID int REFERENCES Subjects(SubjectID),
        PRIMARY KEY(UserID, SubjectID)
    );
  `;
  return executeQuery(commandInSQL);
};

export const insertNewApplicant = (transferData) => {
  if (transferData.Action === 'join') {
    const commandInSQL = `
        INSERT INTO Applies (UserID, SubjectID) 
        VALUES(?, ?);
      `;
    return executeQuery(commandInSQL, [transferData.StudentID, transferData.SubjectID]);
  }

  if (transferData.Action === 'leave') {
    const commandInSQL = `
        DELETE FROM Applies WHERE UserID = ?;
      `;
    return executeQuery(commandInSQL, [transferData.StudentID]);
  }

  return Promise.reject();
};

// tanar tantargyhoz valo hozzarendelesnel (validacio)
export const selectUserPartOfSubject = (UserID, SubjectID) => {
  const commandInSQL = `
      SELECT * FROM Applies WHERE UserID = ? and SubjectID = ?;
    `;
  return executeQuery(commandInSQL, [UserID, SubjectID]);
};
