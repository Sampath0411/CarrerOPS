'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  year: number;
  cgpa: number;
  branch: string;
  learningPosition: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  preferredPath: 'higher-ed' | 'courses' | 'both';
  hasCompletedOnboarding: boolean;
}

export interface CareerNode {
  id: string;
  label: string;
  type: 'goal' | 'skill' | 'exam' | 'outcome' | 'milestone';
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  description: string;
  links?: { label: string; url: string }[];
  estimatedTime?: string;
  x?: number;
  y?: number;
}

export interface CareerEdge {
  from: string;
  to: string;
  label?: string;
}

export interface CareerState {
  profile: UserProfile | null;
  nodes: CareerNode[];
  edges: CareerEdge[];
  lastUpdated: string;
}

interface CareerContextType {
  state: CareerState;
  updateProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (profile: UserProfile) => void;
  updateNodeStatus: (nodeId: string, status: CareerNode['status']) => void;
  addNodes: (nodes: CareerNode[]) => void;
  addEdges: (edges: CareerEdge[]) => void;
  generateInitialRoadmap: () => void;
  clearState: () => void;
}

const defaultState: CareerState = {
  profile: null,
  nodes: [],
  edges: [],
  lastUpdated: new Date().toISOString(),
};

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export function CareerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CareerState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('careerState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(parsed);
      } catch {
        console.error('Failed to parse career state');
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('careerState', JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...profile } : null,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const completeOnboarding = useCallback((profile: UserProfile) => {
    const fullProfile = { ...profile, hasCompletedOnboarding: true };
    setState((prev) => ({
      ...prev,
      profile: fullProfile,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const updateNodeStatus = useCallback((nodeId: string, status: CareerNode['status']) => {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, status } : n)),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const addNodes = useCallback((nodes: CareerNode[]) => {
    setState((prev) => ({
      ...prev,
      nodes: [...prev.nodes, ...nodes.filter((n) => !prev.nodes.find((existing) => existing.id === n.id))],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const addEdges = useCallback((edges: CareerEdge[]) => {
    setState((prev) => ({
      ...prev,
      edges: [...prev.edges, ...edges.filter((e) => !prev.edges.find((existing) => existing.from === e.from && existing.to === e.to))],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const generateInitialRoadmap = useCallback(() => {
    const profile = state.profile;
    if (!profile) return;

    const nodes: CareerNode[] = [];
    const edges: CareerEdge[] = [];

    // Add base goal nodes based on preferred path
    if (profile.preferredPath === 'higher-ed' || profile.preferredPath === 'both') {
      nodes.push(
        { id: 'goal-ms', label: 'MS in USA/Canada', type: 'goal', status: 'available', description: 'Pursue Master\'s degree in Computer Science abroad', estimatedTime: '2 years' },
        { id: 'goal-mba', label: 'MBA', type: 'goal', status: 'available', description: 'Master of Business Administration', estimatedTime: '2 years' },
        { id: 'goal-gate', label: 'GATE', type: 'goal', status: 'available', description: 'Graduate Aptitude Test in Engineering', estimatedTime: '6 months prep' },
        { id: 'goal-psu', label: 'PSU Jobs', type: 'goal', status: 'available', description: 'Public Sector Undertaking recruitment', estimatedTime: '3-6 months prep' }
      );

      // MS path
      nodes.push(
        { id: 'gre', label: 'GRE', type: 'exam', status: 'locked', description: 'Graduate Record Examination', estimatedTime: '2-3 months prep' },
        { id: 'toefl', label: 'TOEFL/IELTS', type: 'exam', status: 'locked', description: 'English proficiency test', estimatedTime: '1 month prep' },
        { id: 'sop', label: 'SOP & LORs', type: 'milestone', status: 'locked', description: 'Statement of Purpose and Letters of Recommendation', estimatedTime: '2-4 weeks' },
        { id: 'ms-admit', label: 'MS Admission', type: 'outcome', status: 'locked', description: 'Get admits from target universities' }
      );
      edges.push(
        { from: 'goal-ms', to: 'gre', label: 'requires' },
        { from: 'gre', to: 'toefl', label: 'then' },
        { from: 'toefl', to: 'sop', label: 'then' },
        { from: 'sop', to: 'ms-admit', label: 'leads to' }
      );

      // GATE path
      nodes.push(
        { id: 'gate-prep', label: 'GATE Preparation', type: 'milestone', status: 'locked', description: 'Core CS subjects + aptitude', estimatedTime: '6-8 months' },
        { id: 'gate-exam', label: 'GATE Exam', type: 'exam', status: 'locked', description: 'Annual exam in February', estimatedTime: '3 hours' },
        { id: 'gate-score', label: 'Good Score', type: 'outcome', status: 'locked', description: 'Score above 60 for IITs' }
      );
      edges.push(
        { from: 'goal-gate', to: 'gate-prep', label: 'requires' },
        { from: 'gate-prep', to: 'gate-exam', label: 'then' },
        { from: 'gate-exam', to: 'gate-score', label: 'leads to' }
      );
    }

    // Skills common to all paths
    nodes.push(
      { id: 'dsa', label: 'Data Structures & Algorithms', type: 'skill', status: profile.learningPosition === 'beginner' ? 'in-progress' : 'available', description: 'Core programming concepts', links: [{ label: 'LeetCode', url: 'https://leetcode.com' }, { label: 'GeeksforGeeks', url: 'https://geeksforgeeks.org' }] },
      { id: 'aptitude', label: 'Aptitude & Reasoning', type: 'skill', status: 'available', description: 'Quantitative and logical reasoning', links: [{ label: 'IndiaBIX', url: 'https://indiabix.com' }] },
      { id: 'communication', label: 'Communication Skills', type: 'skill', status: 'available', description: 'Written and verbal communication' }
    );

    if (profile.preferredPath === 'courses' || profile.preferredPath === 'both') {
      nodes.push(
        { id: 'course-web', label: 'Web Development', type: 'goal', status: 'available', description: 'Full-stack web development', estimatedTime: '3-6 months' },
        { id: 'course-data', label: 'Data Science', type: 'goal', status: 'available', description: 'ML, Data Analysis, Python', estimatedTime: '4-6 months' },
        { id: 'course-cloud', label: 'Cloud Computing', type: 'goal', status: 'available', description: 'AWS/Azure certifications', estimatedTime: '2-3 months' }
      );
    }

    // Position nodes in a grid layout
    let x = 0, y = 0;
    const goals = nodes.filter((n) => n.type === 'goal');
    const skills = nodes.filter((n) => n.type === 'skill');
    const exams = nodes.filter((n) => n.type === 'exam');
    const milestones = nodes.filter((n) => n.type === 'milestone');
    const outcomes = nodes.filter((n) => n.type === 'outcome');

    goals.forEach((n, i) => { n.x = 100 + i * 250; n.y = 50; });
    skills.forEach((n, i) => { n.x = 50 + i * 200; n.y = 200; });
    exams.forEach((n, i) => { n.x = 100 + i * 200; n.y = 350; });
    milestones.forEach((n, i) => { n.x = 150 + i * 250; n.y = 500; });
    outcomes.forEach((n, i) => { n.x = 200 + i * 300; n.y = 650; });

    setState((prev) => ({
      ...prev,
      nodes,
      edges,
      lastUpdated: new Date().toISOString(),
    }));
  }, [state.profile]);

  const clearState = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem('careerState');
  }, []);

  return (
    <CareerContext.Provider
      value={{
        state,
        updateProfile,
        completeOnboarding,
        updateNodeStatus,
        addNodes,
        addEdges,
        generateInitialRoadmap,
        clearState,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within CareerProvider');
  }
  return context;
}
