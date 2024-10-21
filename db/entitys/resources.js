import { executeQuery } from '../db.js';

export const dropTableResourcres = () => {
  const commandInSQL = 'DROP TABLE IF EXISTS Resources;';
  return executeQuery(commandInSQL);
};

export const createTableResources = () => {
  const commandInSQL = `
    CREATE TABLE IF NOT EXISTS Resources (
        ResourceID int auto_increment,
        PRIMARY KEY(ResourceID),
        ResourceName varchar(255),
        OriginalName varchar(255),
        SubjectID int REFERENCES Subjects(SubjectID),
        UserName varchar(255) REFERENCES Users(UserName)
    );
  `;
  return executeQuery(commandInSQL);
};

export const insertNewResources = (transferData) => {
  const commandInSQL = `
      INSERT INTO Resources (ResourceName, OriginalName, SubjectID, UserName) 
      VALUES(?, ?, ?, ?);
    `;
  return executeQuery(commandInSQL, [
    transferData.ResourceName,
    transferData.OriginalName,
    transferData.SubjectID,
    transferData.UserName,
  ]);
};

// eroforrasok megjelenitesenel
export const selectResourcesBySubjectID = (SubjectID) => {
  const commandInSQL = `
    SELECT * FROM Resources WHERE SubjectID = ?;
  `;
  return executeQuery(commandInSQL, [SubjectID]);
};

// eroforrasok torlesenel (validacio)
export const selectResourcesByResourceNameAndUserName = (ResourceName, UserName) => {
  const commandInSQL = `
    SELECT * FROM Resources WHERE ResourceName = ? and UserName = ?;
  `;
  return executeQuery(commandInSQL, [ResourceName, UserName]);
};

// eroforrasok torlesenel
export const deleteResources = (ResourceName, UserName) => {
  const commandInSQL = `
    DELETE FROM Resources WHERE ResourceName = ? and UserName = ?;
  `;
  return executeQuery(commandInSQL, [ResourceName, UserName]);
};
