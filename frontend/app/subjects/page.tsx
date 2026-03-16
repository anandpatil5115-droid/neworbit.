'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { getUserInfo } from '@/lib/auth';
import { GlowingShadow } from '@/components/ui/glowing-shadow';
import { AnimatedBackground } from '@/components/ui/animated-background';

const subjectEmojis: Record<string, string> = {
  'java-programming':        '☕',
  'python-programming':      '🐍',
  'html-css':                '🎨',
  'javascript-essentials':   '⚡',
  'react-js':                '⚛️',
  'nodejs-express':          '🟢',
  'dsa':                     '🧩',
  'sql-database':            '🗄️',
  'git-github':              '🌿',
  'operating-systems':       '💻',
  'computer-networks':       '🌐',
  'typescript':              '📘',
  'nextjs':                  '▲',
  'mongodb':                 '🍃',
  'docker-devops':           '🐳',
  'system-design':           '🏗️',
  'c-programming':           '🔧',
  'machine-learning':        '🤖',
  'linux-cli':               '🐧',
  'rest-api-design':         '🔗',
};

const getEmoji = (title: string, slug?: string) => {
  if (slug && subjectEmojis[slug]) return subjectEmojis[slug];
  
  // fallback mapping if no slug match
  const t = title.toLowerCase();
  
  // match against keys by finding matching words
  for (const [key, emoji] of Object.entries(subjectEmojis)) {
    const keyParts = key.split('-');
    if (keyParts.some(part => part.length > 2 && t.includes(part))) {
      return emoji;
    }
  }

  return '📚';
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await api.get('/api/subjects');
        setSubjects(data);
        
        const pMap: Record<string, number> = {};
        for (const subject of data) {
          try {
            const p = await api.get(`/api/progress/subjects/${subject.id}`);
            pMap[subject.id] = p.data?.percentage || 0;
          } catch (e) {
            pMap[subject.id] = 0;
          }
        }
        setProgressMap(pMap);
      } catch (err) {
        console.error('Failed to load subjects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const user = getUserInfo();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#0a0a0f]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
          <div className="text-indigo-400 font-medium animate-pulse text-sm">Loading curriculum...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-8 text-white relative"
      style={{
        background: 'radial-gradient(ellipse at 50% -20%, rgba(99,102,241,0.12), transparent 60%)'
      }}
    >
      <AnimatedBackground />
      <div className="relative z-10 w-full h-full">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.6s ease-out forwards;
            opacity: 0;
          }
        `}} />

        <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12 flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-400 mb-2">
            Available Subjects
          </h1>
          <p className="text-slate-400 mb-10">
            Explore our courses and start learning today.
          </p>
          
          <div className="absolute top-0 right-0">
            <Link href="/profile" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-indigo-500/50">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {user ? user.name : 'Profile'}
            </Link>
          </div>
        </header>

        {subjects.length === 0 ? (
          <div className="text-slate-500 text-center py-12">No subjects available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => {
              const animSpeeds = ['4s', '5s', '6s'];
              const speed = animSpeeds[index % 3];
              const progress = progressMap[subject.id] || 0;
              const isEnrolled = progress > 0;
              
              const sectionsCount = subject.sections_count || subject.sections?.length || '6';

              return (
                <div 
                  key={subject.id} 
                  className="animate-fade-up h-full"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <Link href={`/subjects/${subject.id}`} className="block h-full">
                    <GlowingShadow animationSpeed={speed}>
                      <div className="flex flex-col h-full justify-between">
                        {/* Top Section */}
                        <div className="mb-6">
                          <div className="text-4xl mb-4">
                            {getEmoji(subject.title, subject.slug || subject.title.toLowerCase().replace(/\s+/g, '-'))}
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                            {subject.title}
                          </h2>
                          <p className="text-slate-400 text-sm line-clamp-2">
                            {subject.description || 'Learn and master the fundamentals with our comprehensive curriculum.'}
                          </p>
                        </div>
                        
                        {/* Bottom Section */}
                        <div className="flex items-center justify-between mt-auto">
                          {/* Left: pill badge */}
                          <span className="bg-white/10 text-white/70 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                            {sectionsCount} sections
                          </span>
                          
                          {/* Right: progress / action */}
                          <div className="flex items-center gap-2">
                            {isEnrolled ? (
                              <>
                                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full whitespace-nowrap hidden sm:inline-block">
                                  {progress}%
                                </span>
                                <span className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-1.5 rounded-full transition whitespace-nowrap shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                                  Continue
                                </span>
                              </>
                            ) : (
                              <span className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-1.5 rounded-full transition whitespace-nowrap shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                                Enroll
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlowingShadow>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
