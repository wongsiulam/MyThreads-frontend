import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, Heart, User } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/search', icon: Search, label: '搜索' },
    { path: '/create', icon: Plus, label: '发布' },
    { path: '/activity', icon: Heart, label: '活动' },
    { path: '/profile', icon: User, label: '个人' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-50 shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 rounded-xl mx-1 ${
                isActive
                  ? 'text-black bg-gray-100/80'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`transition-all duration-200 ${isActive ? 'scale-110' : 'hover:scale-105'}`}>
                <Icon 
                  size={22} 
                  className={`${isActive ? 'fill-current' : ''} transition-all duration-200`} 
                />
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                isActive ? 'opacity-100' : 'opacity-70'
              }`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

