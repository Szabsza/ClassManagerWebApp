import express from 'express';
import { createTeacher, deleteTeacher, getPage } from '../controllers/teachers.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', authorize(['admin']), getPage);
router.post('/create/', authorize(['admin']), createTeacher);
router.post('/delete/', authorize(['admin']), deleteTeacher);

export default router;
