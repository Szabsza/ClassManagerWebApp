import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import morgan from 'morgan';
import routesForIndex from './routes/routesForIndex.js';
import routesForNewSubject from './routes/routesForSubject.js';
import routesForNewApplication from './routes/routesForApplication.js';
import routesForSyllabus from './routes/routesForSyllabus.js';
import routesForSchedules from './routes/routesForSchedules.js';
import routesForNewResources from './routes/routesForResources.js';
import routesForTeachers from './routes/routesForTeachers.js';
import routesForLogin from './routes/routesForLogin.js';
import routesForLogout from './routes/routesForLogout.js';
import { initDB } from './db/configureDB.js';

const app = express();
const port = 8080;

const uploadDir = path.join(process.cwd(), 'files');
const staticDir = path.join(process.cwd(), 'public');
const viewsDir = path.join(process.cwd(), 'views');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(
  session({
    secret: '142e6ecf42884f03',
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(express.static(staticDir));

app.set('view engine', 'ejs');
app.set('views', viewsDir);

app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: uploadDir }).array('Files'));

app.use('/', routesForIndex);
app.use('/subject', routesForNewSubject);
app.use('/application', routesForNewApplication);
app.use('/teachers', routesForTeachers);
app.use('/syllabus', routesForSyllabus);
app.use('/schedules', routesForSchedules);
app.use('/resources', routesForNewResources);
app.use('/login', routesForLogin);
app.use('/logout', routesForLogout);

initDB().then(() => {
  app.listen(port, () => {
    console.log('Server is listening on http://localhost:8080/...');
  });
});
