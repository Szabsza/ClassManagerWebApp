import * as schedulesTable from '../db/entitys/schedules.js';

export const validateData = async (transferData) => {
  const { start, end, day, subjectID, classType } = transferData;

  if (start === '') {
    return { code: '1', err: 'Start field cannot be empty!' };
  }

  if (end === '') {
    return { code: '1', err: 'End field cannot be empty!' };
  }

  if (day === '') {
    return { code: '1', err: 'Day field cannot be empty!' };
  }

  if (classType === '') {
    return { code: '1', err: 'Class Type field cannot be empty!' };
  }

  if (subjectID === '') {
    return { code: '1', err: 'SubjectID cannot be empty!' };
  }

  const isThereScheduleCollision = Boolean(
    (await schedulesTable.selectSchedulesCollison(subjectID, start, end, day)).length,
  );

  if (isThereScheduleCollision) {
    return { code: '1', err: 'Schedule collison!' };
  }

  return { code: '0', err: null };
};
