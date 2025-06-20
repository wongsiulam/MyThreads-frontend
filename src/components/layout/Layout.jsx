import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // 不显示导航栏的页面
  const hideNavigation = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {/* 主要内容区域 */}
      <main className={`${hideNavigation ? '' : 'pb-16'}`}>
        {children}
      </main>
      
      {/* 底部导航栏 */}
      {!hideNavigation && <Navigation />}
    </div>
  );
};

export default Layout;

