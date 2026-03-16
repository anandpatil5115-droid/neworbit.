import { supabase } from '../../config/supabase';

export const getAllSubjects = async () => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const getSubjectById = async (subjectId: string) => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', subjectId)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data;
};

export const getSubjectTreeWithProgress = async (subjectId: string, userId: string) => {
  // Fetch sections and their videos
  const { data: sections, error } = await supabase
    .from('sections')
    .select(`
      id, title, order_index,
      videos (
        id, title, order_index, youtube_url, duration_seconds
      )
    `)
    .eq('subject_id', subjectId)
    .order('order_index', { ascending: true });

  if (error) throw new Error(error.message);

  // Sort videos within sections
  sections.forEach((s: any) => {
    if (s.videos) s.videos.sort((a: any, b: any) => a.order_index - b.order_index);
  });

  // Fetch user progress for this subject's videos
  const { data: progress, error: progErr } = await supabase
    .from('video_progress')
    .select('video_id, is_completed, last_position_seconds')
    .eq('user_id', userId);

  if (progErr) throw new Error(progErr.message);

  // Map progress by video_id
  const progressMap = new Map();
  progress?.forEach(p => progressMap.set(p.video_id, p));

  // Determine locking state.
  // Rule: video is locked unless it's the very first video, or the immediately PREVIOUS video has is_completed = true.
  
  // Flatten videos to determine previous video easily
  let flattenedVideos: any[] = [];
  sections.forEach((s: any) => {
    if (s.videos) {
      flattenedVideos = flattenedVideos.concat(s.videos);
    }
  });

  let previousCompleted = true; // First video is always unlocked

  for (let i = 0; i < flattenedVideos.length; i++) {
    const v = flattenedVideos[i];
    const prog = progressMap.get(v.id);
    const isCompleted = prog?.is_completed || false;
    
    // It's locked if the PREVIOUS video wasn't completed, UNLESS it's the first video (i === 0)
    v.locked = (i === 0) ? false : !previousCompleted;
    v.is_completed = isCompleted;
    v.last_position_seconds = prog?.last_position_seconds || 0;

    // The state of this video determines the lock state of the NEXT video
    previousCompleted = isCompleted;
  }

  return sections;
};

export const getFirstVideoOfSubject = async (subjectId: string) => {
  const { data: sections, error } = await supabase
    .from('sections')
    .select('id, videos(id, order_index)')
    .eq('subject_id', subjectId)
    .order('order_index', { ascending: true })
    .limit(1);

  if (error) throw new Error(error.message);
  if (!sections || sections.length === 0) return null;

  const firstSection = sections[0];
  if (!firstSection.videos || firstSection.videos.length === 0) return null;

  // sort to find first video
  firstSection.videos.sort((a: any, b: any) => a.order_index - b.order_index);
  
  return await getVideoById(firstSection.videos[0].id);
};

export const getVideoById = async (videoId: string) => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data;
};
