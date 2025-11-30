import React from 'react';
import { LayoutDashboard, FileEdit, CheckSquare, Calendar, Users, Settings, CircleDollarSign } from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItemClass = (isActive: boolean) => 
    `flex flex-col items-center justify-center py-4 px-2 cursor-pointer transition-colors duration-200 ${
      isActive 
        ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' 
        : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50'
    }`;

  return (
    <div className="w-24 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-20">
      <div className="h-16 flex items-center justify-center mb-4">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg transform -rotate-6">
          P
        </div>
      </div>

      <nav className="flex-1 flex flex-col space-y-1">
        <div className={menuItemClass(false)}>
          <LayoutDashboard size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1 font-medium">Work hub</span>
        </div>

        <div 
          className={menuItemClass(currentView === ViewMode.REGISTER)}
          onClick={() => onChangeView(ViewMode.REGISTER)}
        >
          <FileEdit size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1 font-medium">Register</span>
        </div>

        <div 
          className={menuItemClass(currentView === ViewMode.APPROVAL)}
          onClick={() => onChangeView(ViewMode.APPROVAL)}
        >
          <CheckSquare size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1 font-medium">Approval</span>
        </div>

        <div className={menuItemClass(false)}>
          <Calendar size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1 font-medium">Schedule</span>
        </div>

        <div className={menuItemClass(false)}>
          <CircleDollarSign size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1 font-medium">Fees</span>
        </div>
        
        <div className={menuItemClass(false)}>
          <Users size={24} strokeWidth={1.5} />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </div>
      </nav>
    </div>
  );
};