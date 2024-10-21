import * as subjectsTable from '../db/entitys/subjects.js';

export const getPage = async (req, res) => {
  try {
    const subjectsInDB = await subjectsTable.getSubjectFields();
    res.status(200).render('index', { session: req.session, subjects: subjectsInDB });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err, session: req.session });
  }
};

export const getMore = async (req, res) => {
  try {
    const coursesSeminarsLabs = await subjectsTable.selectCoursesSeminarsLabs(req.params.id);
    res.status(200).json(coursesSeminarsLabs);
  } catch (err) {
    res.status(500).json({ error: err, session: req.session });
  }
};
