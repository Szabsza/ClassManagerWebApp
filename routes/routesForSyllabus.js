import express from 'express';
import { getPage } from '../controllers/syllabus.js';

const router = express.Router();

router.get('/', getPage);

export default router;
