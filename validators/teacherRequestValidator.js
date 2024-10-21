import * as teacherRequestsTables from '../db/entitys/teacherRequests.js';
import * as usersTable from '../db/entitys/users.js';

export const validateRequest = async (transferData) => {
  const { start, end, day, subjectID, userName, classType, request, session } = transferData;

  const teacherPartOfSubject = await usersTable.selectTeacherPartOfSubject(session.username, subjectID);
  const isTeacherPartOfSubject = Boolean(teacherPartOfSubject.length);

  if (!isTeacherPartOfSubject) {
    return { code: '1', err: 'You are not allowed to do that!' };
  }

  if (start === '') {
    return { code: '1', err: 'Start field cannot be empty!' };
  }

  if (end === '') {
    return { code: '1', err: 'End field cannot be empty!' };
  }

  if (day === '') {
    return { code: '1', err: 'Day field cannot be empty!' };
  }

  if (subjectID === '') {
    return { code: '1', err: 'SubjectID field cannot be empty!' };
  }

  if (userName === '') {
    return { code: '1', err: 'UserName is empty!' };
  }

  if (classType === '') {
    return { code: '1', err: 'Class Type field cannot be empty!' };
  }

  if (request === '') {
    return { code: '1', err: 'Request field cannot be empty!' };
  }

  if (request !== 'create' && request !== 'delete') {
    return { code: '1', err: 'Invalid request!' };
  }

  const requestCountInDB = await teacherRequestsTables.selectCountTeacherRequest(subjectID, userName);

  if (requestCountInDB[0].Count >= 3) {
    return { code: '1', err: 'You can only have 3 requests!\nWait for the admin to decide what to do with them!' };
  }

  return { code: '0', err: null };
};
