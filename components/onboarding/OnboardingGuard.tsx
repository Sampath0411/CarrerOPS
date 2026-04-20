'use client';

import { useCareer } from '@/lib/context/CareerContext';
import { OnboardingWizard } from './OnboardingWizard';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { state } = useCareer();

  // If not hydrated yet, show nothing (prevents flash)
  if (!state.lastUpdated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If onboarding not completed, show wizard
  if (!state.profile?.hasCompletedOnboarding) {
    return <OnboardingWizard />;
  }

  // Otherwise, render children
  return <>{children}</>;
}
