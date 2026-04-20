'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCareer } from '@/lib/context/CareerContext';
import { CareerStateGraph } from '@/components/dashboard/CareerStateGraph';
import { ActionCenter } from '@/components/dashboard/ActionCenter';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RoadmapGraph } from '@/components/roadmap/RoadmapGraph';
import { LayoutDashboard, Route, CheckCircle2, User } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'actions'>('overview');
  const { state } = useCareer();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Route },
    { id: 'actions', label: 'Actions', icon: CheckCircle2 },
  ] as const;

  // Get tasks from career state nodes
  const mustDoTasks = state.nodes
    .filter(n => n.status === 'in-progress')
    .slice(0, 3)
    .map((n, i) => ({
      id: n.id,
      title: n.label,
      type: n.type,
      estimated_minutes: parseInt(n.estimatedTime?.split(' ')[0] || '30'),
      completed: n.status === 'completed',
    }));

  const optionalTasks = state.nodes
    .filter(n => n.status === 'available')
    .slice(0, 2)
    .map((n, i) => ({
      id: n.id,
      title: n.label,
      type: n.type,
      estimated_minutes: parseInt(n.estimatedTime?.split(' ')[0] || '20'),
      completed: false,
    }));

  const focusArea = mustDoTasks.length > 0
    ? mustDoTasks[0].title
    : 'Set your goals to get started';

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">Your career intelligence at a glance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-800">
              <User className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white">{state.profile?.name || 'Guest'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <StatsGrid />

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CareerStateGraph confidenceScore={Math.round((state.nodes.filter(n => n.status === 'completed').length / Math.max(state.nodes.length, 1)) * 100)} />
                <ActionCenter
                  mustDo={mustDoTasks}
                  optional={optionalTasks}
                  focusArea={focusArea}
                />
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-serif text-white">Career Roadmap</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Explore all available paths and track your progress
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {state.nodes.filter(n => n.status === 'completed').length}/{state.nodes.length}
                      </div>
                      <div className="text-xs text-slate-400">Nodes completed</div>
                    </div>
                  </div>
                </div>

                <RoadmapGraph />
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActionCenter
                  mustDo={mustDoTasks}
                  optional={optionalTasks}
                  focusArea={focusArea}
                />

                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                      <span className="text-slate-300">Goals Set</span>
                      <span className="text-2xl font-bold text-white">
                        {state.nodes.filter(n => n.type === 'goal').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                      <span className="text-slate-300">Skills In Progress</span>
                      <span className="text-2xl font-bold text-orange-400">
                        {state.nodes.filter(n => n.type === 'skill' && n.status === 'in-progress').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                      <span className="text-slate-300">Exams Prepared</span>
                      <span className="text-2xl font-bold text-green-400">
                        {state.nodes.filter(n => n.type === 'exam' && n.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800 rounded-lg">
                      <span className="text-slate-300">Outcomes Achieved</span>
                      <span className="text-2xl font-bold text-blue-400">
                        {state.nodes.filter(n => n.type === 'outcome' && n.status === 'completed').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
