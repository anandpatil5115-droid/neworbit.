import { supabase } from '../../config/supabase';

export const upsertVideoProgress = async (
  videoId: string,
  userId: string,
  lastPositionSeconds: number,
  isCompleted: boolean
) => {
  // First, check if the student is enrolled in the subject of this video.
  const { data: video, error: vidErr } = await supabase
    .from('videos')
    .select('sections(subject_id)')
    .eq('id', videoId)
    .single();

  if (vidErr) throw new Error(vidErr.message);
  
  // Need to cast to any since Supabase returns nested joins as arrays or objects depending on cardinality
  // but TypeScript thinks it's an array if it matches the generated types improperly.
  const subjectId = (video as any).sections.subject_id;

  // Auto-enroll user if not enrolled
  const { error: enrollErr } = await supabase
    .from('enrollments')
    .upsert({ user_id: userId, subject_id: subjectId }, { onConflict: 'user_id,subject_id' });
    
  if (enrollErr) throw new Error(enrollErr.message);

  const completedAt = isCompleted ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from('video_progress')
    .upsert(
      {
        user_id: userId,
        video_id: videoId,
        last_position_seconds: lastPositionSeconds,
        is_completed: isCompleted,
        completed_at: completedAt,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,video_id' }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const getVideoProgress = async (videoId: string, userId: string) => {
  const { data, error } = await supabase
    .from('video_progress')
    .select('*')
    .eq('video_id', videoId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data || null;
};

export const calculateSubjectProgress = async (subjectId: string, userId: string) => {
  // Get all videos for the subject
  const { data: sections, error: secErr } = await supabase
    .from('sections')
    .select('videos(id)')
    .eq('subject_id', subjectId);

  if (secErr) throw new Error(secErr.message);

  let totalVideos = 0;
  sections?.forEach((s: any) => {
    if (s.videos) totalVideos += s.videos.length;
  });

  if (totalVideos === 0) return { percentage: 0, completed_videos: 0, total_videos: 0 };

  // Get completed videos for this user
  const { data: progress, error: progErr } = await supabase
    .from('video_progress')
    .select('video_id, is_completed')
    .eq('user_id', userId)
    .eq('is_completed', true);

  if (progErr) throw new Error(progErr.message);

  // Filter progress to only include videos in this subject
  let completedCount = 0;
  
  const videoIdsInSubject = new Set<string>();
  sections?.forEach((s: any) => s.videos?.forEach((v: any) => videoIdsInSubject.add(v.id)));

  progress?.forEach(p => {
    if (videoIdsInSubject.has(p.video_id)) {
      completedCount++;
    }
  });

  return {
    percentage: Math.round((completedCount / totalVideos) * 100),
    completed_videos: completedCount,
    total_videos: totalVideos
  };
};
