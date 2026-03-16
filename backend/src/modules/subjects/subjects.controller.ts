import { Request, Response, NextFunction } from 'express';
import * as SubjectsService from './subjects.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getSubjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subjects = await SubjectsService.getAllSubjects();
    res.json(subjects);
  } catch (error) {
    next(error);
  }
};

export const getSubjectDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subject = await SubjectsService.getSubjectById(req.params.subjectId as string);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (error) {
    next(error);
  }
};

export const getSubjectTree = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const tree = await SubjectsService.getSubjectTreeWithProgress(req.params.subjectId as string, userId);
    res.json(tree);
  } catch (error) {
    next(error);
  }
};

export const getFirstVideo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const video = await SubjectsService.getFirstVideoOfSubject(req.params.subjectId as string);
    if (!video) return res.status(404).json({ error: 'No videos found in this subject' });
    res.json(video);
  } catch (error) {
    next(error);
  }
};
