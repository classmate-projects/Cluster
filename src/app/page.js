'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProjectCard from '@/components/ProjectCard';
import ConfigureModal from '@/components/ConfigureModal';

export default function Home() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchProjects();
  }, [fetchProjects]);

  const handleConfigure = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (updatedProject) => {
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
      console.error('Failed to save project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: projectId }),
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const openAddProjectModal = () => {
    setSelectedProject({
      id: `project-${Date.now()}`,
      title: '',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop',
      tags: [],
      version: '1.0.0',
      url: 'https://',
      configurable: true,
      visible: true,
      isNew: true
    });
    setIsModalOpen(true);
  };

  if (!isMounted) return null;

  const filteredProjects = isAdmin 
    ? projects 
    : projects.filter(p => p.visible !== false);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      {/* Floating Action Button for Admin */}
      {isAdmin && (
        <button 
          onClick={openAddProjectModal}
          className="fixed bottom-8 right-8 z-[60] w-16 h-16 premium-gradient text-white rounded-full shadow-2xl shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        >
          <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass-card border-none rounded-none py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-xl premium-gradient shadow-lg group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-black tracking-tighter uppercase group-hover:text-blue-600 transition-colors">ClassMates</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Projects</a>
            {isAdmin && (
              <button 
                onClick={openAddProjectModal}
                className="hover:text-blue-600 transition-colors text-blue-600 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Add Project
              </button>
            )}
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
            
            {user ? (
              <div className="flex items-center gap-6 pl-6 border-l border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col items-end">
                  <span className="text-zinc-900 dark:text-zinc-100">{user.username}</span>
                  <span className="text-[8px] text-blue-600">{user.role}</span>
                </div>
                <button 
                  onClick={logout}
                  className="px-5 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-black uppercase tracking-widest text-[9px]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 hover:scale-105 transition-all shadow-lg active:scale-95"
              >
                Sign In
              </button>
            )}
          </nav>

          {/* Mobile Login Icon */}
          {!user && (
            <button 
              onClick={() => router.push('/login')}
              className="md:hidden w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 relative">
        {/* Hero Section */}
        <div className="max-w-4xl mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-200 dark:border-blue-800">
            {isAdmin ? '🛡️ Admin Dashboard' : '🌐 Project Showcase'}
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            {isAdmin ? 'Manage your' : 'Building the'} <br />
            <span className="text-gradient">{isAdmin ? 'Ecosystem.' : 'Unknown.'}</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl font-medium">
            {isAdmin 
              ? 'Control every aspect of your project deployment and metadata from one central dashboard.' 
              : 'A curated showcase of high-performance applications and tools that push the boundaries of modern web development.'}
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-[400px] bg-zinc-100 dark:bg-zinc-900 rounded-3xl animate-pulse border border-zinc-200 dark:border-zinc-800" />
            ))
          ) : (
            <>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={`${project.id}-${isAdmin}`}
                  project={project}
                  isAdmin={isAdmin}
                  onConfigure={handleConfigure}
                />
              ))}
              
              {/* Add Project Placeholder */}
              {isAdmin && (
                <button 
                  onClick={openAddProjectModal}
                  className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl transition-all hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 min-h-[380px] animate-in zoom-in duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all text-zinc-400 shadow-inner">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-xs font-black text-zinc-500 group-hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">
                    Add Project
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </main>

      <ConfigureModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-16 px-6 md:px-12 mt-32 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg premium-gradient shadow-md" />
            <span className="text-lg font-black tracking-tighter uppercase text-zinc-900 dark:text-zinc-100">ClassMates</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Twitter (X)</a>
            <a href="#" className="hover:text-blue-600 transition-colors">GitHub</a>
          </div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            &copy; 2026 ClassMates. All Space Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

