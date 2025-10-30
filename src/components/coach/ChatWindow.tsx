import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, User, CheckCircle, Sparkles } from 'lucide-react';
import { ChatMessage } from '../../state/coach/types';

interface ChatWindowProps {
  messages: ChatMessage[];
  onAction: (actionId: string) => void;
  isTyping?: boolean;
}

const TypingDots: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 text-sm text-slate-500 py-2"
    >
      <div className="flex gap-1">
        <motion.div
          className="w-2 h-2 bg-blue-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-2 h-2 bg-blue-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-2 bg-blue-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <span>AI Coach is typing...</span>
    </motion.div>
  );
};

const MessageBubble: React.FC<{ 
  message: ChatMessage; 
  onAction: (actionId: string) => void;
  index: number;
}> = ({ message, onAction, index }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'AI':
        return <Brain size={16} className="text-blue-600" />;
      case 'SME':
        return <User size={16} className="text-slate-600" />;
      case 'SYSTEM':
        return <CheckCircle size={16} className="text-emerald-600" />;
      default:
        return null;
    }
  };

  const getBubbleStyles = (role: string) => {
    switch (role) {
      case 'AI':
        return 'bg-gradient-to-br from-[#F0F6FF] to-[#F9FBFF] border-[#E0E8F8] text-gray-700';
      case 'SME':
        return 'bg-white border-gray-200 text-gray-900';
      case 'SYSTEM':
        return 'bg-[#F9FAFB] text-gray-500 text-sm italic border-0';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const getContainerStyles = (role: string) => {
    switch (role) {
      case 'AI':
        return 'justify-start';
      case 'SME':
        return 'justify-end';
      case 'SYSTEM':
        return 'justify-center';
      default:
        return 'justify-start';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.25, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className={`flex ${getContainerStyles(message.role)} mb-4`}
    >
      <motion.div 
        className={`max-w-[80%] rounded-2xl border p-4 shadow-sm ${getBubbleStyles(message.role)}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-2 mb-2">
          {getRoleIcon(message.role)}
          <span className={`text-xs font-medium uppercase tracking-wide ${
            message.role === 'AI' ? 'text-blue-700' : 
            message.role === 'SME' ? 'text-gray-700' : 
            'text-gray-500'
          }`}>
            {message.role === 'SME' ? 'You' : message.role === 'AI' ? 'AI Coach' : 'System'}
          </span>
        </div>
        
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {message.text}
        </div>
        
        {message.actions && message.actions.length > 0 && (
          <motion.div 
            className="mt-3 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {message.actions.map((action) => (
              <motion.button
                key={action.id}
                onClick={() => onAction(action.id)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                {action.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onAction, isTyping = false }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <h3 className="font-semibold text-slate-900">AI Coach</h3>
          <Sparkles size={16} className="text-blue-500" />
        </div>
      </div>

      {/* Chat Content */}
      <div className="max-h-[420px] overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <motion.div 
              className="text-center text-slate-500 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Brain size={32} className="mx-auto mb-2 text-slate-400" />
              <p className="text-sm">AI Coach is ready to help refine your goal</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onAction={onAction}
                  index={index}
                />
              ))}
            </AnimatePresence>
          )}
          
          <TypingDots visible={isTyping} />
          <div ref={chatEndRef} />
        </div>
      </div>
    </motion.div>
  );
};
