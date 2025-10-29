import React from 'react';
import { Bell, MessageSquare, CircleDollarSign, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { useAppStore } from '../../state/store';
import { Persona } from '../../state/types';
import { useNavigate, useLocation } from 'react-router-dom';

const SmartGrantLogo = () => (
  <svg width="28" height="28" viewBox="0 0 54 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M27 51.5L0.5 0.5H53.5L27 51.5Z" fill="black" stroke="#FBBF24"/>
    <path d="M27 51.5L0.5 0.5H27V51.5Z" fill="#FBBF24"/>
    <path d="M27 26L53.5 0.5H27V26Z" fill="#D97706"/>
    <path d="M13.5 26L27 0.5H0.5L13.5 26Z" fill="#111827"/>
    <path d="M40.5 26L27 51.5L53.5 0.5L40.5 26Z" fill="#111827"/>
  </svg>
);

const RoleButton: React.FC<{ role: Persona; isActive: boolean; onClick: () => void }> = ({ role, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-sm' 
        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
    }`}
  >
    {role.charAt(0) + role.slice(1).toLowerCase()}
  </button>
);

const NavTab: React.FC<{ tabId: string; label: string; icon: React.ElementType; isActive: boolean; onClick: () => void }> = ({ label, icon: Icon, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
      isActive 
        ? 'border-blue-500 text-blue-600' 
        : 'border-transparent text-slate-500 hover:text-slate-700'
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

export const Header: React.FC = () => {
  const { currentPersona, setCurrentPersona } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const personas: Persona[] = ['SME', 'CONSULTANT', 'VENDOR'];

  return (
    <>
      <header className="bg-white sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <SmartGrantLogo />
          <h1 className="hidden sm:block text-xl font-bold text-slate-800">
            SmartGrant.ai
          </h1>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {personas.map(role => (
            <RoleButton
              key={role}
              role={role}
              isActive={currentPersona === role}
              onClick={() => setCurrentPersona(role)}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
            <Bell size={20}/>
          </button>
          <button className="p-2 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
            <MessageSquare size={20}/>
          </button>
          <button className="p-2 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
            <CircleDollarSign size={20}/>
          </button>
          <img 
            src={`https://i.pravatar.cc/40?u=${currentPersona}`} 
            alt="User Avatar" 
            className="w-10 h-10 rounded-full border-2 border-transparent hover:border-indigo-500" 
          />
        </div>
      </header>
      
      {(currentPersona === 'CONSULTANT' || currentPersona === 'VENDOR') && (location.pathname === '/dashboard' || location.pathname === '/leads') && (
        <div className="flex items-center border-b border-slate-200">
          <NavTab 
            tabId="dashboard" 
            label="Dashboard" 
            icon={LayoutDashboard} 
            isActive={location.pathname === '/dashboard'} 
            onClick={() => navigate('/dashboard')} 
          />
          <NavTab 
            tabId="leads" 
            label="Lead Marketplace" 
            icon={ShoppingCart} 
            isActive={location.pathname === '/leads'} 
            onClick={() => navigate('/leads')} 
          />
        </div>
      )}
    </>
  );
};
