import { Response, NextFunction } from 'express';
import * as VideosService from './videos.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getVideoDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const video = await VideosService.getVideoWithContext(req.params.videoId as string, userId);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    
    res.json(video);
  } catch (error) {
    next(error);
  }
};
