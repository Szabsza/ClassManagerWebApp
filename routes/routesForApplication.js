import express from 'express';
import { newApplication, getPage } from '../controllers/application.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', authorize(['admin']), getPage);
router.post('/', authorize(['admin']), newApplication);

export default router;
