'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Zap } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  type: string;
  estimated_minutes: number;
  completed: boolean;
}

interface ActionCenterProps {
  mustDo?: Task[];
  optional?: Task[];
  focusArea?: string;
}

export function ActionCenter({
  mustDo = [],
  optional = [],
  focusArea = 'No focus set yet',
}: ActionCenterProps) {
  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Action Center</h3>
          <p className="text-sm text-slate-400">Focus: {focusArea}</p>
        </div>
      </div>

      {/* Must Do Tasks */}
      {mustDo.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Must Do Today</h4>
          <div className="space-y-2">
            {mustDo.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
              >
                <button className="text-slate-500 hover:text-orange-400 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500">{task.estimated_minutes} min</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Tasks */}
      {optional.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-3">Optional</h4>
          <div className="space-y-2">
            {optional.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
              >
                <button className="text-slate-500 hover:text-orange-400 transition-colors"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <p className="text-sm text-slate-300">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500">{task.estimated_minutes} min</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
