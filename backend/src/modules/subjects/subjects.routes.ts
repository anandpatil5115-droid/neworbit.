import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { getSubjects, getSubjectDetails, getSubjectTree, getFirstVideo } from './subjects.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getSubjects);
router.get('/:subjectId', getSubjectDetails);
router.get('/:subjectId/tree', getSubjectTree);
router.get('/:subjectId/first-video', getFirstVideo);

export default router;
