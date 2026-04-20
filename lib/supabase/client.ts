import { createClient } from '@supabase/supabase-js';
import type { User, ChatMessage, CareerStateGraph, Roadmap, DailyActions, SimulationResult, Opportunity } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth functions
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Chat functions
export async function saveChatMessage(message: Omit<ChatMessage, 'id'>) {
  const { data, error } = await supabase
    .from('chat_memory')
    .insert([message])
    .select()
    .single();
  return { data, error };
}

export async function getChatHistory(userId: string, sessionId?: string) {
  let query = supabase
    .from('chat_memory')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: true });

  if (sessionId) {
    query = query.eq('session_id', sessionId);
  }

  const { data, error } = await query;
  return { data, error };
}

// Career State functions
export async function getCareerState(userId: string): Promise<CareerStateGraph | null> {
  const { data, error } = await supabase
    .from('career_state_graph')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    // Return default state
    return {
      user_id: userId,
      nodes: [],
      edges: [],
      confidence_score: 0,
      last_updated: new Date().toISOString(),
    };
  }

  return data;
}

export async function saveCareerState(state: CareerStateGraph) {
  const { data, error } = await supabase
    .from('career_state_graph')
    .upsert([{
      ...state,
      last_updated: new Date().toISOString(),
    }])
    .select()
    .single();
  return { data, error };
}

// Roadmap functions
export async function getActiveRoadmap(userId: string): Promise<Roadmap | null> {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  return data;
}

export async function saveRoadmap(roadmap: Omit<Roadmap, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('roadmaps')
    .upsert([{
      ...roadmap,
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();
  return { data, error };
}

// Daily Actions functions
export async function getTodayActions(userId: string, date: string): Promise<DailyActions | null> {
  const { data, error } = await supabase
    .from('daily_actions')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  return data;
}

export async function saveDailyActions(actions: Omit<DailyActions, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('daily_actions')
    .upsert([actions])
    .select()
    .single();
  return { data, error };
}

// Opportunities functions
export async function getOpportunities(userId: string) {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('user_id', userId)
    .order('relevance_score', { ascending: false });
  return { data, error };
}

// Simulation functions
export async function saveSimulation(simulation: Omit<SimulationResult, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('simulations')
    .insert([simulation])
    .select()
    .single();
  return { data, error };
}
