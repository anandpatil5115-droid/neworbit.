import { supabase } from '../../config/supabase';

export const getVideoWithContext = async (videoId: string, userId: string) => {
  // 1. Get video
  const { data: video, error } = await supabase
    .from('videos')
    .select('*, sections(subject_id)')
    .eq('id', videoId)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  if (!video) return null;

  const subjectId = video.sections.subject_id;

  // 2. Fetch all videos for this subject to determine prev/next/locked state
  const { data: sections, error: secErr } = await supabase
    .from('sections')
    .select('id, order_index, videos(id, title, order_index)')
    .eq('subject_id', subjectId)
    .order('order_index', { ascending: true });

  if (secErr) throw new Error(secErr.message);

  let flatVideos: any[] = [];
  sections?.forEach((s: any) => {
    if (s.videos) {
      const sorted = [...s.videos].sort((a, b) => a.order_index - b.order_index);
      flatVideos = flatVideos.concat(sorted);
    }
  });

  const currentIndex = flatVideos.findIndex((v: any) => v.id === videoId);
  const previousVideo = currentIndex > 0 ? flatVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex < flatVideos.length - 1 ? flatVideos[currentIndex + 1] : null;

  // 3. Determine if current is locked
  let locked = false;
  
  if (previousVideo) {
    // Need to check if previous video is completed by this user
    const { data: prevProg, error: progErr } = await supabase
      .from('video_progress')
      .select('is_completed')
      .eq('user_id', userId)
      .eq('video_id', previousVideo.id)
      .single();

    if (progErr && progErr.code !== 'PGRST116') throw new Error(progErr.message);
    
    if (!prevProg || !prevProg.is_completed) {
      locked = true;
    }
  }

  return {
    ...video,
    previous_video: previousVideo ? previousVideo.id : null,
    next_video: nextVideo ? nextVideo.id : null,
    locked
  };
};
