// CareerOps TypeScript Types

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  extracted_intent?: IntentData;
  state_delta?: StateChanges;
  timestamp: string;
  session_id: string;
}

export interface IntentData {
  intent_type: 'goal_declaration' | 'skill_update' | 'interest_change' |
              'constraint_add' | 'roadmap_request' | 'simulation_request' |
              'action_request' | 'clarification' | 'general_chat';
  entities: {
    goals?: string[];
    skills?: string[];
    countries?: string[];
    exams?: string[];
    timeframes?: string[];
    numbers?: string[];
  };
  confidence: number;
  state_affected: string[];
  summary: string;
}

export interface CareerNode {
  id: string;
  type: 'goal' | 'skill' | 'interest' | 'constraint' | 'location' | 'exam';
  label: string;
  properties: Record<string, any>;
  confidence: number;
  created_at: string;
}

export interface CareerEdge {
  id: string;
  source: string;
  target: string;
  type: 'prerequisite' | 'influence' | 'leads_to' | 'requires';
  weight: number;
}

export interface CareerStateGraph {
  user_id: string;
  nodes: CareerNode[];
  edges: CareerEdge[];
  confidence_score: number;
  last_intent?: string;
  last_updated: string;
}

export interface StateChanges {
  added: string[];
  updated: string[];
  removed: string[];
  edges_added: string[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  type: string;
  description?: string;
  dependencies: string[];
  estimated_weeks: number;
  skills_gained: string[];
  resources: string[];
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  progress: number;
}

export interface Roadmap {
  id: string;
  user_id: string;
  title: string;
  milestones: RoadmapMilestone[];
  critical_path: string[];
  estimated_completion?: string;
  flexibility_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  title: string;
  type: 'study' | 'research' | 'networking' | 'application' | 'practice';
  estimated_minutes: number;
  impact: 'high' | 'medium' | 'low';
  source_milestone?: string;
  completed: boolean;
}

export interface DailyActions {
  id: string;
  user_id: string;
  date: string;
  must_do: DailyTask[];
  optional: DailyTask[];
  focus_area: string;
  energy_level: number;
  motivation_message: string;
  estimated_total_time: number;
  completed_task_ids: string[];
  created_at: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  timeline_months: number;
  difficulty_curve: {
    month: number;
    difficulty: number;
    label: string;
  }[];
  success_probability: number;
  roi_score: number;
  cost_estimate: string;
  pros: string[];
  cons: string[];
  best_for: string;
}

export interface SimulationResult {
  id: string;
  user_id: string;
  scenarios: SimulationScenario[];
  recommendation: string;
  comparison_matrix: Record<string, {
    winner: string;
    difference: string;
  }>;
  created_at: string;
}

export interface Opportunity {
  id: string;
  user_id: string;
  type: 'exam' | 'job' | 'internship' | 'country' | 'university';
  title: string;
  description?: string;
  relevance_score: number;
  effort_required: 'low' | 'medium' | 'high';
  roi_estimate: string;
  deadline?: string;
  requirements?: Record<string, any>;
  is_saved: boolean;
  created_at: string;
}

export interface ChatResponse {
  message: string;
  intent?: IntentData;
  state?: CareerStateGraph;
  actions?: DailyActions;
}
