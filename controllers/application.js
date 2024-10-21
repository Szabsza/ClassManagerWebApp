import * as subjectsTable from '../db/entitys/subjects.js';
import * as usersTable from '../db/entitys/users.js';
import * as appliesTable from '../db/entitys/applies.js';
import { validateData } from '../validators/applicationValidator.js';

export const newApplication = async (req, res) => {
  const transferData = {
    StudentID: parseInt(req.body.Users, 10),
    SubjectID: parseInt(req.body.SubjectID, 10),
    Action: req.body.Action,
  };

  try {
    const teachersInDB = await usersTable.selectTeachers();
    const subjectsInDB = await subjectsTable.getSubjectFields();

    const { code, err } = await validateData(transferData);
    if (code === '1') {
      res.status(400).render('application', {
        session: req.session,
        subjects: subjectsInDB,
        users: teachersInDB,
        info: null,
        error: err,
      });
      return;
    }

    await appliesTable.insertNewApplicant(transferData);
    res.status(200).render('application', {
      session: req.session,
      subjects: subjectsInDB,
      users: teachersInDB,
      info: 'Action was Succesfull',
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err, session: req.session });
  }
};

export const getPage = async (req, res) => {
  try {
    const subjectsInDB = await subjectsTable.getSubjectFields();
    const teachersInDB = await usersTable.selectTeachers();
    res.status(200).render('application', {
      session: req.session,
      subjects: subjectsInDB,
      users: teachersInDB,
      info: null,
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err, session: req.session });
  }
};
