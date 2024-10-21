import express from 'express';
import { getPage, login } from '../controllers/login.js';

const router = express.Router();

router.get('/', getPage);
router.post('/', login);

export default router;
