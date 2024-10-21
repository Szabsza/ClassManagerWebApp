import * as subjectsTable from '../db/entitys/subjects.js';
import { validateData } from '../validators/subjectValidator.js';

export const newSubject = async (req, res) => {
  const transferData = {
    SubjectID: parseInt(req.body.SubjectID, 10),
    SubjectName: req.body.SubjectName,
    Semester: req.body.Semester,
    Courses: parseInt(req.body.Courses, 10),
    Seminars: parseInt(req.body.Seminars, 10),
    Labs: parseInt(req.body.Labs, 10),
  };

  try {
    const { code, err } = await validateData(transferData);
    if (code === '1') {
      res.status(400).render('subject', { session: req.session, error: err });
      return;
    }

    await subjectsTable.insertNewSubject(transferData);
    const subjectsInDB = await subjectsTable.getSubjectFields();
    res.status(200).render('index', { session: req.session, subjects: subjectsInDB });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err, session: req.session });
  }
};

export const getPage = (req, res) => {
  try {
    res.status(200).render('subject', { session: req.session, error: null });
  } catch (err) {
    res.status(500).render('error', { error: err, session: req.session });
  }
};
