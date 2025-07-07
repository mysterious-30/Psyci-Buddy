'use client';
import { useState, useEffect } from 'react';
import { ChatMessage } from '../types';
import ChatMessageComponent from './ChatMessage';
import ChatInput from './ChatInput';

const INITIAL_GREETING = "Hi, I'm Psyci Buddy! How are you feeling today?";

async function fetchAIResponse(history: { role: string, text: string }[]): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history }),
    });
    if (!res.ok) {
      throw new Error('AI service error');
    }
    const data = await res.json();
    return data.text || 'Sorry, I could not generate a response.';
  } catch (err) {
    return 'Sorry, I could not connect to the AI service.';
  }
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Send the first bot message on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now() + '-psyci-welcome',
          sender: 'psyci',
          content: INITIAL_GREETING,
          timestamp: Date.now(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now() + '-user',
      sender: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(async () => {
      // Send initial greeting and user message as history
      const history = [
        { role: 'psyci', text: INITIAL_GREETING },
        { role: 'user', text: content }
      ];
      const aiText = await fetchAIResponse(history);
      const psyciMsg: ChatMessage = {
        id: Date.now() + '-psyci',
        sender: 'psyci',
        content: aiText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, psyciMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="glass rounded-2xl shadow-2xl p-3 sm:p-6 md:p-8 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex flex-col animate-fade-in-up border border-background">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 transition-all duration-500">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center py-8 animate-fade-in">
            Start a conversation with Psyci Buddy!
          </div>
        )}
        {messages.map(msg => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-white border border-background">P</div>
            <span className="text-accent">Psyci Buddy is typing...</span>
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
} 