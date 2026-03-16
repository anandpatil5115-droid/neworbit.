import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { getVideoDetails } from './videos.controller';

const router = Router();

router.use(authMiddleware);

router.get('/:videoId', getVideoDetails);

export default router;
