'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { CheckCircle2, Lock, PlayCircle, Menu, ChevronDown, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const { subjectId, videoId } = useParams();
  const [tree, setTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const { data } = await api.get(`/api/subjects/${subjectId}/tree`);
        setTree(data);
        
        // Auto-expand all sections
        const exp: Record<string, boolean> = {};
        data.forEach((s: any) => exp[s.id] = true);
        setExpandedSections(exp);
      } catch (error) {
        console.error('Failed to fetch tree', error);
      } finally {
        setLoading(false);
      }
    };
    if (subjectId) fetchTree();
  }, [subjectId]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSection = (id: string) => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));

  if (loading) return null;

  // Calculate overall progress from tree
  let totalVideos = 0;
  let completedVideos = 0;
  tree.forEach(section => {
    totalVideos += section.videos.length;
    section.videos.forEach((v: any) => {
      if (v.is_completed) completedVideos++;
    });
  });
  const progressPercentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-indigo-500/20 backdrop-blur-md rounded-xl text-white border border-indigo-500/30"
        onClick={toggleSidebar}
      >
        <Menu className="w-5 h-5 text-indigo-400" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen 
        bg-[#0a0a14]/95 backdrop-blur-xl border-r border-white/10
        w-80 flex-shrink-0 flex flex-col z-40 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/5 relative bg-white/5">
          <Link href="/subjects" className="text-sm font-medium text-slate-400 hover:text-indigo-400 mb-4 inline-flex items-center gap-2 transition-colors">
            <span className="text-xl">&larr;</span> Back to Subjects
          </Link>
          <h2 className="text-xl font-bold text-slate-200 truncate font-display">Course Content</h2>
          
          {/* Mini Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              <span>Progress</span>
              <span className="text-indigo-400">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 relative" id="sidebar-scroll">
          {tree.map((section) => {
            const isExpanded = expandedSections[section.id];
            
            return (
              <div key={section.id} className="mb-2">
                <button 
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-white/5 transition-colors mb-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </button>
                
                <div className={`space-y-1 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {section.videos.map((video: any) => {
                    const isCurrent = video.id === videoId;
                    const isLocked = video.locked;
                    const isCompleted = video.is_completed;

                    let stateStyles = "border-l-2 border-transparent hover:bg-white/5 text-slate-300";
                    if (isCompleted) {
                      stateStyles = "border-l-2 border-green-500 bg-green-500/5 text-green-100";
                    } else if (isCurrent) {
                      stateStyles = "border-l-2 border-indigo-500 bg-indigo-500/10 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)] text-indigo-100";
                    } else if (isLocked) {
                      stateStyles = "border-l-2 border-transparent opacity-40 text-slate-400 cursor-not-allowed";
                    }

                    return (
                      <div
                        key={video.id}
                        onClick={() => {
                          if (isLocked) {
                            alert('Complete the previous lesson to unlock.');
                          } else {
                            router.push(`/subjects/${subjectId}/video/${video.id}`);
                            setIsOpen(false);
                          }
                        }}
                        className={`
                          w-full relative flex items-start p-2.5 ml-1 rounded-r-lg cursor-pointer transition-all duration-200
                          ${stateStyles} group
                        `}
                      >
                        {/* Hover slide indicator */}
                        {!isLocked && !isCurrent && (
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        )}

                        <div className="mt-0.5 mr-3 flex-shrink-0 relative z-10 text-slate-400">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4 text-slate-500" />
                          ) : (
                            <PlayCircle className={`w-4 h-4 ${isCurrent ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                          )}
                        </div>
                        <div className="relative z-10 w-full">
                          <div className={`text-sm font-medium leading-snug group-hover:translate-x-1 transition-transform ${isCurrent ? 'text-indigo-300' : ''}`}>
                            {video.title}
                          </div>
                          {video.duration_seconds && (
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              <span>{Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{__html: `
        #sidebar-scroll::-webkit-scrollbar { width: 4px; }
        #sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}} />
    </>
  );
}
