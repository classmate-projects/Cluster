'use client';

import Image from 'next/image';

export default function ProjectCard({ project, isAdmin, onConfigure }) {
  const { title, description, thumbnail, tags, version, url } = project;

  return (
    <div className="group relative glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-500/50">
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
        
        {/* Version Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/20">
          v{version}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-6">
          {description}
        </p>

        {/* Action Buttons (Admin Only) */}
        {isAdmin ? (
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfigure(project);
              }}
              className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Configure
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 px-4 py-2 premium-gradient text-white text-sm font-semibold rounded-xl text-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
            >
              Access
            </a>
          </div>
        ) : (
          <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Learn more & Purchase</span>
            <svg
              className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>

      {/* Clickable Overlay for Public User */}
      {!isAdmin && (
        <a
          href={`/projects/${project.id}`}
          className="absolute inset-0 z-10"
          aria-label={`View details for ${title}`}
        />
      )}
    </div>
  );
}
