import express from 'express';
import { createBundle, getBundles, getBundle, deleteBundle, previewBundle } from '../controllers/bundleController.js';
const router = express.Router();
router.post('/preview', previewBundle);
router.get('/',         getBundles);
router.post('/',        createBundle);
router.get('/:id',      getBundle);
router.delete('/:id',   deleteBundle);
export default router;
