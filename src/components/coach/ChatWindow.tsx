import React from 'react';
import { Brain, User, CheckCircle } from 'lucide-react';
import { ChatMessage } from '../../state/coach/types';

interface ChatWindowProps {
  messages: ChatMessage[];
  onAction: (actionId: string) => void;
}

const MessageBubble: React.FC<{ message: ChatMessage; onAction: (actionId: string) => void }> = ({ message, onAction }) => {
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
        return 'bg-blue-50 border-blue-200 text-slate-800';
      case 'SME':
        return 'bg-slate-100 border-slate-200 text-slate-800 ml-auto';
      case 'SYSTEM':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800 text-center';
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
    <div className={`flex ${getContainerStyles(message.role)} mb-4`}>
      <div className={`max-w-[80%] rounded-xl border p-4 shadow-sm ${getBubbleStyles(message.role)}`}>
        <div className="flex items-start gap-2 mb-2">
          {getRoleIcon(message.role)}
          <span className="text-xs font-medium uppercase tracking-wide">
            {message.role === 'SME' ? 'You' : message.role === 'AI' ? 'AI Coach' : 'System'}
          </span>
        </div>
        
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {message.text}
        </div>
        
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map((action) => (
              <button
                key={action.id}
                onClick={() => onAction(action.id)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onAction }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-h-96 overflow-y-auto">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <Brain size={32} className="mx-auto mb-2 text-slate-400" />
            <p className="text-sm">AI Coach is ready to help refine your goal</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onAction={onAction}
            />
          ))
        )}
      </div>
    </div>
  );
};
