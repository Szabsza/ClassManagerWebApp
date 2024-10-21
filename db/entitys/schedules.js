import { executeQuery } from '../db.js';

export const dropTableSchedules = () => {
  const commandInSQL = 'DROP TABLE IF EXISTS Schedules;';
  return executeQuery(commandInSQL);
};

export const createTableSchedules = () => {
  const commandInSQL = `
    CREATE TABLE IF NOT EXISTS Schedules (
        TimeID int PRIMARY KEY auto_increment,
        Start time,
        End time,
        Day date,
        SubjectID int REFERENCES Subjects(SubjectID),
        classType varchar(255)
    );
  `;
  return executeQuery(commandInSQL);
};

export const insertIntoSchedules = (transferData) => {
  const commandInSQL = `
    INSERT INTO Schedules (Start, End, Day, SubjectID, ClassType)
    VALUES (?, ?, ?, ?, ?);
  `;
  return executeQuery(commandInSQL, [
    transferData.start,
    transferData.end,
    transferData.day,
    transferData.subjectID,
    transferData.classType,
  ]);
};

// programalasok megjelenitesenel
export const selectSchedules = (subjectID) => {
  const commandInSQL = `
    SELECT TimeID, TIME_FORMAT(Start, "%H:%i") as Start, TIME_FORMAT(End,"%H:%i") as End, DATE_FORMAT(Day, "%M %d %Y") as Day, SubjectID, ClassType 
    FROM Schedules
    WHERE SubjectID = ?;
  `;
  return executeQuery(commandInSQL, [subjectID]);
};

// programalasok torlesenel (validacio)
export const selectSchedulesByID = (timeID) => {
  const commandInSQL = `
    SELECT TimeID, TIME_FORMAT(Start, "%H:%i") as Start, TIME_FORMAT(End,"%H:%i") as End, DATE_FORMAT(Day, "%M %d %Y") as Day, SubjectID, ClassType 
    FROM Schedules
    WHERE TimeID = ?;
  `;
  return executeQuery(commandInSQL, [timeID]);
};

// programalas letrehozasanal (validacio)
export const selectSchedulesCollison = (subjectID, start, end, day) => {
  const commandInSQL = `
    SELECT * FROM Schedules WHERE SubjectID = ? AND Day = ? AND Start <= ? AND End >= ?
    UNION
    SELECT * FROM Schedules WHERE SubjectID = ? AND Day = ? AND Start >= ? AND Start <= ?;
  `;
  return executeQuery(commandInSQL, [subjectID, day, start, start, subjectID, day, start, end]);
};

// programalas torlesenel
export const deleteScheduleByID = (timeID) => {
  const commandInSQL = `
    DELETE FROM Schedules WHERE TimeID = ?;
  `;
  return executeQuery(commandInSQL, [timeID]);
};
