import express from 'express';
import { logout } from '../controllers/logout.js';

const router = express.Router();

// jogosultsag?
router.post('/', logout);

export default router;
