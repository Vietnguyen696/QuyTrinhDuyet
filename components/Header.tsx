import React from 'react';
import { Search, ChevronDown, Bell, User, LayoutDashboard, Menu } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  title: string;
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ title, currentView, onChangeView }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg text-blue-700">
           <Menu size={24} />
        </button>
        <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h1>
        </div>
      </div>
      
      {/* Central Toggle Switch */}
      <div className="flex items-center bg-gray-100 p-1 rounded-lg">
        <button 
          onClick={() => onChangeView(ViewMode.REGISTER)}
          className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            currentView === ViewMode.REGISTER 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User size={16} />
          <span>Cá nhân</span>
        </button>
        <button 
          onClick={() => onChangeView(ViewMode.APPROVAL)}
          className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            currentView === ViewMode.APPROVAL 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutDashboard size={16} />
          <span>Phê duyệt</span>
        </button>
      </div>

      <div className="flex items-center space-x-5">
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Tìm kiếm (⌘ + K)" 
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-64 transition-all hover:bg-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>

        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
        </button>

        <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded-full transition-colors pr-2">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
            QP
          </div>
        </div>
      </div>
    </header>
  );
};