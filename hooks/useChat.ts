'use client';

import { useState, useCallback } from 'react';
import { useCareer, type CareerNode, type CareerEdge } from '@/lib/context/CareerContext';
import type { ChatMessage, IntentData, DailyActions } from '@/types';

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
  const { addNodes, addEdges, updateNodeStatus, state } = useCareer();

  // Get user profile from career state
  const userProfile = state.profile;

  // Helper to sync chat data with career state
  const syncCareerState = useCallback((intent: IntentData, resources?: ExamResource[]) => {
    const newNodes: CareerNode[] = [];
    const newEdges: CareerEdge[] = [];

    const { entities } = intent;

    // Add goals as nodes
    if (entities?.goals) {
      entities.goals.forEach((goal: string) => {
        const nodeId = `goal-${goal.toLowerCase().replace(/\s+/g, '-')}`;
        if (!state.nodes.find(n => n.id === nodeId)) {
          newNodes.push({
            id: nodeId,
            label: goal,
            type: 'goal',
            status: 'available',
            description: `Career goal: ${goal}`,
          });
        }
      });
    }

    // Add exams as nodes
    if (entities?.exams) {
      entities.exams.forEach((exam: string) => {
        const nodeId = `exam-${exam.toLowerCase()}`;
        if (!state.nodes.find(n => n.id === nodeId)) {
          newNodes.push({
            id: nodeId,
            label: exam,
            type: 'exam',
            status: 'locked',
            description: `${exam} examination preparation`,
          });
        }
      });
    }

    // Add skills as nodes
    if (entities?.skills) {
      entities.skills.forEach((skill: string) => {
        const nodeId = `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`;
        if (!state.nodes.find(n => n.id === nodeId)) {
          newNodes.push({
            id: nodeId,
            label: skill,
            type: 'skill',
            status: 'available',
            description: `Learn ${skill}`,
          });
        }
      });
    }

    // Add resources as milestone nodes
    resources?.forEach((resource) => {
      const nodeId = `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      newNodes.push({
        id: nodeId,
        label: resource.title,
        type: 'milestone',
        status: 'available',
        description: resource.description || 'Video resource',
        links: [{ label: 'Watch on YouTube', url: resource.url }],
      });
    });

    if (newNodes.length > 0) {
      addNodes(newNodes);
    }
    if (newEdges.length > 0) {
      addEdges(newEdges);
    }
  }, [state.nodes, addNodes, addEdges]);

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
      // Call API with user profile
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
          userProfile: userProfile ? {
            branch: userProfile.branch,
            year: userProfile.year,
            cgpa: userProfile.cgpa,
            learningPosition: userProfile.learningPosition,
          } : undefined,
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
        // Sync with career state including resources
        syncCareerState(data.intent, data.resources);
      }
    } catch (error) {
      console.error('Chat Error:', error);

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
  }, [mode, userProfile, syncCareerState]);

  return {
    messages,
    isTyping,
    lastIntent,
    sendMessage,
  };
}
