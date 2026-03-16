'use client';

import { useEffect, useState } from 'react';
import { getUserInfo, logoutUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { BookOpen, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { AnimatedBackground } from '@/components/ui/animated-background';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setUser(getUserInfo());

      try {
        const { data: allSubjects } = await api.get('/api/subjects');
        const enrolled = [];
        for (const subject of allSubjects) {
          const { data: prog } = await api.get(`/api/progress/subjects/${subject.id}`);
          if (prog.percentage > 0 || prog.completed_videos > 0) {
            enrolled.push({ ...subject, progress: prog });
          }
        }
        setSubjects(enrolled);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-full fade-in text-white p-8">
        <AnimatedBackground />
        <div className="relative z-10 w-full h-full">
          <div className="max-w-4xl mx-auto relative z-10">
          <header className="flex justify-between items-center mb-12">
            <div className="h-4 w-32 rounded shimmer-loader"></div>
            <div className="h-8 w-24 rounded-lg shimmer-loader"></div>
          </header>

          <div className="glass-card rounded-2xl p-8 mb-12 flex items-center space-x-6 border-t-4 border-t-indigo-500">
            <div className="w-20 h-20 rounded-full shimmer-loader"></div>
            <div className="space-y-3">
              <div className="h-8 w-48 rounded shimmer-loader"></div>
              <div className="h-4 w-32 rounded shimmer-loader"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-slate-200">Your Enrolled Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="glass-card p-6 rounded-2xl h-48 shimmer-loader"></div>
            ))}
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full fade-in text-white p-8">
      <AnimatedBackground />
      <div className="relative z-10 w-full h-full">
        <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-12">
          <Link href="/subjects" className="text-sm font-medium text-slate-400 hover:text-indigo-400 inline-flex items-center gap-2 transition-colors">
            <span className="text-xl">&larr;</span> Back to Subjects
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 px-4 py-2 border border-red-500/20 hover:bg-red-500/10 rounded-xl transition-all shadow-sm active:scale-95 bg-white/5"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </header>

        <div className="glass-card rounded-2xl p-8 mb-12 flex items-center space-x-6 border-t-4 border-t-indigo-500 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)] relative z-10">
            <User className="w-10 h-10" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight text-gradient font-display">{user?.name || 'Student'}</h1>
            <p className="text-slate-400 mt-1 font-medium">{user?.email || 'student@example.com'}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-slate-200 font-display flex items-center gap-3">
          Your Enrolled Courses
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {subjects.length} Active
          </span>
        </h2>
        
        {subjects.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl text-slate-400">
            You haven't started any subjects yet.{' '}
            <Link href="/subjects" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Browse courses</Link>.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map(sub => (
              <div key={sub.id} className="group glass-card border-t-2 border-t-indigo-500/50 p-8 rounded-2xl hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all duration-300 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">{sub.title}</h3>
                  </div>
                </div>
                
                <div className="mb-8 mt-auto relative z-10">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Progress</span>
                    <span className="text-indigo-400">{sub.progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full relative" 
                      style={{ width: `${sub.progress.percentage}%` }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 blur-[1px]"></div>
                    </div>
                  </div>
                </div>

                <Link 
                  href={`/subjects/${sub.id}`}
                  className="w-full text-center px-4 py-3 bg-white/5 hover:bg-white/10 text-sm text-white font-medium rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20 active:scale-95 relative z-10"
                >
                  Continue Learning
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
