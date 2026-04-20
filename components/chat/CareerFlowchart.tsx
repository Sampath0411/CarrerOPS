'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Clock } from 'lucide-react';

interface FlowchartStep {
  step: number;
  title: string;
  description: string;
  timeline: string;
  completed?: boolean;
  current?: boolean;
}

interface CareerFlowchartProps {
  steps: FlowchartStep[];
  title: string;
  description?: string;
}

export function CareerFlowchart({ steps, title, description }: CareerFlowchartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-xl border border-slate-800 p-5 my-4"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </span>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-400 mt-1 ml-10">{description}</p>
        )}
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const status = step.completed
            ? 'completed'
            : step.current
            ? 'current'
            : 'pending';

          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex gap-4">
                {/* Step Indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                      status === 'completed'
                        ? 'bg-green-500 border-green-500'
                        : status === 'current'
                        ? 'bg-orange-500 border-orange-500'
                        : 'bg-slate-800 border-slate-600'
                    }`}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <span
                        className={`text-sm font-bold ${
                          status === 'current' ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {step.step}
                      </span>
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 my-1 ${
                        status === 'completed' ? 'bg-green-500/50' : 'bg-slate-700'
                      }`}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div
                  className={`flex-1 pb-4 ${!isLast ? 'border-b border-slate-800' : ''}`}
                >
                  <div className="bg-slate-800/50 rounded-lg p-3 hover:bg-slate-800 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4
                          className={`font-medium ${
                            status === 'completed'
                              ? 'text-green-400'
                              : status === 'current'
                              ? 'text-orange-400'
                              : 'text-white'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
                        <Clock className="w-3 h-3" />
                        {step.timeline}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
