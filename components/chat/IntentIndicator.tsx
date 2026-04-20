'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, Brain, MapPin } from 'lucide-react';
import type { IntentData } from '@/types';

interface IntentIndicatorProps {
  intent: IntentData;
}

const intentIcons = {
  goal_declaration: Target,
  skill_update: Brain,
  interest_change: Sparkles,
  constraint_add: MapPin,
  roadmap_request: MapPin,
  simulation_request: Brain,
  action_request: Target,
  clarification: Brain,
  general_chat: Sparkles,
};

const intentLabels = {
  goal_declaration: 'Goal Declared',
  skill_update: 'Skills Updated',
  interest_change: 'Interests Updated',
  constraint_add: 'Constraints Added',
  roadmap_request: 'Roadmap Requested',
  simulation_request: 'Simulation Started',
  action_request: 'Actions Generated',
  clarification: 'Clarifying',
  general_chat: 'Chatting',
};

export function IntentIndicator({ intent }: IntentIndicatorProps) {
  const Icon = intentIcons[intent.intent_type] || Sparkles;
  const label = intentLabels[intent.intent_type] || 'Thinking';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="px-4 py-2 bg-slate-800/50 border-b border-slate-700"
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
              <Icon className="w-3 h-3 text-orange-400" />
            </div>
            <span className="text-sm text-slate-300">{label}</span>
            {intent.confidence > 0 && (
              <span className="text-xs text-slate-500">
                ({Math.round(intent.confidence * 100)}% confidence)
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 truncate max-w-xs">
            {intent.summary}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
