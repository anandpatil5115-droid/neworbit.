import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { getSubjectProgress, getVideoProgress, updateVideoProgress } from './progress.controller';

const router = Router();

router.use(authMiddleware);

router.get('/subjects/:subjectId', getSubjectProgress);
router.get('/videos/:videoId', getVideoProgress);
router.post('/videos/:videoId', updateVideoProgress);

export default router;
