import * as subjectsTable from '../db/entitys/subjects.js';

export const logout = async (req, res) => {
  try {
    req.session.destroy();
    const subjectsInDB = await subjectsTable.getSubjectFields();
    res.status(200).render('index', { session: req.session, subjects: subjectsInDB });
  } catch (err) {
    res.status(500).render('error', { error: err, session: req.session });
  }
};
