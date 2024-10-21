import * as usersTable from '../db/entitys/users.js';

export const validateData = async (transferData, method) => {
  if (method === 'delete') {
    const { UserName } = transferData;

    if (UserName === '') {
      return { code: '1', err: 'Teacher field cannot be empty!!' };
    }

    const teacher = await usersTable.selectTeachersByName({ UserName });
    const isTeacherInDB = Boolean(teacher.length);

    if (!isTeacherInDB) {
      return { code: '1', err: 'Teacher not exists!' };
    }

    return { code: '0', err: null };
  }

  if (method === 'create') {
    const { UserName, Password, PasswordAgain } = transferData;

    if (UserName === '') {
      return { code: '1', err: "Teacher's UserName field cannot be empty!!" };
    }

    const teacher = await usersTable.selectTeachersByName({ UserName });
    const isTeacherInDB = Boolean(teacher.length);

    if (isTeacherInDB) {
      return { code: '1', err: 'Teacher already exists!' };
    }

    if (Password === '') {
      return { code: '1', err: 'Password field cannot be empty!' };
    }

    if (PasswordAgain === '') {
      return { code: '1', err: 'Password field cannot be empty!' };
    }

    if (Password !== PasswordAgain) {
      return { code: '1', err: 'Password fields must be the same!' };
    }

    return { code: '0', err: null };
  }

  return { code: '1', err: 'Invalid method' };
};
