import { Response, NextFunction } from 'express';
import * as ProgressService from './progress.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getSubjectProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const progress = await ProgressService.calculateSubjectProgress(req.params.subjectId as string, userId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

export const getVideoProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const progress = await ProgressService.getVideoProgress(req.params.videoId as string, userId);
    res.json(progress); // might return null if not started
  } catch (error) {
    next(error);
  }
};

export const updateVideoProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { last_position_seconds, is_completed } = req.body;
    
    // Validate input types if necessary
    const position = Number(last_position_seconds) || 0;
    const completed = Boolean(is_completed);

    const progress = await ProgressService.upsertVideoProgress(req.params.videoId as string, userId, position, completed);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

