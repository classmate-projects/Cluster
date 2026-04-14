'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch('/api/projects');
      const data = await res.json();
      const p = data.find((proj) => proj.id === id);
      setProject(p);
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black mb-4">Project Not Found</h1>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-3 premium-gradient text-white rounded-xl font-bold"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      {/* Navbar */}
      <nav className="p-6 md:px-12 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900">
        <button 
          onClick={() => router.push('/')}
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded premium-gradient" />
            <span className="text-sm font-black tracking-tighter uppercase">ClassMates</span>
          </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visuals */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
            <img 
              src={project.thumbnail} 
              alt={project.title}
              className="relative w-full aspect-video object-cover rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {tag}
                </span>
              ))}
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                v{project.version}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              {project.title}
            </h1>
            
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button disabled className="flex-1 px-8 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity shadow-xl cursor-not-allowed">
                Purchase License (Coming Soon)
              </button>
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 px-8 py-5 border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 text-center rounded-2xl font-black uppercase tracking-widest text-sm transition-all"
              >
                Launch Demo
              </a>
            </div>

            <p className="mt-8 text-xs font-bold text-zinc-400 uppercase tracking-widest italic">
              * This is a placeholder for future project details and purchase flow.
            </p>
          </div>
        </div>

        {/* Feature Grid Placeholder */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Scalable Architecture', desc: 'Built with the latest technologies to handle millions of requests.' },
            { title: 'Modern UI/UX', desc: 'A seamless experience that your users will love at first sight.' },
            { title: 'Secure & Reliable', desc: 'Top-tier security protocols integrated from the ground up.' }
          ].map((feature, i) => (
            <div key={i} className="space-y-4">
              <div className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
