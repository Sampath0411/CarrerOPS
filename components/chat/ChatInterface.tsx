'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useChat } from '@/hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { IntentIndicator } from './IntentIndicator';
import { GraduationCap, School } from 'lucide-react';

export function ChatInterface() {
  const [mode, setMode] = useState<'courses' | 'higher-ed'>('courses');
  const { messages, isTyping, lastIntent, sendMessage } = useChat(mode);

  return (
    <div className="flex flex-col h-full">
      {/* Mode Toggle */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              mode === 'courses'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-medium">Courses</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMode('higher-ed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              mode === 'higher-ed'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <School className="w-4 h-4" />
            <span className="text-sm font-medium">Higher Education</span>
          </motion.button>
        </div>
      </div>

      {/* Intent Indicator */}
      {lastIntent && (
        <IntentIndicator intent={lastIntent} />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center mt-20">
            <div className="inline-block mb-6 animate-spin">
              <span className="text-4xl">✦</span>
            </div>
            <h2 className="text-3xl font-serif text-white mb-4">
              Hey there!
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              {mode === 'courses'
                ? "I'm CareerOps. Tell me what skills you want to learn - Python, Data Science, Web Development, or anything else. I'll find the best courses for you."
                : "I'm CareerOps. Tell me about your higher education goals - MS, MBA, or studying abroad. I'll help you plan your journey."}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <ChatInput onSend={sendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}
