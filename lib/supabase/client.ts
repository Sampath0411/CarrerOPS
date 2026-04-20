import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { User, ChatMessage, CareerStateGraph, Roadmap, DailyActions, SimulationResult, Opportunity } from '@/types';

// Lazy initialization - only create client when needed
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') {
    // Server-side - check env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    if (!supabaseInstance) {
      supabaseInstance = createClient(supabaseUrl, supabaseKey);
    }
    return supabaseInstance;
  }

  // Client-side - use window check or existing instance
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not found. Database features disabled.');
      return null;
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
}

// Auth functions
export async function signUp(email: string, password: string, name: string) {
  const client = getSupabase();
  if (!client) return { data: null, error: new Error('Supabase not configured') };

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const client = getSupabase();
  if (!client) return { data: null, error: new Error('Supabase not configured') };

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const client = getSupabase();
  if (!client) return { error: new Error('Supabase not configured') };

  const { error } = await client.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const client = getSupabase();
  if (!client) return null;

  const { data: { user } } = await client.auth.getUser();
  return user;
}

// Chat functions
export async function saveChatMessage(message: Omit<ChatMessage, 'id'>) {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not configured, message not saved');
    return { data: null, error: null };
  }

  const { data, error } = await client
    .from('chat_memory')
    .insert(message)
    .select()
    .single();
  return { data, error };
}

export async function getChatHistory(userId: string, sessionId?: string) {
  const client = getSupabase();
  if (!client) return { data: null, error: new Error('Supabase not configured') };

  let query = client
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
  const client = getSupabase();
  if (!client) {
    // Return default state without database
    return {
      user_id: userId,
      nodes: [],
      edges: [],
      confidence_score: 0,
      last_updated: new Date().toISOString(),
    };
  }

  const { data, error } = await client
    .from('career_state_graph')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
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
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not configured, state not saved');
    return { data: null, error: null };
  }

  const { data, error } = await client
    .from('career_state_graph')
    .upsert(state)
    .select()
    .single();
  return { data, error };
}

// Roadmap functions
export async function getActiveRoadmap(userId: string): Promise<Roadmap | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('roadmaps')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  return data;
}

export async function saveRoadmap(roadmap: Omit<Roadmap, 'id' | 'created_at' | 'updated_at'>) {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not configured, roadmap not saved');
    return { data: null, error: null };
  }

  const { data, error } = await client
    .from('roadmaps')
    .upsert(roadmap)
    .select()
    .single();
  return { data, error };
}

// Daily Actions functions
export async function getTodayActions(userId: string, date: string): Promise<DailyActions | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('daily_actions')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  return data;
}

export async function saveDailyActions(actions: Omit<DailyActions, 'id' | 'created_at'>) {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not configured, actions not saved');
    return { data: null, error: null };
  }

  const { data, error } = await client
    .from('daily_actions')
    .upsert(actions)
    .select()
    .single();
  return { data, error };
}

// Opportunities functions
export async function getOpportunities(userId: string) {
  const client = getSupabase();
  if (!client) return { data: null, error: new Error('Supabase not configured') };

  const { data, error } = await client
    .from('opportunities')
    .select('*')
    .eq('user_id', userId)
    .order('relevance_score', { ascending: false });
  return { data, error };
}

// Simulation functions
export async function saveSimulation(simulation: Omit<SimulationResult, 'id' | 'created_at'>) {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not configured, simulation not saved');
    return { data: null, error: null };
  }

  const { data, error } = await client
    .from('simulations')
    .insert(simulation)
    .select()
    .single();
  return { data, error };
}
