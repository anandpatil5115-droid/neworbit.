'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AnimatedBackground } from '@/components/ui/animated-background';

export default function SubjectOverviewPage() {
  const { subjectId } = useParams();
  const router = useRouter();
  const [subject, setSubject] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [firstVideo, setFirstVideo] = useState<any>(null);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const [subRes, progRes, fvRes] = await Promise.all([
          api.get(`/api/subjects/${subjectId}`),
          api.get(`/api/progress/subjects/${subjectId}`),
          api.get(`/api/subjects/${subjectId}/first-video`)
        ]);
        setSubject(subRes.data);
        setProgress(progRes.data);
        setFirstVideo(fvRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (subjectId) fetchSubjectData();
  }, [subjectId]);

  if (!subject) {
    return <div className="p-8 text-gray-500">Loading overview...</div>;
  }

  const isEnrolled = progress && progress.percentage > 0;

  const handleStart = () => {
    if (firstVideo) {
      router.push(`/subjects/${subjectId}/video/${firstVideo.id}`);
    } else {
      alert('No videos available yet.');
    }
  };

  return (
    <div className="relative w-full min-h-screen text-white">
      <AnimatedBackground />
      <div className="relative z-10 w-full h-full max-w-4xl mx-auto p-8 lg:p-12">
        <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{subject.title}</h1>
        <p className="text-lg text-gray-400">{subject.description}</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
        <h2 className="text-xl font-bold mb-4">Your Progress</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            {progress?.completed_videos || 0} / {progress?.total_videos || 0} lessons completed
          </span>
          <span className="text-sm font-bold text-blue-500">
            {progress?.percentage || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5 mb-8">
          <div 
            className="bg-blue-500 h-2.5 rounded-full" 
            style={{ width: `${progress?.percentage || 0}%` }}
          ></div>
        </div>

        <button 
          onClick={handleStart}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          {isEnrolled ? 'Continue Learning' : 'Enroll & Start Learning'}
        </button>
      </div>
      
      <div className="text-sm text-gray-500">
        Click a lesson from the sidebar to jump right in.
      </div>
      </div>
    </div>
  );
}
