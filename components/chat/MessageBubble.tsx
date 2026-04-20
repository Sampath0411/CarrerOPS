'use client';

import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-orange-500' : 'bg-slate-700'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-orange-400" />
        )}
      </div>
      <div
        className={`max-w-[80%] px-5 py-3 rounded-2xl ${
          isUser
            ? 'bg-orange-500 text-white rounded-br-md'
            : 'bg-slate-800 text-slate-200 rounded-bl-md'
        }`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}
