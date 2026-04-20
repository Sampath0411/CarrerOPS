'use client';

import { motion } from 'framer-motion';
import { User, Bot, CheckCircle2, Clock } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { YouTubeEmbed, YouTubeGrid } from './YouTubeEmbed';
import { CareerFlowchart } from './CareerFlowchart';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: ChatMessage;
}

interface ExamResource {
  title: string;
  url: string;
  embedId?: string;
  description?: string;
  duration?: string;
  level?: string;
}

interface FlowchartStep {
  step: number;
  title: string;
  description: string;
  timeline: string;
}

interface CareerPath {
  flowchart: FlowchartStep[];
  exams_required: string[];
  avg_cost: string;
  duration: string;
}

// Parse message content for structured data
function parseMessageContent(content: string): {
  text: string;
  resources: ExamResource[];
  flowchart?: CareerPath;
} {
  // Try to extract resources from message metadata if stored there
  // For now, we'll parse inline
  const resources: ExamResource[] = [];

  // Extract YouTube playlist URLs
  const playlistRegex = /https:\/\/www\.youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/g;
  const matches = [...content.matchAll(playlistRegex)];

  matches.forEach((match) => {
    const embedId = match[1];
    // Extract title from preceding line if available
    const lines = content.split('\n');
    let title = 'YouTube Playlist';
    let description = '';

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match[0])) {
        // Look for title in previous lines
        for (let j = Math.max(0, i - 3); j < i; j++) {
          if (lines[j].startsWith('**') && lines[j].includes('**')) {
            title = lines[j].replace(/\*\*/g, '').trim();
            break;
          }
        }
        // Look for description
        if (i + 1 < lines.length && !lines[i + 1].includes('http')) {
          description = lines[i + 1].trim();
        }
        break;
      }
    }

    // Extract duration if mentioned
    const durationMatch = content.match(/(\d+\+?\s*hours?)/i);
    const duration = durationMatch ? durationMatch[1] : undefined;

    // Extract level if mentioned
    const levelMatch = content.match(/(Beginner|Intermediate|Advanced|All levels)/i);
    const level = levelMatch ? levelMatch[1] : undefined;

    resources.push({
      title,
      url: match[0],
      embedId,
      description,
      duration,
      level,
    });
  });

  return { text: content, resources };
}

// Custom Markdown components for organized display
const MarkdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-xl font-bold text-white mt-4 mb-3 pb-2 border-b border-slate-700">{children || ''}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-lg font-semibold text-orange-400 mt-4 mb-2">{children || ''}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base font-medium text-white mt-3 mb-2 flex items-center gap-2">
      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
      {children || ''}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-slate-300 mb-2 leading-relaxed">{children || ''}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-1 text-slate-300 mb-3">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-3">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="ml-2">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="text-white font-semibold">{children || ''}</strong>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="bg-slate-800 text-orange-400 px-1.5 py-0.5 rounded text-sm">{children || ''}</code>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-orange-500 pl-4 my-3 text-slate-400 italic">{children}</blockquote>
  ),
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  // Don't parse user messages
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 mb-6 flex-row-reverse"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-500">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="max-w-[80%] px-5 py-3 rounded-2xl bg-orange-500 text-white rounded-br-md">
          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </motion.div>
    );
  }

  // Parse assistant message
  const { text, resources } = parseMessageContent(message.content);

  // Check if message contains flowchart-like content
  const hasFlowchart = text.includes('Step') && text.includes('Timeline');
  const hasResources = resources.length > 0;

  // Extract structured data from message for flowchart
  let flowchartSteps: FlowchartStep[] = [];
  let flowchartTitle = 'Career Roadmap';

  if (hasFlowchart) {
    // Parse steps from message
    const stepMatches = text.matchAll(/### Step (\d+): ([^\n]+)\n([^⏱]+)⏱️ \*\*Timeline:\*\* ([^\n]+)/g);
    for (const match of stepMatches) {
      flowchartSteps.push({
        step: parseInt(match[1]),
        title: match[2].trim(),
        description: match[3].trim(),
        timeline: match[4].trim(),
      });
    }

    // Extract title
    const titleMatch = text.match(/## ([^\n]+)/);
    if (titleMatch) {
      flowchartTitle = titleMatch[1].replace(' Career Roadmap', '').trim();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 mb-6"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-700">
        <Bot className="w-4 h-4 text-orange-400" />
      </div>

      <div className="max-w-[90%] space-y-4">
        {/* Text Content with Markdown */}
        <div className="px-5 py-4 rounded-2xl bg-slate-800 text-slate-200 rounded-bl-md">
          <ReactMarkdown components={MarkdownComponents}>
            {text}
          </ReactMarkdown>
        </div>

        {/* Flowchart Visualization */}
        {flowchartSteps.length > 0 && (
          <CareerFlowchart
            steps={flowchartSteps}
            title={flowchartTitle}
            description="Your personalized career journey"
          />
        )}

        {/* YouTube Video Grid */}
        {hasResources && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-white">Recommended Playlists</span>
            </div>
            <YouTubeGrid videos={resources} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
