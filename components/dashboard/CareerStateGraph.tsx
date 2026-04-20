'use client';

import { motion } from 'framer-motion';
import { Target, Brain, Heart, AlertCircle } from 'lucide-react';

interface Node {
  id: string;
  type: 'goal' | 'skill' | 'interest' | 'constraint';
  label: string;
  confidence: number;
}

interface CareerStateGraphProps {
  confidenceScore?: number;
}

export function CareerStateGraph({ confidenceScore = 0 }: CareerStateGraphProps) {
  // Sample nodes for visualization
  const nodes: Node[] = [
    { id: '1', type: 'goal', label: 'MS USA', confidence: 0.9 },
    { id: '2', type: 'skill', label: 'Python', confidence: 0.7 },
    { id: '3', type: 'interest', label: 'AI/ML', confidence: 0.8 },
    { id: '4', type: 'constraint', label: 'Budget', confidence: 0.5 },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return Target;
      case 'skill':
        return Brain;
      case 'interest':
        return Heart;
      case 'constraint':
        return AlertCircle;
      default:
        return Target;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Career State Graph</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Confidence:</span>
          <span className="text-lg font-bold text-orange-400">{confidenceScore}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidenceScore}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
        />
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-2 gap-4">
        {nodes.map((node, index) => {
          const Icon = getIcon(node.type);
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-orange-500/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{node.label}</p>
                  <p className="text-xs text-slate-500 capitalize">{node.type}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Certainty</span>
                  <span className="text-orange-400">{Math.round(node.confidence * 100)}%</span>
                </div>
                <div className="h-1 bg-slate-700 rounded-full">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${node.confidence * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
