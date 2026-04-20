'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Target, BookOpen, Clock } from 'lucide-react';

export function StatsGrid() {
  const stats = [
    {
      icon: MessageSquare,
      label: 'Conversations',
      value: '12',
      color: 'bg-blue-500',
    },
    {
      icon: Target,
      label: 'Profile Complete',
      value: '65%',
      color: 'bg-green-500',
    },
    {
      icon: BookOpen,
      label: 'Courses Found',
      value: '8',
      color: 'bg-purple-500',
    },
    {
      icon: Clock,
      label: 'Time Spent',
      value: '2.5h',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-slate-900 rounded-xl p-6 border border-slate-800"
        >
          <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
            <stat.icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-sm text-slate-400">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
