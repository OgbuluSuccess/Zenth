import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer'; // Re-enable the Footer import

const AppLayout = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check window size to determine if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Helper function to check protected routes
  // eslint-disable-next-line no-unused-vars
  const isProtectedRoute = () => {
    const protectedPaths = ["/dashboard", "/portfolio", "/transactions", "/crypto", "/exchange", "/settings", "/admin/dashboard", "/admin/users", "/admin/content", "/admin/analytics", "/admin/system-config"]; // Added admin paths
    return protectedPaths.some(path => location.pathname.startsWith(path));
  };

  // Check if current route is the home page
  const isHomePage = () => {
    return location.pathname === '/' || location.pathname === '/home';
  };

  const isAdminRoute = () => {
    return location.pathname.startsWith('/admin');
  };

  // The isProtectedRoute function can be kept if used elsewhere, or removed if not.
  // For this layout logic, it's superseded by isAdminRoute and isLoggedIn.

  return (
    <div className="min-h-screen">
      {isLoggedIn ? (
        isHomePage() ? (
          // Home Page Layout (no sidebar even when logged in)
          <>
            <Header />
            <main className="bg-gray-50" style={{ overflowX: 'hidden' }}>
              {children}
            </main>
            <Footer />
          </>
        ) : isAdminRoute() ? (
          // Admin Layout
          <>
            <Sidebar 
              isCollapsed={isSidebarCollapsed} 
              setIsCollapsed={setIsSidebarCollapsed}
              isMobile={isMobile}
            />
            <main 
              className={`${isSidebarCollapsed ? 'ml-16' : 'ml-64'} bg-gray-50 min-h-screen transition-all duration-300`}
              style={{ overflowX: 'hidden' }}
            >
              {children}
            </main>
          </>
        ) : (
          // User Authenticated Layout (for non-home pages)
          <>
            <Sidebar 
              isCollapsed={isSidebarCollapsed} 
              setIsCollapsed={setIsSidebarCollapsed}
              isMobile={isMobile}
            />
            <div className={`${isSidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
              {/* Header removed from user dashboard as requested */}
              <main className="min-h-screen pt-4 px-6 bg-gray-50" style={{ overflowX: 'hidden' }}>
                {children}
              </main>
              {/* <Footer /> You can add a footer here if needed for authenticated user pages */}
            </div>
          </>
        )
      ) : (
        // Public Layout (for non-logged-in users)
        <>
          <Header />
          <main className="bg-gray-50" style={{ overflowX: 'hidden' }}>
            {children}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default AppLayout;
