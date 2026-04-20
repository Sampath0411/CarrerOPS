import { NextRequest, NextResponse } from 'next/server';
import { processChatMessage } from '@/lib/ai/pipeline/chatPipeline';
import { saveChatMessage } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, userId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Process the chat message
    const result = await processChatMessage(
      userId || 'guest',
      message,
      []
    );

    // Save messages to database (if user is authenticated)
    if (userId) {
      await saveChatMessage({
        user_id: userId,
        role: 'user',
        content: message,
        session_id: sessionId || 'default',
        timestamp: new Date().toISOString(),
      });

      await saveChatMessage({
        user_id: userId,
        role: 'assistant',
        content: result.message,
        extracted_intent: result.intent,
        session_id: sessionId || 'default',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
