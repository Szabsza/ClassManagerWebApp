import express from 'express';
import { newResources, getPage, getDownload, deleteFile } from '../controllers/resources.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.get('/', getPage);
router.post('/', authorize(['admin', 'teacher']), newResources);

router.get('/download/', getDownload);

router.delete('/delete/:resourceName/:userName', authorize(['admin', 'teacher']), deleteFile);

export default router;
