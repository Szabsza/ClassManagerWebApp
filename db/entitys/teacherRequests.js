import { executeQuery } from '../db.js';

export const dropTableTeacherRequests = () => {
  const commandInSQL = 'DROP TABLE IF EXISTS TeacherRequests;';
  return executeQuery(commandInSQL);
};

export const createTableTeacherRequests = () => {
  const commandInSQL = `
    CREATE TABLE IF NOT EXISTS TeacherRequests (
        RequestID int PRIMARY KEY auto_increment,
        Start time,
        End time,
        Day date,
        SubjectID int REFERENCES Subjects(SubjectID),
        UserName varchar(255),
        ClassType varchar(255),
        Request varchar(255)
    );
  `;
  return executeQuery(commandInSQL);
};

export const insertIntoTeacherRequests = (transferData) => {
  const commandInSQL = `
    INSERT INTO TeacherRequests (Start, End, Day, SubjectID, UserName, ClassType, Request)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  return executeQuery(commandInSQL, [
    transferData.start,
    transferData.end,
    transferData.day,
    transferData.subjectID,
    transferData.userName,
    transferData.classType,
    transferData.request,
  ]);
};

// keresek megjelenitesenel
export const selectTeacherRequests = (subjectID) => {
  const commandInSQL = `
    SELECT RequestID, TIME_FORMAT(Start, "%H:%i") as Start, TIME_FORMAT(End,"%H:%i") as End, DATE_FORMAT(Day, "%M %d %Y") as Day, SubjectID, UserName, ClassType, Request 
    FROM TeacherRequests
    WHERE SubjectID = ?;
  `;
  return executeQuery(commandInSQL, [subjectID]);
};

// keresek torlesenel (validacio)
export const selectTeacherRequestsByID = (requestID) => {
  const commandInSQL = `
    SELECT RequestID, TIME_FORMAT(Start, "%H:%i") as Start, TIME_FORMAT(End,"%H:%i") as End, DATE_FORMAT(Day, "%M %d %Y") as Day, SubjectID, UserName, ClassType, Request 
    FROM TeacherRequests
    WHERE RequestID = ?;
  `;
  return executeQuery(commandInSQL, [requestID]);
};

// keresek validalasanal
export const selectCountTeacherRequest = (subjectID, userName) => {
  const commandInSQL = `
    SELECT COUNT(*) as Count 
    FROM TeacherRequests 
    WHERE SubjectID = ? AND UserName = ?;
  `;
  return executeQuery(commandInSQL, [subjectID, userName]);
};

// keresek torlesenel
export const deleteTeacherRequestByID = (requestID, subjectID) => {
  const commandInSQL = `
    DELETE FROM TeacherRequests WHERE RequestID = ?;    
  `;
  return executeQuery(commandInSQL, [requestID, subjectID]);
};
