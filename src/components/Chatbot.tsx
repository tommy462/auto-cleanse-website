import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNationalPage } from '../lib/use-national-page';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const { isNational } = useNationalPage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm here to help answer your questions about AutoCleanse's DPF cleaning services. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to Make.com webhook
      const response = await fetch('https://hook.eu2.make.com/n26tel9eg2b5rzv9ejymj7kcs4nb4haa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          timestamp: new Date().toISOString(),
          sessionId: Date.now().toString(), // Simple session tracking
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponseText = data.response || data.message || "I received your message but couldn't generate a response. Please try again.";
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
      } else {
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    } catch (error) {
      console.error('Error sending message to API:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorResponse]);
    }
    
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // The assistant is set up for DPF questions and isn't held to the AdBlue
  // pages' no-prices rule, so those pages leave the contact to Call/WhatsApp.
  if (isNational) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 lg:bottom-6 w-14 h-14 gradient-orange rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Open chat"
      >
        <MessageCircle size={24} className="text-white" />
        
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)] h-[min(500px,calc(100dvh-10rem))] lg:inset-x-auto lg:right-6 lg:bottom-6 lg:w-96 lg:h-[500px] bg-[#0B0B0D] border border-[#1A1D22] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="gradient-orange p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">AutoCleanse AI</h3>
                <p className="text-white/80 text-xs">Ask me anything about our services</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-2 -m-2"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isUser ? 'bg-[#FF7A00]' : 'bg-[#1A1D22]'
                  }`}>
                    {message.isUser ? (
                      <User size={14} className="text-white" />
                    ) : (
                      <Bot size={14} className="text-[#FF7A00]" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.isUser 
                      ? 'bg-[#FF7A00] text-white' 
                      : 'bg-[#111317] border border-[#1A1D22] text-white'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-white/70' : 'text-white/50'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-6 h-6 bg-[#1A1D22] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-[#FF7A00]" />
                  </div>
                  <div className="bg-[#111317] border border-[#1A1D22] rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#FF7A00] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#FF7A00] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#FF7A00] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#1A1D22]">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our services..."
                className="flex-1 min-w-0 bg-[#111317] border border-[#1A1D22] focus:border-[#FF7A00] rounded-lg px-4 py-2 text-white text-base lg:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 transition-all"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 gradient-orange hover:gradient-orange-subtle disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all duration-300"
                aria-label="Send message"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-white/40">
              Automated answers, so they can be wrong: prices and bookings are only confirmed by us.
              Please don't share personal or payment details here.{' '}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-[#FF7A00]">Privacy</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;