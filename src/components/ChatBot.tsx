import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Reika, your AWS Cloud Club PCU Cavite assistant! 👋 I'm here to help answer questions about our club activities, events, and resources. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual Lambda endpoint
      // const response = await fetch('YOUR_LAMBDA_ENDPOINT_HERE', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: userMessage.text }),
      // });
      // const data = await response.json();

      // Placeholder response logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      let botResponse = "I can only answer questions about AWS Cloud Club PCU Cavite and our activities 😊";
      
      // Simple keyword detection for demo purposes
      const message = userMessage.text.toLowerCase();
      if (message.includes('cloud') || message.includes('aws') || message.includes('club') || 
          message.includes('event') || message.includes('activity') || message.includes('meeting')) {
        botResponse = "Great question! As your AWS Cloud Club assistant, I'd love to help you with that. Our club focuses on cloud computing education, hands-on workshops, and AWS certification preparation. What specific aspect would you like to know more about?";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later! 🔧",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Floating Clouds - Clean and Natural */}
      <div className="floating-clouds">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
      </div>

      {/* Compact Chat Container */}
      <div className="w-full max-w-4xl h-[70vh] flex flex-col chat-glass rounded-3xl overflow-hidden relative z-10">
        {/* Header */}
        <header className="backdrop-blur-glass border-b border-border/20 px-6 py-6 flex-shrink-0 premium-glow chat-header">
          <div className="text-center">
            <div className="text-xs font-bold text-header-contrast tracking-wider uppercase mb-3 animate-pulse">
              ☁️ AWS Cloud Club PCU Cavite ☁️
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-header-contrast text-3d-enhanced mb-3 tracking-wide">
              CHAT WITH REIKA
            </h1>
            <p className="text-sm text-header-contrast font-semibold tracking-wide opacity-90">
              Your AI Assistant • Always Day 1 Energy ⚡
            </p>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative chat-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 message-enter ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-9 w-9 flex-shrink-0 shadow-lg">
                  <AvatarImage src="/lovable-uploads/ee65b2f7-ce00-46ca-9e95-9182b72dbb49.png" alt="AWS Cloud Club PCU Cavite" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold border-2 border-accent/30">
                    R
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`message-bubble max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-5 py-4 cloud-bubble backdrop-filter backdrop-blur-sm ${
                  message.sender === 'user'
                    ? 'user-bubble-enhanced border border-primary/20'
                    : 'bot-bubble-enhanced border border-border/20'
                }`}
              >
                <p className={`text-sm leading-relaxed whitespace-pre-wrap font-medium ${
                  message.sender === 'user' ? 'text-user-contrast' : 'text-readable-dark'
                }`}>
                  {message.text}
                </p>
                <div className={`text-xs mt-3 font-medium ${
                  message.sender === 'user' ? 'text-user-contrast opacity-80' : 'text-timestamp'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {message.sender === 'user' && (
                <Avatar className="h-9 w-9 flex-shrink-0 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-secondary-foreground text-sm font-bold border-2 border-secondary/30">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 justify-start message-enter">
              <Avatar className="h-9 w-9 flex-shrink-0 shadow-lg">
                <AvatarImage src="/lovable-uploads/ee65b2f7-ce00-46ca-9e95-9182b72dbb49.png" alt="AWS Cloud Club PCU Cavite" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold border-2 border-accent/30">
                  R
                </AvatarFallback>
              </Avatar>
              <div className="max-w-xs px-5 py-4 cloud-bubble bot-bubble-enhanced border border-border/20 backdrop-filter backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-readable-medium font-medium">Reika is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="backdrop-blur-glass border-t border-border/15 p-6 flex-shrink-0 relative premium-glow chat-input-area">
          {/* Enhanced cloud-like decorative border */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-3 bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full blur-sm opacity-80"></div>
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full blur-xs"></div>
          
          <div className="flex gap-4">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about AWS Cloud Club PCU Cavite... ☁️"
              className="flex-1 cloud-input font-medium px-6 py-4 text-sm focus:ring-2 focus:ring-accent/60 focus:border-accent/60 transition-all duration-300 hover:shadow-lg focus:shadow-xl"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-4 cloud-border text-white border-2 border-white/30 shadow-2xl bg-gradient-to-r from-primary via-accent to-primary hover:from-accent hover:via-primary hover:to-accent transition-all duration-300 hover:scale-105 active:scale-95 font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] premium-glow ring-2 ring-white/20"
              size="sm"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-header-contrast opacity-75 font-semibold tracking-wide">
              ⚡ Reika specializes in AWS Cloud Club PCU Cavite • Always Day 1 Spirit ⚡
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;