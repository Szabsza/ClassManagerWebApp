import * as schedulesTable from '../db/entitys/schedules.js';
import * as teacherRequestsTable from '../db/entitys/teacherRequests.js';
import * as usersTable from '../db/entitys/users.js';
import { validateData } from '../validators/scheduleValidator.js';
import { validateRequest } from '../validators/teacherRequestValidator.js';

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

export const newSchedule = async (req, res) => {
  const transferData = {
    start: req.body.Start,
    end: req.body.End,
    day: req.body.Day,
    subjectID: req.body.SubjectID,
    classType: req.body.ClassType,
  };

  try {
    const { code, err } = await validateData(transferData);
    if (code === '1') {
      res.status(400).render('schedules', {
        session: req.session,
        subjectName: req.body.SubjectName,
        subjectID: req.body.SubjectID,
        errorCreate: err,
        infoCreate: null,
        errorRequest: null,
        infoRequest: null,
        schedules: await schedulesTable.selectSchedules(req.body.SubjectID),
        requests: await teacherRequestsTable.selectTeacherRequests(req.body.SubjectID),
        teachers: await teachersPartOfThisSubject(req.body.SubjectID),
      });
      return;
    }

    await schedulesTable.insertIntoSchedules(transferData);

    res.status(200).render('schedules', {
      session: req.session,
      subjectName: req.body.SubjectName,
      subjectID: req.body.SubjectID,
      errorCreate: null,
      infoCreate: 'Schedule succesfully created!',
      errorRequest: null,
      infoRequest: null,
      schedules: await schedulesTable.selectSchedules(req.body.SubjectID),
      requests: await teacherRequestsTable.selectTeacherRequests(req.body.SubjectID),
      teachers: await teachersPartOfThisSubject(req.body.SubjectID),
    });
  } catch (err) {
    res.status(500).render('error', { error: err, session: req.session });
  }
};

export const newTeacherRequest = async (req, res) => {
  const transferData = {
    start: req.body.StartRequest,
    end: req.body.EndRequest,
    day: req.body.DayRequest,
    subjectID: req.body.SubjectIDRequest,
    userName: req.session.username,
    classType: req.body.ClassTypeRequest,
    request: req.body.Request,
    session: req.session,
  };

  try {
    const { code, err } = await validateRequest(transferData);
    if (code === '1') {
      res.status(400).render('schedules', {
        session: req.session,
        subjectName: req.body.SubjectNameRequest,
        subjectID: req.body.SubjectIDRequest,
        errorCreate: null,
        infoCreate: null,
        errorRequest: err,
        infoRequest: null,
        schedules: await schedulesTable.selectSchedules(req.body.SubjectIDRequest),
        requests: await teacherRequestsTable.selectTeacherRequests(req.body.SubjectIDRequest),
        teachers: await teachersPartOfThisSubject(req.body.SubjectIDRequest),
      });
      return;
    }

    await teacherRequestsTable.insertIntoTeacherRequests(transferData);

    res.status(200).render('schedules', {
      session: req.session,
      subjectName: req.body.SubjectNameRequest,
      subjectID: req.body.SubjectIDRequest,
      errorCreate: null,
      infoCreate: null,
      errorRequest: null,
      infoRequest: 'Request succesfully sent!',
      schedules: await schedulesTable.selectSchedules(req.body.SubjectIDRequest),
      requests: await teacherRequestsTable.selectTeacherRequests(req.body.SubjectIDRequest),
      teachers: await teachersPartOfThisSubject(req.body.SubjectIDRequest),
    });
  } catch (err) {
    res.status(500).render('error', { error: err, session: req.session });
  }
};

export const getPage = async (req, res) => {
  try {
    console.log(req.session);
    const schedules = await schedulesTable.selectSchedules(req.query.SneakySubjectID);
    const requests = await teacherRequestsTable.selectTeacherRequests(req.query.SneakySubjectID);
    res.status(200).render('schedules', {
      session: req.session,
      subjectName: req.query.SneakySubjectName,
      subjectID: req.query.SneakySubjectID,
      errorCreate: null,
      infoCreate: null,
      errorRequest: null,
      infoRequest: null,
      schedules,
      requests,
      teachers: await teachersPartOfThisSubject(req.query.SneakySubjectID),
    });
  } catch (err) {
    res.status(500).render('error', { error: err, session: req.session });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const scheduleInDB = await schedulesTable.selectSchedulesByID(req.params.timeID);

    const isScheduleInDB = Boolean(scheduleInDB.length);

    if (!isScheduleInDB) {
      res.status(500).json({ error: 'This schedule not exists!' });
      return;
    }

    await schedulesTable.deleteScheduleByID(req.params.timeID);
    res.status(204).json({});
  } catch (err) {
    res.status(500).json({ error: err, session: req.session });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    console.log(req.params.requestID);
    const requestsInDB = await teacherRequestsTable.selectTeacherRequestsByID(req.params.requestID);

    const isRequestInDB = Boolean(requestsInDB.length);

    if (!isRequestInDB) {
      res.status(500).json({ error: 'This request not exists!' });
      return;
    }

    await teacherRequestsTable.deleteTeacherRequestByID(req.params.requestID);
    res.status(204).json({});
  } catch (err) {
    res.status(500).json({ error: err, session: req.session });
  }
};
