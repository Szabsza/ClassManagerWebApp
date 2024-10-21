import { createTableSubjects, dropTableSubjects } from './entitys/subjects.js';
import { createTableUsers, dropTableUsers, createUser } from './entitys/users.js';
import { createTableResources, dropTableResourcres } from './entitys/resources.js';
import { createTableApplies, dropTableApplies } from './entitys/applies.js';
import { createTableSchedules, dropTableSchedules } from './entitys/schedules.js';
import { createTableTeacherRequests, dropTableTeacherRequests } from './entitys/teacherRequests.js';

export const initDB = async () => {
  try {
    await dropTableTeacherRequests();
    await dropTableSchedules();
    await dropTableApplies();
    await dropTableResourcres();
    await dropTableUsers();
    await dropTableSubjects();

    await createTableSubjects();
    await createTableUsers();
    await createTableResources();
    await createTableApplies();
    await createTableSchedules();
    await createTableTeacherRequests();

    await createUser('AdminJoska', 'admin', 'admin');
    await createUser('Gyula', 'teacher', 'teacher');
    await createUser('Kantor', 'teacher', 'teacher');
    await createUser('Mozes', 'teacher', 'teacher');
    await createUser('Pista', 'teacher', 'teacher');
    await createUser('Laura', 'teacher', 'teacher');

    console.log('Database configured succesfully!');
  } catch (err) {
    console.error(`Error with configuring database: ${err}`);
    process.exit(1);
  }
};
