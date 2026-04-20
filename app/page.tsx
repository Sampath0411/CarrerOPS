'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, LayoutDashboard, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            CareerOps
          </h1>
          <p className="text-2xl md:text-3xl font-serif text-slate-300 mb-4">
            AI Career Operating System
          </p>
          <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto">
            Your AI-powered career guidance platform. Chat with AI, build roadmaps,
            simulate scenarios, and take action.
          </p>

          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-full font-medium text-lg shadow-lg hover:bg-orange-600 transition-all"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full px-4"
        >
          {[
            {
              icon: MessageSquare,
              title: 'AI Chat',
              description: 'Natural conversations that understand your career goals',
              href: '/chat',
            },
            {
              icon: LayoutDashboard,
              title: 'Dashboard',
              description: 'Track your career state, progress, and insights',
              href: '/dashboard',
            },
            {
              icon: Zap,
              title: 'Simulation',
              description: 'Compare career paths with probability analysis',
              href: '/simulation',
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-orange-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-slate-400 group-hover:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-slate-500 text-sm">
        Powered by Groq AI
      </div>
    </div>
  );
}
