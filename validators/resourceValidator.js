import * as subjectsTable from '../db/entitys/subjects.js';
import * as usersTable from '../db/entitys/users.js';

export const validateData = async (dataForValidation) => {
  const { SubjectID, UploadedFiles, Session } = dataForValidation;

  if (!Session) {
    return { code: '1', err: 'Invalid session!' };
  }

  if (UploadedFiles.length === 0) {
    return { code: '1', err: 'There are no selected files!' };
  }

  if (Number.isNaN(SubjectID)) {
    return { code: '2', err: 'SubjectID must be a Number!' };
  }

  if (SubjectID < 0) {
    return { code: '2', err: 'SubjectID value cannot be less then 0!' };
  }

  const subjectByID = await subjectsTable.selectSubject(SubjectID);
  const isSubjectInDB = Boolean(subjectByID.length);

  if (!isSubjectInDB) {
    return { code: '2', err: 'This SubjectID is already in use!' };
  }

  const teacherPartOfSubject = await usersTable.selectTeacherPartOfSubjectByUsername(Session.username);
  const isTeacherPartOfSubject = Boolean(teacherPartOfSubject.length);

  if (!isTeacherPartOfSubject && Session.role !== 'admin') {
    return { code: '2', err: 'You are not allowed to do that!' };
  }

  return { code: '0', err: null };
};
