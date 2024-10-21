import crypto from 'crypto';
import * as usersTable from '../db/entitys/users.js';
import { validateData } from '../validators/teacherValidator.js';

export const createTeacher = async (req, res) => {
  const transferData = {
    UserName: req.body.UserName,
    Password: req.body.Password,
    PasswordAgain: req.body.PasswordAgain,
  };

  try {
    const { code, err } = await validateData(transferData, 'create');
    if (code === '1') {
      res.status(400).render('teachers', {
        session: req.session,
        users: await usersTable.selectTeachers(),
        info: null,
        error: null,
        infoCreate: null,
        errorCreate: err,
      });
      return;
    }

    const hashSize = 32;
    const saltSize = 16;
    const hashAlgorithm = 'sha512';
    const iterations = 1000;

    const salt = crypto.randomBytes(saltSize);
    const hash = crypto.pbkdf2Sync(transferData.Password, salt, iterations, hashSize, hashAlgorithm);
    const hashWithSalt = Buffer.concat([hash, salt]).toString('hex');

    await usersTable.insertNewUser({ UserName: req.body.UserName, Password: hashWithSalt, Role: 'teacher' });

    res.status(200).render('teachers', {
      session: req.session,
      users: await usersTable.selectTeachers(),
      info: null,
      error: null,
      infoCreate: 'Teacher successfully Created!',
      errorCreate: null,
    });
  } catch (err) {
    res.status(500).render('error', { error: err, session: req.session });
  }
};

export const deleteTeacher = async (req, res) => {
  const transferData = {
    UserName: req.body.Users,
  };

  try {
    const { code, err } = await validateData(transferData, 'delete');
    if (code === '1') {
      res.status(400).render('teachers', {
        session: req.session,
        users: await usersTable.selectTeachers(),
        info: null,
        error: err,
        infoCreate: null,
        errorCreate: null,
      });
      return;
    }

    await usersTable.deleteTeacher(transferData);

    res.status(200).render('teachers', {
      session: req.session,
      users: await usersTable.selectTeachers(),
      info: 'Deleted successfully',
      error: null,
      infoCreate: null,
      errorCreate: null,
    });
  } catch (err) {
    res.status(500).render('error', { error: err });
  }
};

export const getPage = async (req, res) => {
  try {
    const teachersInDB = await usersTable.selectTeachers();
    res.status(200).render('teachers', {
      session: req.session,
      users: teachersInDB,
      info: null,
      error: null,
      infoCreate: null,
      errorCreate: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err, session: req.session });
  }
};
