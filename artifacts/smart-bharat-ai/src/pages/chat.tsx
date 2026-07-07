import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useListChatSessions, 
  useGetChatMessages, 
  useSendChatMessage, 
  useCreateChatSession 
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, User, Mic, Paperclip, MessageSquarePlus, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

const SUGGESTED_PROMPTS = [
  "How to apply for Passport?",
  "How to get Birth Certificate?",
  "How to renew Aadhaar?",
  "How to register voter ID?"
];

export default function ChatPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  const { data: sessions, isLoading: sessionsLoading } = useListChatSessions(
    { userId: user?.id || "" },
    { query: { enabled: !!user?.id, queryKey: ['/api/chat/sessions', { userId: user?.id }] } }
  );

  const { data: messages, isLoading: messagesLoading } = useGetChatMessages(
    activeSessionId || "",
    { query: { enabled: !!activeSessionId, queryKey: ['/api/chat/sessions', activeSessionId, 'messages'] } }
  );

  const createSession = useCreateChatSession();
  const sendMessage = useSendChatMessage();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMessage.isPending]);

  // Create first session if none exists when user types
  const handleSend = async (text: string) => {
    if (!text.trim() || sendMessage.isPending) return;

    setInputMessage(""); // Clear input early for better UX
    
    let currentSessionId = activeSessionId;

    // Create session if needed
    if (!currentSessionId) {
      const newSession = await createSession.mutateAsync({
        data: { userId: user!.id, title: text.substring(0, 30) + "..." }
      });
      currentSessionId = newSession.id;
      setActiveSessionId(currentSessionId);
      // Invalidate sessions list
      queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions'] });
    }

    // Send message
    await sendMessage.mutateAsync({
      data: {
        sessionId: currentSessionId,
        userId: user!.id,
        message: text,
      }
    });

    // Invalidate messages list
    queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions', currentSessionId, 'messages'] });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputMessage);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)] border rounded-xl overflow-hidden bg-background flex shadow-sm">
      
      {/* Sidebar - Chat History */}
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/20">
        <div className="p-4 border-b">
          <Button 
            className="w-full justify-start gap-2" 
            variant="outline"
            onClick={() => setActiveSessionId(null)}
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sessionsLoading ? (
              <div className="p-4 text-sm text-muted-foreground text-center">Loading...</div>
            ) : sessions?.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">No chat history</div>
            ) : (
              sessions?.map(session => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-left truncate ${
                    activeSessionId === session.id 
                      ? "bg-secondary text-foreground font-medium" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">{session.title}</span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Header */}
        <div className="h-14 border-b flex items-center px-4 justify-between bg-background/95 backdrop-blur z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Civic AI Assistant</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Powered by Gemini AI
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {!activeSessionId && (!messages || messages.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8">
              <div className="bg-primary/5 p-4 rounded-full">
                <Bot className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight mb-2">How can I help you today?</h3>
                <p className="text-muted-foreground">Ask me anything about Indian government services, schemes, or documents.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    className="h-auto py-3 px-4 justify-start text-left whitespace-normal hover:bg-primary/5 hover:border-primary/30"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4 max-w-3xl mx-auto w-full">
              <AnimatePresence initial={false}>
                {messages?.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    
                    <div className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-muted rounded-tl-sm prose dark:prose-invert prose-sm'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="whitespace-pre-wrap break-words">
                          {msg.content}
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                    
                    {msg.role === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {sendMessage.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 justify-start"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t">
          <div className="max-w-3xl mx-auto relative flex items-end gap-2">
            <div className="relative flex-1 bg-muted/50 focus-within:bg-background border rounded-2xl transition-colors shadow-sm focus-within:shadow-md focus-within:border-primary/50 overflow-hidden">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Civic AI..."
                className="w-full max-h-32 min-h-[52px] bg-transparent resize-none outline-none py-3.5 pl-4 pr-12 text-sm"
                rows={1}
              />
              <div className="absolute right-2 bottom-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button 
              size="icon" 
              className="h-12 w-12 rounded-full shrink-0" 
              disabled={!inputMessage.trim() || sendMessage.isPending}
              onClick={() => handleSend(inputMessage)}
            >
              <Send className="h-5 w-5 ml-0.5" />
            </Button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground">AI can make mistakes. Verify important civic information.</span>
          </div>
        </div>
      </div>
    </div>
  );
}