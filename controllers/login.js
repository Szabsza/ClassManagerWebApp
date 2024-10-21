import * as subjectsTable from '../db/entitys/subjects.js';
import { validateData } from '../validators/loginValidator.js';

export const login = async (req, res) => {
  const transferData = {
    UserName: req.body.UserName,
    Password: req.body.Password,
    Role: req.body.Role,
  };

  try {
    const { code, err } = await validateData(transferData);
    if (code === '1') {
      res.status(400).render('login', { error: err });
      return;
    }

    req.session.username = transferData.UserName;
    req.session.role = transferData.Role;
    req.session.isloggedin = true;

    const subjectsInDB = await subjectsTable.getSubjectFields();
    res.status(200).render('index', { session: req.session, subjects: subjectsInDB });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
};

export const getPage = (req, res) => {
  try {
    res.status(200).render('login', { error: null });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
};
