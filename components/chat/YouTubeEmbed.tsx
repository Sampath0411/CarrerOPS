'use client';

import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

interface YouTubeEmbedProps {
  embedId?: string;
  title: string;
  description?: string;
  duration?: string;
  level?: string;
}

export function YouTubeEmbed({ embedId, title, description, duration, level }: YouTubeEmbedProps) {
  // Fallback if no embedId
  if (!embedId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-4"
      >
        <h4 className="text-white font-medium mb-1">{title}</h4>
        {description && <p className="text-slate-400 text-sm">{description}</p>}
      </motion.div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${embedId.split(',')[0]}/maxresdefault.jpg`;
  const playlistUrl = `https://www.youtube.com/playlist?list=${embedId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-red-500/50 transition-all"
    >
      {/* Thumbnail with Play Button */}
      <a
        href={playlistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video group cursor-pointer"
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to hqdefault if maxresdefault fails
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${embedId.split(',')[0]}/hqdefault.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        )}
      </a>

      {/* Info */}
      <div className="p-4">
        <h4 className="text-white font-medium mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
          {title}
        </h4>
        {description && (
          <p className="text-slate-400 text-sm mb-2 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {level && (
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                {level}
              </span>
            )}
          </div>
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Watch
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Grid of multiple YouTube videos
interface YouTubeGridProps {
  videos: YouTubeEmbedProps[];
}

export function YouTubeGrid({ videos }: YouTubeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      {videos.map((video, index) => (
        <YouTubeEmbed key={index} {...video} />
      ))}
    </div>
  );
}
