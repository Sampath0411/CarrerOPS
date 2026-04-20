'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareer, type UserProfile } from '@/lib/context/CareerContext';
import { User, GraduationCap, BookOpen, Target, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface StepProps {
  data: Partial<UserProfile>;
  updateData: (data: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

function StepPersonalInfo({ data, updateData, onNext }: StepProps) {
  const isValid = data.name?.trim() && data.email?.trim();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-white mb-2">Let&apos;s get to know you</h2>
        <p className="text-slate-400">We&apos;ll personalize your career journey based on your profile</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        Continue
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function StepAcademicInfo({ data, updateData, onNext, onBack }: StepProps) {
  const isValid = data.year && data.cgpa && data.branch?.trim();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-white mb-2">Academic Background</h2>
        <p className="text-slate-400">This helps us recommend the right path for you</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Current Year</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((year) => (
              <button
                key={year}
                onClick={() => updateData({ year })}
                className={`py-3 rounded-lg border transition-all ${
                  data.year === year
                    ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                {year}st{year === 1 ? '' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">CGPA</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={data.cgpa || ''}
            onChange={(e) => updateData({ cgpa: parseFloat(e.target.value) })}
            placeholder="e.g., 8.5"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Branch</label>
          <select
            value={data.branch || ''}
            onChange={(e) => updateData({ branch: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select your branch</option>
            <option value="CSE">Computer Science & Engineering</option>
            <option value="ECE">Electronics & Communication</option>
            <option value="EEE">Electrical & Electronics</option>
            <option value="MECH">Mechanical Engineering</option>
            <option value="CIVIL">Civil Engineering</option>
            <option value="IT">Information Technology</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StepLearningPosition({ data, updateData, onNext, onBack }: StepProps) {
  const positions: { value: UserProfile['learningPosition']; label: string; description: string }[] = [
    { value: 'beginner', label: 'Beginner', description: 'Just starting out, learning fundamentals' },
    { value: 'intermediate', label: 'Intermediate', description: 'Have some knowledge, building projects' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced, ready for advanced topics' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-white mb-2">Where are you now?</h2>
        <p className="text-slate-400">This helps us calibrate the difficulty level</p>
      </div>

      <div className="space-y-3">
        {positions.map((pos) => (
          <button
            key={pos.value}
            onClick={() => updateData({ learningPosition: pos.value })}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              data.learningPosition === pos.value
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-slate-700 bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="font-medium text-white mb-1">{pos.label}</div>
            <div className="text-sm text-slate-400">{pos.description}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.learningPosition}
          className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StepCareerPath({ data, updateData, onNext, onBack }: StepProps) {
  const paths: { value: UserProfile['preferredPath']; label: string; description: string; icon: typeof GraduationCap }[] = [
    { value: 'higher-ed', label: 'Higher Education', description: 'MS, MBA, GATE, and competitive exams', icon: GraduationCap },
    { value: 'courses', label: 'Skill Courses', description: 'Web dev, Data Science, Cloud certifications', icon: BookOpen },
    { value: 'both', label: 'Both', description: 'Explore all options and keep doors open', icon: Target },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-white mb-2">What&apos;s your focus?</h2>
        <p className="text-slate-400">You can change this later as you explore</p>
      </div>

      <div className="space-y-3">
        {paths.map((path) => {
          const Icon = path.icon;
          return (
            <button
              key={path.value}
              onClick={() => updateData({ preferredPath: path.value })}
              className={`w-full p-4 rounded-lg border text-left transition-all flex items-center gap-4 ${
                data.preferredPath === path.value
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                data.preferredPath === path.value ? 'bg-orange-500/20' : 'bg-slate-700'
              }`}>
                <Icon className={`w-6 h-6 ${data.preferredPath === path.value ? 'text-orange-400' : 'text-slate-400'}`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-white mb-1">{path.label}</div>
                <div className="text-sm text-slate-400">{path.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.preferredPath}
          className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          Get Started
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<UserProfile>>({});
  const { completeOnboarding, generateInitialRoadmap } = useCareer();

  const steps = [StepPersonalInfo, StepAcademicInfo, StepLearningPosition, StepCareerPath];
  const CurrentStep = steps[step];

  const updateData = (newData: Partial<UserProfile>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const profile: UserProfile = {
        name: data.name || '',
        email: data.email || '',
        year: data.year || 1,
        cgpa: data.cgpa || 0,
        branch: data.branch || '',
        learningPosition: data.learningPosition || 'beginner',
        goals: data.goals || [],
        preferredPath: data.preferredPath || 'both',
        hasCompletedOnboarding: true,
      };
      completeOnboarding(profile);
      generateInitialRoadmap();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const stepIcons = [User, GraduationCap, BookOpen, Target];
  const StepIcon = stepIcons[step];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <StepIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">CareerOps</h1>
          <p className="text-slate-400 text-sm mt-1">AI Career Operating System</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i <= step ? 'bg-orange-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentStep
                data={data}
                updateData={updateData}
                onNext={handleNext}
                onBack={handleBack}
                isFirst={step === 0}
                isLast={step === steps.length - 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Indicator */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Step {step + 1} of {steps.length}
        </p>
      </motion.div>
    </div>
  );
}
