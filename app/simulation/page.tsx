'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, Calendar, Check } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  timeline_months: number;
  success_probability: number;
  roi_score: number;
  cost_estimate: string;
  pros: string[];
  cons: string[];
}

export default function SimulationPage() {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(['MS_USA', 'PSU_India']);

  const scenarios: Scenario[] = [
    {
      id: 'MS_USA',
      name: 'MS in USA',
      timeline_months: 24,
      success_probability: 75,
      roi_score: 85,
      cost_estimate: '$80,000',
      pros: ['Global opportunities', 'Higher salary', 'Research exposure'],
      cons: ['High cost', 'Competition', 'Visa uncertainty'],
    },
    {
      id: 'PSU_India',
      name: 'PSU via GATE',
      timeline_months: 12,
      success_probability: 60,
      roi_score: 90,
      cost_estimate: '$500',
      pros: ['Job security', 'Low cost', 'Work-life balance'],
      cons: ['Lower growth', 'Location constraints', 'Bureaucracy'],
    },
    {
      id: 'PLACEMENT',
      name: 'Direct Placement',
      timeline_months: 6,
      success_probability: 80,
      roi_score: 70,
      cost_estimate: '$0',
      pros: ['Immediate income', 'No exams', 'Industry experience'],
      cons: ['Limited options', 'Lower starting pay', 'Competition'],
    },
  ];

  const toggleScenario = (id: string) => {
    setSelectedScenarios((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const activeScenarios = scenarios.filter((s) => selectedScenarios.includes(s.id));

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-orange-400" />
            <h1 className="text-3xl font-serif text-white">Career Simulator</h1>
          </div>
          <p className="text-slate-400">
            Compare different career paths and their outcomes
          </p>
        </div>

        {/* Scenario Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4">Select Scenarios to Compare</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <motion.button
                key={scenario.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleScenario(scenario.id)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selectedScenarios.includes(scenario.id)
                    ? 'bg-orange-500/20 border-orange-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{scenario.name}</span>
                  {selectedScenarios.includes(scenario.id) && (
                    <Check className="w-5 h-5 text-orange-400" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Comparison Results */}
        {activeScenarios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-medium text-white">Comparison Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-slate-900 rounded-xl p-6 border border-slate-800"
                >
                  <h3 className="text-xl font-bold text-white mb-4">{scenario.name}</h3>

                  {/* Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm text-slate-400">Success Probability</p>
                        <p className="text-lg font-semibold text-white">{scenario.success_probability}%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-slate-400">Estimated Cost</p>
                        <p className="text-lg font-semibold text-white">{scenario.cost_estimate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-slate-400">Timeline</p>
                        <p className="text-lg font-semibold text-white">{scenario.timeline_months} months</p>
                      </div>
                    </div>
                  </div>

                  {/* Pros */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-green-400 mb-2">Pros</p>
                    <ul className="space-y-1">
                      {scenario.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-slate-300">• {pro}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div>
                    <p className="text-sm font-medium text-red-400 mb-2">Cons</p>
                    <ul className="space-y-1">
                      {scenario.cons.map((con, i) => (
                        <li key={i} className="text-sm text-slate-300">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
