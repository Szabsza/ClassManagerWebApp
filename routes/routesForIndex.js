import express from 'express';
import { getPage, getMore } from '../controllers/index.js';

const router = express.Router();

router.get(['/', '/index'], getPage);
router.get(['/more/:id', '/index/more/:id'], getMore);

export default router;
