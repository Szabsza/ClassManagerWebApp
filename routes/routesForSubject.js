import express from 'express';
import { newSubject, getPage } from '../controllers/subjects.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', authorize(['admin']), getPage);
router.post('/', authorize(['admin']), newSubject);

export default router;
