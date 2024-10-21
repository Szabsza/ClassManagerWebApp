import * as subjectsTable from '../db/entitys/subjects.js';
import * as usersTable from '../db/entitys/users.js';
import * as appliesTable from '../db/entitys/applies.js';

export const validateData = async (transferData) => {
  const { StudentID, SubjectID, Action } = transferData;

  if (Number.isNaN(StudentID)) {
    return { code: '1', err: 'UserID must be a Number!' };
  }

  if (StudentID < 0) {
    return { code: '1', err: 'UserID value cannot be less then 0!' };
  }

  if (Number.isNaN(SubjectID)) {
    return { code: '1', err: 'SubjectID must be a Number!' };
  }

  if (SubjectID < 0) {
    return { code: '1', err: 'SubjectID value cannot be less then 0!' };
  }

  const actions = ['join', 'leave'];
  const contains = actions.find((item) => item === Action);

  if (!contains) {
    return { code: '1', err: 'Invalid Action!' };
  }

  const subjectByID = await subjectsTable.selectSubject(SubjectID);
  const isSubjectInDB = Boolean(subjectByID.length);

  if (!isSubjectInDB) {
    return { code: '1', err: 'Invalid SubjectID!' };
  }

  const userByID = await usersTable.selectUser(StudentID);
  const isUserInDB = Boolean(userByID.length);

  if (!isUserInDB) {
    return { code: '1', err: 'Invalid UserID!' };
  }

  const applicationByID = await appliesTable.selectUserPartOfSubject(StudentID, SubjectID);
  const applied = Boolean(applicationByID.length);

  if (applied && Action === 'join') {
    return { code: '1', err: 'Teacher is already part of this Subject!' };
  }

  if (!applied && Action === 'leave') {
    return { code: '1', err: 'Teacher is not part of this Subject!' };
  }

  return { code: '0', err: null };
};
