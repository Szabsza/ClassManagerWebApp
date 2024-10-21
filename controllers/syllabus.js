export const getPage = (req, res) => {
  try {
    res.status(200).render('syllabus', { session: req.session, subjectName: req.query.SneakySubjectName });
  } catch (err) {
    res.status(500).render('error', { error: err, session: req.session });
  }
};
