import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot } from 'lucide-react';

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
    <div className="flex flex-col h-screen max-w-5xl mx-auto relative">
      {/* Floating Clouds */}
      <div className="absolute top-20 right-10 w-32 h-16 opacity-30 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-r from-cloud-cream/60 to-cloud-beige/40 rounded-full blur-sm"></div>
      </div>
      <div className="absolute top-40 left-5 w-24 h-12 opacity-20 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-r from-cloud-beige/50 to-cloud-cream/30 rounded-full blur-sm"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 backdrop-blur-glass border-b border-border/30 px-6 py-6 shadow-2xl">
        <div className="text-center mb-4">
          <div className="text-xs font-semibold text-accent tracking-wider uppercase mb-2">
            AWS Cloud Club PCU Cavite
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground text-3d mb-2 animate-pulse">
            CHAT WITH REIKA
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Your AI Assistant • Always Day 1 Energy ☁️
          </p>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 backdrop-blur-glass">
        {/* More floating cloud elements */}
        <div className="absolute top-10 right-20 w-20 h-10 opacity-15 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-r from-cloud-cream/40 to-cloud-beige/20 rounded-full blur-md"></div>
        </div>
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 message-enter ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'bot' && (
              <Avatar className="h-9 w-9 flex-shrink-0 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold border-2 border-accent/30">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={`message-bubble max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-5 py-4 shadow-2xl backdrop-blur-glass border-2 ${
                message.sender === 'user'
                  ? 'user-bubble cloud-border border-primary/30 bg-gradient-to-br from-primary to-accent text-primary-foreground'
                  : 'bot-bubble cloud-border border-border/30 bg-bot-bubble text-bot-bubble-foreground'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.text}</p>
              <div className={`text-xs mt-3 opacity-75 font-medium ${
                message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
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
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold border-2 border-accent/30">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="bot-bubble max-w-xs px-5 py-4 cloud-border shadow-2xl backdrop-blur-glass border-2 border-border/30 bg-bot-bubble">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">Reika is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 border-t border-border/20 backdrop-blur-glass p-6 shadow-2xl">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"></div>
        
        <div className="flex gap-4 max-w-4xl mx-auto">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about AWS Cloud Club PCU Cavite... ☁️"
            className="flex-1 chat-input cloud-border border-border/50 bg-input backdrop-blur-glass shadow-xl text-foreground placeholder:text-muted-foreground font-medium px-5 py-3 text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-button px-6 py-3 cloud-border text-primary-foreground border-0 shadow-xl bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300 hover:scale-105 active:scale-95 font-bold"
            size="sm"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground font-medium">
            🌤️ Reika specializes in AWS Cloud Club PCU Cavite • Always Day 1 Spirit
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;