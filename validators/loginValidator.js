import crypto from 'crypto';
import * as usersTable from '../db/entitys/users.js';

const hashSize = 32;
// const saltSize = 16;
const hashAlgorithm = 'sha512';
const iterations = 1000;

export const validateData = async (transferData) => {
  const { UserName, Password, Role } = transferData;

  if (UserName === '') {
    return { code: '1', err: 'Username field cannot be empty!' };
  }

  if (Password === '') {
    return { code: '1', err: 'Password field cannot be empty!' };
  }

  const roles = ['admin', 'teacher'];
  const contains = roles.find((item) => item === Role);

  if (!contains) {
    return { code: '1', err: 'Invalid Role!' };
  }

  const userByUsername = await usersTable.selectUserByName(UserName);
  const isUserInDB = Boolean(userByUsername.length);

  if (!isUserInDB) {
    return { code: '1', err: 'User does not exists!' };
  }

  // jelszo ellenorzes
  const expectedHash = userByUsername[0].Password.substring(0, hashSize * 2);
  const salt = Buffer.from(userByUsername[0].Password.substring(hashSize * 2), 'hex');
  const binaryHash = crypto.pbkdf2Sync(Password, salt, iterations, hashSize, hashAlgorithm);
  const actualHash = binaryHash.toString('hex');

  // ellenorizzuk, hogy a beirt jelszobol szarmazo hash megegyezik-e a tarolt hash-el
  if (expectedHash !== actualHash) {
    return { code: '1', err: 'Wrong credentials!' };
  }

  if (userByUsername[0].Type !== Role) {
    return { code: '1', err: 'Wrong credintials!' };
  }

  return { code: '0', err: null };
};
