import { generateChatCompletion, generateTextCompletion } from '../providers/groq';
import type { ChatMessage, IntentData, CareerStateGraph, StateChanges, DailyActions, ChatResponse } from '@/types';

// Intent Extraction Prompt
const INTENT_PROMPT = `You are an AI Career Assistant. Extract the user's intent and entities from their message.

Output JSON format:
{
  "intent_type": "goal_declaration" | "skill_update" | "interest_change" | "constraint_add" | "roadmap_request" | "simulation_request" | "action_request" | "clarification" | "general_chat",
  "entities": {
    "goals": ["GATE", "MS", "PSU", "CAT", "GRE"],
    "skills": ["Python", "Signals", "Aptitude"],
    "countries": ["USA", "Germany", "India"],
    "exams": ["GRE", "TOEFL", "IELTS"],
    "timeframes": ["2025", "next year"],
    "numbers": ["8.5 CGPA", "2 years"]
  },
  "confidence": 0.85,
  "state_affected": ["goals", "skills"],
  "summary": "User wants to pursue MS in USA by 2025"
}

Analyze carefully and return ONLY valid JSON.`;

// State Update Prompt
const STATE_PROMPT = `You are updating a Career State Graph. Based on the extracted intent, determine what changes to make.

Current graph structure:
- nodes: goals, skills, interests, constraints
- edges: prerequisite, influence relationships

Output JSON format:
{
  "changes": {
    "added": ["goal_ms_usa"],
    "updated": [],
    "removed": [],
    "edges_added": ["skill_python -> goal_ms_usa"]
  },
  "confidence_delta": 5,
  "new_confidence_score": 72
}

Return ONLY valid JSON.`;

// Action Generation Prompt
const ACTION_PROMPT = `Generate daily tasks based on the user's career state and roadmap.

Output JSON format:
{
  "must_do": [
    {
      "id": "task_001",
      "title": "Complete GRE Quant Section 3",
      "type": "study",
      "estimated_minutes": 60,
      "impact": "high"
    }
  ],
  "optional": [
    {
      "id": "task_002",
      "title": "Connect with alumni",
      "type": "networking",
      "estimated_minutes": 20,
      "impact": "low"
    }
  ],
  "focus_area": "GRE Quant - Algebra",
  "motivation_message": "You're 40% through your roadmap!",
  "estimated_total_time": 90
}

Return ONLY valid JSON.`;

export async function processChatMessage(
  userId: string,
  message: string,
  history: ChatMessage[]
): Promise<ChatResponse> {
  try {
    // Step 1: Extract Intent
    const intentResponse = await generateChatCompletion([
      { role: 'system', content: INTENT_PROMPT },
      { role: 'user', content: `User message: "${message}"\n\nExtract intent and entities.` },
    ]);

    let intent: IntentData;
    try {
      intent = JSON.parse(intentResponse);
    } catch {
      intent = {
        intent_type: 'general_chat',
        entities: {},
        confidence: 0.5,
        state_affected: [],
        summary: message,
      };
    }

    // Step 2: Update State Graph
    const stateResponse = await generateChatCompletion([
      { role: 'system', content: STATE_PROMPT },
      {
        role: 'user',
        content: `Intent: ${JSON.stringify(intent)}\nUser message: "${message}"\n\nDetermine state changes.`,
      },
    ]);

    let stateChanges: StateChanges;
    try {
      const parsed = JSON.parse(stateResponse);
      stateChanges = parsed.changes || { added: [], updated: [], removed: [], edges_added: [] };
    } catch {
      stateChanges = { added: [], updated: [], removed: [], edges_added: [] };
    }

    // Step 3: Generate AI Response
    const responsePrompt = `You are CareerOps, an AI Career Operating System. The user said: "${message}"

Intent: ${intent.summary}

Provide a helpful, conversational response that:
1. Acknowledges their intent
2. Asks follow-up questions if needed
3. Suggests next steps

Be encouraging and specific. Keep it under 150 words.`;

    const aiResponse = await generateTextCompletion(responsePrompt);

    // Step 4: Generate Actions (if relevant)
    let actions: DailyActions | undefined;
    if (
      intent.intent_type === 'action_request' ||
      intent.intent_type === 'roadmap_request' ||
      intent.state_affected.length > 0
    ) {
      const actionResponse = await generateChatCompletion([
        { role: 'system', content: ACTION_PROMPT },
        { role: 'user', content: `User intent: ${intent.summary}\n\nGenerate daily tasks.` },
      ]);

      try {
        const actionData = JSON.parse(actionResponse);
        actions = {
          id: `actions_${Date.now()}`,
          user_id: userId,
          date: new Date().toISOString().split('T')[0],
          must_do: actionData.must_do.map((t: any) => ({ ...t, completed: false })),
          optional: actionData.optional.map((t: any) => ({ ...t, completed: false })),
          focus_area: actionData.focus_area,
          energy_level: 3,
          motivation_message: actionData.motivation_message,
          estimated_total_time: actionData.estimated_total_time,
          completed_task_ids: [],
          created_at: new Date().toISOString(),
        };
      } catch {
        // Actions generation failed, continue without
      }
    }

    return {
      message: aiResponse,
      intent,
      actions,
    };
  } catch (error) {
    console.error('Chat Pipeline Error:', error);
    return {
      message: 'I apologize, but I encountered an issue processing your message. Please try again.',
    };
  }
}
