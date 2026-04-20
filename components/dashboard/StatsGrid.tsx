'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Target, BookOpen, Clock, CheckCircle2, Route } from 'lucide-react';
import { useCareer } from '@/lib/context/CareerContext';

export function StatsGrid() {
  const { state } = useCareer();

  // Calculate stats from career state
  const totalNodes = state.nodes.length;
  const completedNodes = state.nodes.filter(n => n.status === 'completed').length;
  const inProgressNodes = state.nodes.filter(n => n.status === 'in-progress').length;
  const profileCompletion = state.profile ? calculateProfileCompletion(state.profile) : 0;

  function calculateProfileCompletion(profile: typeof state.profile) {
    if (!profile) return 0;
    let score = 0;
    if (profile.name) score += 20;
    if (profile.email) score += 20;
    if (profile.year) score += 20;
    if (profile.cgpa) score += 20;
    if (profile.preferredPath) score += 20;
    return score;
  }

  const stats = [
    {
      icon: Route,
      label: 'Roadmap Nodes',
      value: `${completedNodes}/${totalNodes}`,
      subtext: `${inProgressNodes} in progress`,
      color: 'bg-blue-500',
    },
    {
      icon: Target,
      label: 'Profile Complete',
      value: `${profileCompletion}%`,
      color: 'bg-green-500',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: `${completedNodes}`,
      color: 'bg-purple-500',
    },
    {
      icon: Clock,
      label: 'In Progress',
      value: `${inProgressNodes}`,
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
          {stat.subtext && (
            <p className="text-xs text-slate-500 mt-1">{stat.subtext}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
