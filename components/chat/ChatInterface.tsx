'use client';

import { useChat } from '@/hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { IntentIndicator } from './IntentIndicator';

export function ChatInterface() {
  const { messages, isTyping, lastIntent, sendMessage } = useChat();

  return (
    <div className="flex flex-col h-full">
      {/* Intent Indicator */}
      {lastIntent && (
        <IntentIndicator intent={lastIntent} />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center mt-20">
            <div className="inline-block mb-6 animate-spin">
              <span className="text-4xl">✦</span>
            </div>
            <h2 className="text-3xl font-serif text-white mb-4">
              Hey there!
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              I&apos;m CareerOps, your AI Career Operating System. Tell me about your goals -
              GATE, MS, PSU, or anything else. I&apos;ll help you build a roadmap.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <ChatInput onSend={sendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}
