'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  Send,
  Loader2,
  Bot,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore, type ChatMessage } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

export function ChatView() {
  const {
    user,
    selectedLesson,
    chatMessages,
    addChatMessage,
    setChatMessages,
    setView,
  } = useAppStore();
  const { toast } = useToast();

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history when chat view opens
  useEffect(() => {
    // Clear chat when switching lessons
    setChatMessages([]);
  }, [selectedLesson?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    // Add user message to UI
    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      userId: user?.id || '',
      lessonId: selectedLesson?.id || null,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setMessage('');

    // Resize textarea back
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || '',
          message: trimmed,
          lessonId: selectedLesson?.id || null,
          userLanguage: user?.language || 'Pidgin English',
        }),
      });

      const data = await res.json();

      if (res.ok && data.message) {
        const assistantMsg: ChatMessage = {
          id: data.message.id,
          userId: data.message.userId,
          lessonId: data.message.lessonId,
          role: data.message.role,
          content: data.message.content,
          createdAt: data.message.createdAt,
        };
        addChatMessage(assistantMsg);
      } else {
        toast({
          title: 'AI response failed',
          description: data.error || 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Connection error',
        description: 'Could not reach the AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
      // Focus textarea
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('lesson')}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium text-sm">AI Tutor</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setChatMessages([])}
            title="Clear chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto max-h-96 sm:max-h-none custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {chatMessages.length === 0 && (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-4"
              >
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
              <h2 className="text-lg font-bold mb-1">Ask Me Anything</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {selectedLesson
                  ? `Ask questions about "${selectedLesson.title}" and I'll explain in ${user?.language || 'your language'}.`
                  : 'I can help you understand any subject in your preferred language.'}
              </p>
            </div>
          )}

          <AnimatePresence>
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 mb-4 ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  ) : (
                    <div className="text-sm chat-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isSending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 mb-4"
            >
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0.1s]" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Ask a question..."
              value={message}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              rows={1}
              className="min-h-[40px] max-h-[120px] resize-none rounded-xl"
            />
            <Button
              size="icon"
              className="h-10 w-10 rounded-xl shrink-0"
              onClick={handleSend}
              disabled={!message.trim() || isSending}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 text-center">
            AI may make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
