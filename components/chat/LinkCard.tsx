'use client';

import { motion } from 'framer-motion';
import { ExternalLink, GraduationCap, BookOpen, FileText, PlayCircle, Globe } from 'lucide-react';

interface LinkCardProps {
  url: string;
  title?: string;
  description?: string;
  type?: 'course' | 'article' | 'video' | 'exam' | 'general';
}

// Extract domain and path info for display
function parseUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    const path = urlObj.pathname;
    return { domain, path };
  } catch {
    return { domain: url, path: '' };
  }
}

// Determine link type based on URL patterns
function detectLinkType(url: string): LinkCardProps['type'] {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('coursera') || lowerUrl.includes('udemy') || lowerUrl.includes('edx') || lowerUrl.includes('course')) {
    return 'course';
  }
  if (lowerUrl.includes('youtube') || lowerUrl.includes('vimeo') || lowerUrl.includes('watch')) {
    return 'video';
  }
  if (lowerUrl.includes('gre') || lowerUrl.includes('gate') || lowerUrl.includes('exam') || lowerUrl.includes('ets')) {
    return 'exam';
  }
  if (lowerUrl.includes('blog') || lowerUrl.includes('article') || lowerUrl.includes('medium')) {
    return 'article';
  }
  return 'general';
}

// Get icon based on link type
function getTypeIcon(type: LinkCardProps['type']) {
  switch (type) {
    case 'course':
      return { icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50' };
    case 'video':
      return { icon: PlayCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' };
    case 'exam':
      return { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/50' };
    case 'article':
      return { icon: BookOpen, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50' };
    default:
      return { icon: Globe, color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50' };
  }
}

// Get label based on link type
function getTypeLabel(type: LinkCardProps['type']) {
  switch (type) {
    case 'course':
      return 'Online Course';
    case 'video':
      return 'Video Resource';
    case 'exam':
      return 'Exam Resource';
    case 'article':
      return 'Article';
    default:
      return 'Resource';
  }
}

export function LinkCard({ url, title, description, type: providedType }: LinkCardProps) {
  const type = providedType || detectLinkType(url);
  const { domain, path } = parseUrl(url);
  const { icon: Icon, color, bg, border } = getTypeIcon(type);
  const displayTitle = title || domain;
  const displayDescription = description || `Visit ${domain}${path ? path.substring(0, 30) + (path.length > 30 ? '...' : '') : ''}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`block p-4 rounded-xl border-2 ${border} ${bg} cursor-pointer group transition-all`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium ${color} uppercase tracking-wide`}>
              {getTypeLabel(type)}
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h4 className="text-white font-medium text-sm mb-1 truncate group-hover:text-orange-400 transition-colors">
            {displayTitle}
          </h4>
          <p className="text-slate-400 text-xs line-clamp-2">
            {displayDescription}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <Globe className="w-3 h-3" />
            <span className="truncate">{domain}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <motion.div
        className="mt-3 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800/50 group-hover:bg-orange-500/20 transition-colors"
        whileHover={{ scale: 1.02 }}
      >
        <ExternalLink className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-medium text-orange-400">Open Resource</span>
      </motion.div>
    </motion.a>
  );
}

// Button-style link for inline actions
interface LinkButtonProps {
  url: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function LinkButton({ url, label, variant = 'primary' }: LinkButtonProps) {
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600',
    outline: 'border-2 border-orange-500 text-orange-400 hover:bg-orange-500/10',
  };

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${variants[variant]}`}
    >
      {label}
      <ExternalLink className="w-4 h-4" />
    </motion.a>
  );
}

// Course-specific card with more details
interface CourseCardProps {
  title: string;
  platform: string;
  url: string;
  duration?: string;
  level?: string;
}

export function CourseCard({ title, platform, url, duration, level }: CourseCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="block p-4 rounded-xl border-2 border-blue-500/30 bg-blue-500/10 hover:border-blue-500/50 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-blue-400" />
        </div>
        <span className="text-xs font-medium text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
          {platform}
        </span>
      </div>

      <h4 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors">
        {title}
      </h4>

      {(duration || level) && (
        <div className="flex items-center gap-3 mb-3">
          {duration && (
            <span className="text-xs text-slate-400">{duration}</span>
          )}
          {level && (
            <span className="text-xs text-slate-400 capitalize">{level}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 text-sm font-medium text-blue-400">
        <span>View Course</span>
        <ExternalLink className="w-4 h-4" />
      </div>
    </motion.a>
  );
}
