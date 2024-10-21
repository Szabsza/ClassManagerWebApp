import { executeQuery } from '../db.js';

export const dropTableSubjects = () => {
  const commandInSQL = 'DROP TABLE IF EXISTS Subjects;';
  return executeQuery(commandInSQL);
};

export const createTableSubjects = () => {
  const commandInSQL = `
    CREATE TABLE IF NOT EXISTS Subjects (
        SubjectID int auto_increment,
        PRIMARY KEY(SubjectID),
        SubjectName varchar(50),
        Semester varchar(20),
        Courses int,
        Seminars int,
        Labs int
    );
  `;
  return executeQuery(commandInSQL);
};

export const insertNewSubject = (transferData) => {
  const commandInSQL = `
      INSERT INTO Subjects (SubjectID, SubjectName, Semester, Courses, Seminars, Labs)
      VALUES(?, ?, ?, ?, ?, ?);
    `;
  return executeQuery(commandInSQL, [
    transferData.SubjectID,
    transferData.SubjectName,
    transferData.Semester,
    transferData.Courses,
    transferData.Seminars,
    transferData.Labs,
  ]);
};

// tantargyak megjelenitesenel
export const getSubjectFields = () => {
  const commandInSQL = `
      SELECT * FROM Subjects;
  `;
  return executeQuery(commandInSQL);
};

// tantargyak beszurasanal (validacio)
export const selectSubject = (SubjectID) => {
  const commandInSQL = `
      SELECT * FROM Subjects WHERE SubjectID = ?;
  `;
  return executeQuery(commandInSQL, [SubjectID]);
};

// tantargyak extra infokkal torteno megjelenitesenel
export const selectCoursesSeminarsLabs = (SubjectID) => {
  const commandInSQL = `
      SELECT Courses, Seminars, Labs FROM Subjects WHERE SubjectID = ?;
  `;
  return executeQuery(commandInSQL, [SubjectID]);
};
