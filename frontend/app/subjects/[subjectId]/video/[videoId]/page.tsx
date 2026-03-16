'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import YouTube, { YouTubeProps } from 'react-youtube';
import { api } from '@/lib/api';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

export default function VideoPage() {
  const { subjectId, videoId } = useParams();
  const router = useRouter();
  
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  const [initialPosition, setInitialPosition] = useState(0);
  
  // Custom progress bar state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const uiIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchVideoAndProgress = async () => {
      try {
        const [vidRes, progRes] = await Promise.all([
          api.get(`/api/videos/${videoId}`),
          api.get(`/api/progress/videos/${videoId}`)
        ]);
        
        const vidData = vidRes.data;
        if (vidData.locked) {
          alert('This video is locked. Complete the previous video first.');
          router.push(`/subjects/${subjectId}`);
          return;
        }

        setVideo(vidData);
        if (progRes.data?.last_position_seconds) {
          setInitialPosition(progRes.data.last_position_seconds);
          setCurrentTime(progRes.data.last_position_seconds);
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          alert('Video is locked.');
          router.push(`/subjects/${subjectId}`);
        } else {
          console.error('Failed to load video', err);
        }
      } finally {
        setLoading(false);
      }
    };
    if (videoId) fetchVideoAndProgress();

    return () => clearIntervals();
  }, [videoId, subjectId, router]);

  const clearIntervals = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (uiIntervalRef.current) clearInterval(uiIntervalRef.current);
    intervalRef.current = null;
    uiIntervalRef.current = null;
  };

  const saveProgress = async (isCompleted = false) => {
    if (!player) return;
    try {
      const cTime = await player.getCurrentTime();
      await api.post(`/api/progress/videos/${videoId}`, {
        last_position_seconds: Math.floor(cTime),
        is_completed: isCompleted,
      });

      if (isCompleted && video?.next_video) {
        const userWantsNext = window.confirm('Video completed! Proceed to next video?');
        if (userWantsNext) {
          window.location.href = `/subjects/${subjectId}/video/${video.next_video}`;
        }
      }
    } catch (error) {
      console.error('Failed to save progress', error);
    }
  };

  const updateUIProgress = async () => {
    if (!player) return;
    try {
      const cTime = await player.getCurrentTime();
      const dur = await player.getDuration();
      setCurrentTime(cTime);
      setDuration(dur);
    } catch (e) {}
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
    if (initialPosition > 0) {
      event.target.seekTo(initialPosition);
    }
  };

  const onPlay: YouTubeProps['onPlay'] = (event) => {
    clearIntervals();
    intervalRef.current = setInterval(() => saveProgress(false), 10000);
    uiIntervalRef.current = setInterval(() => updateUIProgress(), 1000); // 1s UI updates
  };

  const onPause: YouTubeProps['onPause'] = (event) => {
    clearIntervals();
    saveProgress(false); 
    updateUIProgress();
  };

  const onEnd: YouTubeProps['onEnd'] = async (event) => {
    clearIntervals();
    setCurrentTime(duration); // fill bar
    await saveProgress(true);
  };

  const extractYouTubeID = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4"></div>
        <div className="text-indigo-400 font-medium animate-pulse">Loading player...</div>
      </div>
    );
  }

  if (!video) return <div className="p-8 text-red-500">Video not found.</div>;

  const ytId = extractYouTubeID(video.youtube_url);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full h-full min-h-screen fade-in text-white">
      <AnimatedBackground />
      <div className="relative z-10 w-full h-full max-w-5xl mx-auto p-4 md:p-8">
        {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-violet-600/10 blur-[120px] rounded-full z-[-1] pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wide">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Now Playing
        </div>
      </div>

      {/* Video Container */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.2)] mb-4 border border-white/10 group">
        {ytId ? (
          <YouTube
            videoId={ytId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 0,
                rel: 0,
                modestbranding: 1
              }
            }}
            onReady={onReady}
            onPlay={onPlay}
            onPause={onPause}
            onEnd={onEnd}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">
            Invalid YouTube URL
          </div>
        )}
      </div>

      {/* Custom Progress Bar */}
      <div className="w-full bg-slate-800/60 rounded-full h-1.5 mb-8 relative border border-white/5 overflow-visible">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full relative transition-all duration-300 ease-linear"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Glowing Tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#818cf8,0_0_20px_#a5b4fc] transform translate-x-1/2"></div>
        </div>
      </div>

      {/* Title & Description */}
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gradient font-display drop-shadow-sm">
        {video.title}
      </h1>
      <p className="text-slate-400 mb-10 text-lg max-w-3xl leading-relaxed">
        {video.description}
      </p>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-white/10 pt-8">
        <button
          onClick={() => window.location.href = `/subjects/${subjectId}/video/${video.previous_video}`}
          disabled={!video.previous_video}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] text-white rounded-full transition-all duration-300 active:scale-95 group"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          <span className="font-medium">Previous Lesson</span>
        </button>

        <button
          onClick={() => window.location.href = `/subjects/${subjectId}/video/${video.next_video}`}
          disabled={!video.next_video || video.locked}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:grayscale disabled:hover:from-indigo-600 disabled:hover:to-violet-600 text-white rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] active:scale-95 group"
        >
          <span className="font-medium">Next Lesson</span>
          <ChevronRight className="w-5 h-5 text-indigo-200 group-hover:text-white transition-colors" />
        </button>
      </div>
      </div>
    </div>
  );
}
