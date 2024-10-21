import express from 'express';
import { getPage, newSchedule, newTeacherRequest, deleteSchedule, deleteRequest } from '../controllers/schedules.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', getPage);
router.post('/', authorize(['admin']), newSchedule);

router.post('/request', authorize(['admin', 'teacher']), newTeacherRequest);

router.delete('/:timeID', authorize(['admin']), deleteSchedule);
router.delete('/request/:requestID', authorize(['admin']), deleteRequest);

export default router;
