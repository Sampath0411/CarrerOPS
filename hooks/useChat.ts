'use client';

import { useState, useCallback } from 'react';
import type { ChatMessage, IntentData, DailyActions } from '@/types';

interface UseChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  lastIntent: IntentData | null;
  sendMessage: (content: string) => Promise<void>;
}

export function useChat(mode: 'courses' | 'higher-ed' = 'courses'): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastIntent, setLastIntent] = useState<IntentData | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      user_id: 'guest',
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      session_id: 'default',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          sessionId: 'default',
          userId: 'guest',
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add AI message
      const aiMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        user_id: 'guest',
        role: 'assistant',
        content: data.message,
        extracted_intent: data.intent,
        timestamp: new Date().toISOString(),
        session_id: 'default',
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.intent) {
        setLastIntent(data.intent);
      }
    } catch (error) {
      console.error('Chat Error:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        user_id: 'guest',
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        session_id: 'default',
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    messages,
    isTyping,
    lastIntent,
    sendMessage,
  };
}
