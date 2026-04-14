'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ConfigureModal from '@/components/ConfigureModal';

export default function AdminConfigurePage() {
  const { isAdmin, user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Protected route check
    if (!isAdmin) {
      // In a real app, we'd handle this more gracefully
      // router.push('/login');
    }
    fetchProjects();
  }, [isAdmin]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedProject) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  if (!isAdmin && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black mb-4">Access Denied</h1>
        <p className="text-zinc-500 mb-8 font-medium">You need administrator privileges to view this page.</p>
        <button 
          onClick={() => router.push('/login')}
          className="px-8 py-4 premium-gradient text-white rounded-2xl font-black uppercase tracking-widest text-xs"
        >
          Login as Admin
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Sidebar / Topbar */}
      <nav className="p-6 md:px-12 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black">
         <div className="flex items-center gap-6">
            <button onClick={() => router.push('/')} className="hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-black uppercase tracking-tighter">Admin <span className="text-blue-600">Console</span></h1>
         </div>
         <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-xs font-black uppercase tracking-widest">{user?.username}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest leading-none">Root Access</p>
            </div>
            <div className="w-10 h-10 rounded-full premium-gradient" />
         </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">Management</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Project <span className="dark:text-zinc-700">Repository</span></h2>
           </div>
           <button 
             onClick={() => {
                setSelectedProject({ id: `project-${Date.now()}`, title: '', description: '', thumbnail: '', tags: [], version: '1.0.0', url: '', configurable: true });
                setIsModalOpen(true);
             }}
             className="px-8 py-4 premium-gradient text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/30"
           >
             Add New Entry
           </button>
        </div>

        {/* Project List / Table */}
        <div className="glass-card rounded-[2rem] overflow-hidden border-zinc-100 dark:border-zinc-900">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                       <th className="px-8 py-6">Project Info</th>
                       <th className="px-8 py-6">Version</th>
                       <th className="px-8 py-6">Tags</th>
                       <th className="px-8 py-6">Status</th>
                       <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                    {projects.map((proj) => (
                       <tr key={proj.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <img src={proj.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                                <div>
                                   <p className="font-black text-sm uppercase tracking-tight">{proj.title}</p>
                                   <p className="text-xs text-zinc-500 line-clamp-1 max-w-[200px]">{proj.description}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-black text-zinc-600 dark:text-zinc-400">v{proj.version}</span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex flex-wrap gap-1">
                                {proj.tags.slice(0, 2).map(tag => (
                                   <span key={tag} className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">#{tag}</span>
                                ))}
                                {proj.tags.length > 2 && <span className="text-[9px] font-bold text-zinc-400">+{proj.tags.length - 2}</span>}
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleEdit(proj)}
                                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                >
                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                   </svg>
                                </button>
                                <a 
                                  href={proj.url} 
                                  target="_blank"
                                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-sm"
                                >
                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                   </svg>
                                </a>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Status Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-8 glass-card rounded-[2rem] border-zinc-100 dark:border-zinc-900">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Total Storage</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-4xl font-black">1.2<span className="text-sm text-zinc-400 ml-1 italic font-medium">GB</span></h3>
                 <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black font-bold uppercase tracking-widest whitespace-nowrap">Optimal</div>
              </div>
           </div>
           <div className="p-8 glass-card rounded-[2rem] border-zinc-100 dark:border-zinc-900">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">System Health</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-4xl font-black">98.4<span className="text-sm text-zinc-400 ml-1 italic font-medium">%</span></h3>
                 <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[10px] font-black font-bold uppercase tracking-widest whitespace-nowrap">Steady</div>
              </div>
           </div>
           <div className="p-8 premium-gradient rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-4">Account Tier</p>
              <div className="flex items-end justify-between">
                 <h3 className="text-4xl font-black">Enterprise</h3>
                 <div className="px-3 py-1 bg-white/20 text-white rounded-lg text-[10px] font-black font-bold uppercase tracking-widest whitespace-nowrap">ClassMates</div>
              </div>
           </div>
        </div>
      </main>

      <ConfigureModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
      />
    </div>
  );
}
