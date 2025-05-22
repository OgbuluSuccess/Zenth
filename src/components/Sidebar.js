import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile }) => {
  const location = useLocation();
  const { user, logoutUser } = useAuth();

  // Check if a nav item is active
  const isActive = (path) => location.pathname === path;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0];
  };

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Define menu items and logic outside of the return statement
  const regularUserNavItems = useMemo(() => [
    { title: 'Dashboard', path: '/dashboard', icon: 'fa-th-large' },
    { title: 'My Portfolio', path: '/my-investments', icon: 'fa-briefcase' },
    { title: 'Transactions', path: '/transactions', icon: 'fa-exchange-alt' },
    { title: 'Crypto', path: '/crypto', icon: 'fa-bitcoin' },
    { title: 'Exchange', path: '/exchange', icon: 'fa-chart-line' },
  ], []);

  const adminNavItems = useMemo(() => [
    { title: 'Admin Dashboard', path: '/admin/dashboard', icon: 'fa-tachometer-alt' },
    { title: 'User Management', path: '/admin/users', icon: 'fa-users-cog' },
    { title: 'Investment Plans', path: '/admin/investment-plans', icon: 'fa-money-bill-wave' },
    { title: 'Referral Settings', path: '/admin/referral-settings', icon: 'fa-users' },
    { title: 'Money Transfer', path: '/admin/money-transfer', icon: 'fa-dollar-sign' },
  ], []);

  const superAdminNavItems = useMemo(() => [
    { title: 'Platform Analytics', path: '/admin/analytics', icon: 'fa-chart-pie' }, // Example
    { title: 'System Configuration', path: '/admin/system-config', icon: 'fa-cogs' }, // Example
  ], []);

  const getMenuItems = (role, logoutHandler) => {
    let mainNav = [];
    const settingsNav = [
      { title: 'Settings', path: '/settings', icon: 'fa-cog' },
      { title: 'Logout', icon: 'fa-sign-out-alt', onClick: logoutHandler },
    ];

    if (role === 'superadmin') {
      mainNav = [...adminNavItems, ...superAdminNavItems];
    } else if (role === 'admin') {
      mainNav = adminNavItems;
    } else { // 'user' or default
      mainNav = regularUserNavItems;
    }
    return { mainNav, settingsNav };
  };

  const { mainNav, settingsNav } = useMemo(() => getMenuItems(user?.role, logoutUser), [user?.role, logoutUser, adminNavItems, superAdminNavItems, regularUserNavItems]);

  const renderMenuItems = (items) => items.map((item, index) => (
    <li key={item.title + index} className="px-2 mb-1">
      {item.path ? (
        <Link
          to={item.path}
          className={`flex items-center ${isCollapsed ? 'justify-center' : ''} p-3 rounded-lg transition-colors ${
            isActive(item.path)
              ? `bg-white/10 text-white ${!isCollapsed ? 'border-l-4 border-secondary pl-2' : ''}`
              : 'text-white/80 hover:bg-white/10'
          }`}
          title={item.title}
        >
          <div className={`${isCollapsed ? 'flex items-center justify-center w-full' : 'w-5 mr-3'}`}>
            <i className={`fa ${item.icon} text-lg`}></i>
          </div>
          {!isCollapsed && <span>{item.title}</span>}
        </Link>
      ) : (
        <a
          onClick={item.onClick}
          className={`flex items-center ${isCollapsed ? 'justify-center' : ''} p-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors cursor-pointer`}
          title={item.title}
        >
          <div className={`${isCollapsed ? 'flex items-center justify-center w-full' : 'w-5 mr-3'}`}>
            <i className={`fa ${item.icon} text-lg`}></i>
          </div>
          {!isCollapsed && <span>{item.title}</span>}
        </a>
      )}
    </li>
  ));

  return (
    <div 
      className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-primary fixed left-0 top-0 text-white flex flex-col shadow-lg z-10 transition-all duration-300 overflow-hidden`} 
      style={{ minWidth: isCollapsed ? '85px' : '26px' }}
    >
      {/* Logo and Toggle */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="./" className="flex items-center justify-center">
            <img src="/img/core-img/logo.png" alt="Zynith" className="w-8 h-8" />
          </Link>
          {!isCollapsed && <span className="text-xl font-bold ml-3">Zynith</span>}
        </div>
        <button 
          onClick={toggleSidebar} 
          className="text-white hover:bg-white/10 p-1 rounded-md"
        >
          <i className={`fa ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-base`}></i>
        </button>
      </div>

      {/* Navigation */}
      <div className="py-4 flex-1 overflow-y-auto scrollbar-hide">
        {!isCollapsed && <div className="text-xs uppercase text-white/50 mb-4 mt-2 px-4">Navigation</div>}
        <ul>
          {renderMenuItems(mainNav)}
        </ul>

        {!isCollapsed && <div className="text-xs uppercase text-white/50 mb-4 mt-4 px-4">Settings</div>}
        <ul>
          {renderMenuItems(settingsNav)}
        </ul>
      </div>
      
      {/* User Section */}
      <div className={`p-4 border-t border-white/10 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold" title={user?.name || 'User'} style={{ marginRight: isCollapsed ? '0' : '0.75rem' }}>
          {getUserInitials()}
        </div>
        {!isCollapsed && (
          <div>
            <div className="text-sm font-bold">{user?.name || 'User'}</div>
            <div className="text-xs text-white/60">Investor</div>
          </div>
        )}
      </div>
      
      {/* Mobile Toggle Button - Fixed at bottom right when sidebar is collapsed on mobile */}
      {isMobile && isCollapsed && (
        <button 
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg z-50 hover:bg-primary-dark transition-colors"
        >
          <i className="fa fa-bars"></i>
        </button>
      )}
    </div>
  );
};

export default Sidebar;
