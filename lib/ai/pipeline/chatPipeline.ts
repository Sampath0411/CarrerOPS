import { generateChatCompletion, generateTextCompletion } from '../providers/groq';
import { fetchCareerData, formatSearchResults } from '../webSearch';
import examResources from '@/lib/data/examResources.json';
import type { ChatMessage, IntentData, CareerStateGraph, StateChanges, DailyActions, ChatResponse } from '@/types';

// Types for exam resources
interface ExamResource {
  title: string;
  url: string;
  embedId?: string;
  description?: string;
  duration?: string;
  level?: string;
}

interface CareerPath {
  flowchart: Array<{
    step: number;
    title: string;
    description: string;
    timeline: string;
  }>;
  exams_required?: string[];
  avg_cost?: string;
  duration: string;
  skills?: string[];
}

// Get user's branch-specific GATE resources
function getGATEResources(branch: string): ExamResource | null {
  const branchMapping: Record<string, string> = {
    'CSE': 'Computer_Science',
    'IT': 'Computer_Science',
    'MECH': 'Mechanical_Engineering',
    'EEE': 'Electrical_Engineering',
    'ECE': 'Electrical_Engineering',
    'CIVIL': 'Civil_Engineering',
  };

  const key = branchMapping[branch] || 'Engineering_Mathematics';
  const resource = examResources.exam_resources.GATE_2026[key as keyof typeof examResources.exam_resources.GATE_2026];

  if (resource && typeof resource === 'object' && 'url' in resource) {
    return resource as ExamResource;
  }
  return null;
}

// Get exam resources by name
function getExamResources(examName: string): ExamResource[] {
  const key = examName.toUpperCase() as keyof typeof examResources.exam_resources;
  const resources = examResources.exam_resources[key];

  if (Array.isArray(resources)) {
    return resources as ExamResource[];
  }
  return [];
}

// Get career path flowchart
function getCareerPathFlowchart(path: string): CareerPath | null {
  const paths = examResources.career_paths;

  if (path.includes('MS') || path.includes('USA')) {
    return paths.higher_education.MS_USA as CareerPath;
  }
  if (path.includes('MBA')) {
    return paths.higher_education.MBA as CareerPath;
  }
  if (path.includes('GATE')) {
    return paths.higher_education.GATE as CareerPath;
  }
  if (path.includes('Web') || path.includes('Development')) {
    return paths.courses.Web_Development as CareerPath;
  }
  if (path.includes('Data') || path.includes('Science')) {
    return paths.courses.Data_Science as CareerPath;
  }

  return null;
}

// Intent Extraction Prompt - Enhanced for better organization
const INTENT_PROMPT = `You are CareerOps, an AI Career Operating System. Analyze the user's message and extract their intent.

Output JSON format:
{
  "intent_type": "goal_declaration" | "skill_update" | "exam_inquiry" | "roadmap_request" | "resource_request" | "general_chat",
  "entities": {
    "goals": ["MS", "MBA", "GATE", "Web Development", "Data Science"],
    "exams": ["GRE", "GATE", "CAT", "IELTS", "TOEFL"],
    "skills": ["Python", "JavaScript", "Machine Learning"],
    "branches": ["CSE", "ECE", "MECH"],
    "timeframes": ["2026", "next year"]
  },
  "confidence": 0.85,
  "requested_exam": "GRE",
  "requested_path": "MS_USA",
  "summary": "User wants GRE resources for MS in USA"
}

Analyze carefully and return ONLY valid JSON.`;

// Generate organized ChatGPT-style response
function generateOrganizedResponse(
  intent: IntentData,
  userProfile: { branch?: string; year?: number; cgpa?: number; learningPosition?: string },
  mode: 'courses' | 'higher-ed'
): { message: string; flowchart?: CareerPath; resources?: ExamResource[] } {
  const { intent_type, entities } = intent;

  let message = '';
  let flowchart: CareerPath | null = null;
  let resources: ExamResource[] = [];

  // Personalized greeting based on profile
  const branchGreeting = userProfile.branch
    ? `As a ${userProfile.year}${getOrdinal(userProfile.year)} year ${userProfile.branch} student`
    : '';

  // Handle exam resource requests
  if (intent_type === 'exam_inquiry' || entities?.exams?.length) {
    const exam = entities?.exams?.[0];

    if (exam) {
      message += `## ${exam} Preparation Resources\n\n`;

      if (exam === 'GATE' && userProfile.branch) {
        message += `${branchGreeting}, here are your branch-specific GATE resources:\n\n`;
        const gateResource = getGATEResources(userProfile.branch);
        if (gateResource) {
          resources.push(gateResource);
          message += `**${gateResource.title}**\n${gateResource.description}\n`;
        }
      } else {
        const examResources = getExamResources(exam);
        resources.push(...examResources.slice(0, 3));
        message += `Here are the top ${exam} preparation playlists:\n\n`;
        examResources.slice(0, 3).forEach((res, i) => {
          message += `${i + 1}. **${res.title}** - ${res.url}\n`;
          if (res.description) message += `   ${res.description}\n`;
          if (res.duration) message += `   ⏱️ ${res.duration}\n`;
        });
      }
    }
  }

  // Handle career path/roadmap requests
  if (intent_type === 'roadmap_request' || entities?.goals?.length) {
    const path = entities?.goals?.[0];

    if (path) {
      flowchart = getCareerPathFlowchart(path);

      if (flowchart) {
        message += `\n## ${path} Career Roadmap\n\n`;
        message += `**Duration:** ${flowchart.duration}\n`;
        if (flowchart.avg_cost) message += `**Investment:** ${flowchart.avg_cost}\n`;
        if (flowchart.exams_required && flowchart.exams_required.length > 0) {
          message += `**Required Exams:** ${flowchart.exams_required.join(', ')}\n`;
        }
        if (flowchart.skills && flowchart.skills.length > 0) {
          message += `**Skills:** ${flowchart.skills.join(', ')}\n`;
        }
        message += `\nHere's your step-by-step journey:\n\n`;

        flowchart.flowchart.forEach((step) => {
          message += `### Step ${step.step}: ${step.title}\n`;
          message += `${step.description}\n`;
          message += `⏱️ **Timeline:** ${step.timeline}\n\n`;
        });
      }
    }
  }

  // General guidance if no specific resources found
  if (!message) {
    message = `I'd be happy to help you with your career planning!\n\n`;

    if (mode === 'higher-ed') {
      message += `## Popular Paths for ${branchGreeting || 'Engineering Students'}:\n\n`;
      message += `### 1. **MS in USA/Canada**\n`;
      message += `   - Requires: GRE + TOEFL/IELTS\n`;
      message += `   - Duration: 2 years\n`;
      message += `   - Best for: Research-oriented careers\n\n`;

      message += `### 2. **MBA**\n`;
      message += `   - Requires: CAT/GMAT\n`;
      message += `   - Duration: 2 years\n`;
      message += `   - Best for: Management roles\n\n`;

      message += `### 3. **M.Tech via GATE**\n`;
      message += `   - Requires: GATE exam\n`;
      message += `   - Duration: 2 years\n`;
      message += `   - Best for: Technical specialization\n\n`;

      message += `*Which path interests you? I can provide detailed resources and a personalized roadmap.*`;
    } else {
      message += `## In-Demand Skills:\n\n`;
      message += `### 1. **Web Development**\n`;
      message += `   - Duration: 4-6 months\n`;
      message += `   - Skills: HTML, CSS, JavaScript, React\n\n`;

      message += `### 2. **Data Science**\n`;
      message += `   - Duration: 6 months\n`;
      message += `   - Skills: Python, ML, Statistics\n\n`;

      message += `### 3. **Cloud Computing**\n`;
      message += `   - Duration: 2-3 months\n`;
      message += `   - Skills: AWS/Azure, DevOps\n\n`;
    }
  }

  return { message, flowchart: flowchart || undefined, resources: resources.length > 0 ? resources : undefined };
}

// Helper for ordinal numbers
function getOrdinal(n?: number): string {
  if (!n) return 'th';
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

export async function processChatMessage(
  userId: string,
  message: string,
  history: ChatMessage[],
  mode: 'courses' | 'higher-ed' = 'courses',
  userProfile?: { branch?: string; year?: number; cgpa?: number; learningPosition?: string }
): Promise<ChatResponse & { flowchart?: CareerPath; resources?: ExamResource[] }> {
  try {
    // Step 1: Extract Intent
    const intentResponse = await generateChatCompletion([
      { role: 'system', content: INTENT_PROMPT },
      { role: 'user', content: `User message: "${message}"\nMode: ${mode}\n\nExtract intent and entities.` },
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

    // Step 2: Generate organized response with resources
    const organizedResponse = generateOrganizedResponse(intent, userProfile || {}, mode);

    // Step 3: Enhance with web search if needed
    let webContext = '';
    if (intent.intent_type === 'resource_request' || intent.intent_type === 'exam_inquiry') {
      const webResults = await fetchCareerData(mode, message);
      webContext = formatSearchResults(webResults);
    }

    // Step 4: Generate follow-up text with AI
    const followUpPrompt = `Based on this career guidance context, provide a brief encouraging follow-up (2-3 sentences):

User Profile: ${JSON.stringify(userProfile)}
Intent: ${intent.summary}
Resources provided: ${organizedResponse.resources?.length || 0}

Keep it friendly and actionable. Mention next steps.`;

    const followUp = await generateTextCompletion(followUpPrompt);

    // Combine responses
    const fullMessage = organizedResponse.message + '\n\n' + followUp;

    return {
      message: fullMessage,
      intent,
      flowchart: organizedResponse.flowchart,
      resources: organizedResponse.resources,
    };

  } catch (error) {
    console.error('Chat Pipeline Error:', error);
    return {
      message: 'I apologize, but I encountered an issue. Please try again.',
    };
  }
}
