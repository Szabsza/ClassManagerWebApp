import * as subjectsTable from '../db/entitys/subjects.js';

export const validateData = async (transferData) => {
  const { SubjectID, SubjectName, Semester, Courses, Seminars, Labs } = transferData;

  if (Number.isNaN(SubjectID)) {
    return { code: '1', err: 'SubjectID must be a Number!' };
  }

  if (SubjectID < 0) {
    return { code: '1', err: 'SubjectID value cannot be less then 0!' };
  }

  const subjectByID = await subjectsTable.selectSubject(SubjectID);
  const isSubjectInDB = Boolean(subjectByID.length);

  if (isSubjectInDB) {
    return { code: '1', err: 'This SubjectID is already in use!' };
  }

  if (SubjectName === '') {
    return { code: '1', err: 'SubjectName field cannot be empty!' };
  }

  const semesters = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
  const contains = semesters.find((item) => item === Semester);

  if (!contains) {
    return { code: '1', err: 'Invalid Semester!' };
  }

  if (Number.isNaN(Courses)) {
    return { code: '1', err: 'Courses field must be a number!' };
  }

  if (Courses < 0) {
    return { code: '1', err: 'Number of courses cannot be less then 0!' };
  }

  if (Number.isNaN(Seminars)) {
    return { code: '1', err: 'Seminars field must be a number!' };
  }

  if (Seminars < 0) {
    return { code: '1', err: 'Number of seminars cannot be less then 0!' };
  }

  if (Number.isNaN(Labs)) {
    return { code: '1', err: 'Labs field must be a number!' };
  }

  if (Labs < 0) {
    return { code: '1', err: 'Number of labs cannot be less then 0!' };
  }

  return { code: '0', err: null };
};
