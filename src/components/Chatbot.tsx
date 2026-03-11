import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
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

  const faqResponses: Record<string, string> = {
    'pricing': 'Our pricing is straightforward: £210 within 30 miles of Totnes, £230 outside 30 miles, and £320 for HGV/Plant vehicles. Labour costs for replacements start at £150+.',
    'turnaround': 'We offer same-day return within 30 miles of Totnes when your filter is ready for collection before 10am on weekdays. Outside this area, typical turnaround is 24-48 hours.',
    'area': 'We cover a 30-mile radius from Totnes, Devon, which includes most of South Devon and parts of Cornwall. We also provide nationwide coverage with courier services.',
    'services': 'We clean DPF, SCR, DOC, GPF, OPF, EGR systems, intercoolers, radiators, and catalytic converters. All services include comprehensive testing and detailed reporting.',
    'testing': 'We conduct comprehensive flow and back-pressure testing before and after cleaning. All results are documented in detailed reports for your records.',
    'trade': 'Yes, we offer trade accounts with preferential terms for regular customers. We work exclusively with trade professionals including garages, fleet operators, and plant machinery businesses.',
    'collection': 'We offer free pickup and delivery within our service area. Courier collection is also available - contact us for options and pricing.',
    'process': 'Our 6-step process includes: enquiry & collection, inspection & pre-test, professional cleaning, hot air drying, flow testing & reporting, and same-day return.',
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('price') || message.includes('cost') || message.includes('£')) {
      return faqResponses.pricing;
    }
    if (message.includes('time') || message.includes('quick') || message.includes('fast') || message.includes('same day')) {
      return faqResponses.turnaround;
    }
    if (message.includes('area') || message.includes('location') || message.includes('totnes') || message.includes('devon')) {
      return faqResponses.area;
    }
    if (message.includes('service') || message.includes('dpf') || message.includes('clean')) {
      return faqResponses.services;
    }
    if (message.includes('test') || message.includes('report') || message.includes('flow')) {
      return faqResponses.testing;
    }
    if (message.includes('trade') || message.includes('account') || message.includes('garage')) {
      return faqResponses.trade;
    }
    if (message.includes('collect') || message.includes('pickup') || message.includes('delivery')) {
      return faqResponses.collection;
    }
    if (message.includes('process') || message.includes('how') || message.includes('work')) {
      return faqResponses.process;
    }
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return "Hello! I'm here to help with any questions about our DPF cleaning services. You can ask me about pricing, turnaround times, service areas, or our cleaning process.";
    }
    if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return "You can contact us by phone or email. Visit our Contact page for full details, or use the call buttons throughout the site to get in touch directly.";
    }
    
    return "I'd be happy to help! You can ask me about our pricing, turnaround times, service areas, cleaning process, or any other questions about our DPF refurbishment services.";
  };

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

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 gradient-orange rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 ${
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
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#0B0B0D] border border-[#1A1D22] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
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
              className="text-white/80 hover:text-white transition-colors"
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
                className="flex-1 bg-[#111317] border border-[#1A1D22] focus:border-[#FF7A00] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 transition-all"
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
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;