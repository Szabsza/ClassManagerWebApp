import fs from 'fs';
import path from 'path';
import * as resourcesTable from '../db/entitys/resources.js';
import * as usersTable from '../db/entitys/users.js';
import { validateData } from '../validators/resourceValidator.js';

async function teachersPartOfThisSubject(SubjectID) {
  const teachersPartOfThisSubjectInDB = await usersTable.selectTeachersPartOfSubjectBySubjectID(SubjectID);
  const isThereAny = Boolean(teachersPartOfThisSubjectInDB.length);

  if (!isThereAny) {
    return [];
  }

  const teachers = [];
  teachersPartOfThisSubjectInDB.forEach((teacher) => {
    teachers.push(teacher.UserName);
  });

  return teachers;
}

export const newResources = async (req, res) => {
  const dataForValidation = {
    SubjectID: parseInt(req.body.SubjectID, 10),
    UploadedFiles: req.files,
    Session: req.session,
  };

  try {
    const { code, err } = await validateData(dataForValidation);
    if (code === '1') {
      res.status(400).render('resource', {
        session: req.session,
        subjectID: req.body.SubjectID,
        subjectName: req.body.SubjectName,
        semester: req.body.Semester,
        courses: req.body.Courses,
        seminars: req.body.Seminars,
        labs: req.body.Labs,
        resources: await resourcesTable.selectResourcesBySubjectID(req.body.SubjectID),
        info: null,
        error: err,
        teachers: await teachersPartOfThisSubject(req.body.SubjectID),
      });
      return;
    }

    if (code === '2') {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
      res.status(400).render('resource', {
        session: req.session,
        subjectID: req.body.SubjectID,
        subjectName: req.body.SubjectName,
        semester: req.body.Semester,
        courses: req.body.Courses,
        seminars: req.body.Seminars,
        labs: req.body.Labs,
        resources: await resourcesTable.selectResourcesBySubjectID(req.body.SubjectID),
        info: null,
        error: err,
        teachers: await teachersPartOfThisSubject(req.body.SubjectID),
      });
      return;
    }

    await Promise.all(
      req.files.map(async (file) => {
        const transferData = {
          SubjectID: parseInt(req.body.SubjectID, 10),
          ResourceName: file.filename,
          OriginalName: file.originalname,
          UserName: req.session.username,
        };
        await resourcesTable.insertNewResources(transferData);
      }),
    );

    res.status(200).render('resource', {
      session: req.session,
      subjectID: req.body.SubjectID,
      subjectName: req.body.SubjectName,
      semester: req.body.Semester,
      courses: req.body.Courses,
      seminars: req.body.Seminars,
      labs: req.body.Labs,
      resources: await resourcesTable.selectResourcesBySubjectID(req.body.SubjectID),
      info: 'Upload was succesfull!',
      error: null,
      teachers: await teachersPartOfThisSubject(req.body.SubjectID),
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err, session: req.session });
  }
};

export const getPage = async (req, res) => {
  try {
    res.status(200).render('resource', {
      session: req.session,
      subjectID: req.query.SneakySubjectID,
      subjectName: req.query.SneakySubjectName,
      semester: req.query.SneakySemester,
      courses: req.query.SneakyCourses,
      seminars: req.query.SneakySeminars,
      labs: req.query.SneakyLabs,
      resources: await resourcesTable.selectResourcesBySubjectID(req.query.SneakySubjectID),
      info: null,
      error: null,
      teachers: await teachersPartOfThisSubject(req.query.SneakySubjectID),
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err, session: req.session });
  }
};

export const getDownload = (req, res) => {
  try {
    res.download(path.join(process.cwd(), `files/${req.query.ResourceName}`));
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err, session: req.session });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const resourcesInDB = await resourcesTable.selectResourcesByResourceNameAndUserName(
      req.params.resourceName,
      req.params.userName,
    );

    const isResourceInDB = Boolean(resourcesInDB.length);

    if (!isResourceInDB) {
      res.status(500).json({ error: 'You have no right deleting this file!' });
      return;
    }

    await resourcesTable.deleteResources(req.params.resourceName, req.params.userName);
    fs.unlinkSync(path.join(process.cwd(), `/files/${req.params.resourceName}`));
    res.status(204).json({});
  } catch (err) {
    res.status(500).json({ error: err, session: req.session });
  }
};
