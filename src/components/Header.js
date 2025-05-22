import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Custom inline styles for the header
const headerStyles = {
  headerArea: {
    background: '#192a56',
    backgroundImage: 'linear-gradient(to right, #192a56, #1c2e59)',
    width: '100%',
    position: 'relative',
    zIndex: 100
  },
  navContainer: {
    backgroundColor: 'transparent'
  },
  navBrand: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px'
  },
  navBrandImg: {
    maxHeight: '40px',
    marginRight: '10px'
  },
  navLink: {
    color: 'white'
  },
  navbarToggler: {
    cursor: 'pointer'
  },
  togglerSpan: {
    backgroundColor: 'white',
    display: 'block',
    height: '3px',
    width: '22px',
    marginBottom: '4px'
  },
  loginBtn: {
    color: 'white',
    fontWeight: 600,
    padding: '0 15px',
    borderRadius: '30px',
    backgroundImage: 'linear-gradient(to right, #21d397 0%, #7450fe 100%)',
    height: '45px',
    lineHeight: '45px',
    marginLeft: '30px',
    display: 'inline-block'
  }
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logoutUser } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if current route is a protected route
  const isProtectedRoute = () => {
    const protectedPaths = ["/dashboard", "/portfolio"];
    return protectedPaths.some(path => location.pathname.startsWith(path));
  };
  
  // Determine if navigation menu should be hidden
  const shouldHideNavMenu = isLoggedIn && isProtectedRoute();

  // Handle scroll event to make header sticky
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
        document.body.classList.add('has-sticky-header');
      } else {
        setIsSticky(false);
        document.body.classList.remove('has-sticky-header');
      }
    };

    // Check scroll position on initial load
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    {/* ##### Header Area Start ##### */}
    <header className={`header-area wow fadeInDown ${isSticky ? 'sticky' : ''}`} data-wow-delay="0.2s" style={headerStyles.headerArea}>
      <div className="classy-nav-container breakpoint-off" style={headerStyles.navContainer}>
        <div className="container">
          {/* Classy Menu */}
          <nav className="classy-navbar justify-content-between" id="dreamNav">
            {/* Logo */}
            <Link className="nav-brand" to="" style={headerStyles.navBrand}>
              <img src="/img/core-img/logo.png" alt="logo" style={headerStyles.navBrandImg} /> Zynith
            </Link>

            {/* Navbar Toggler - Hidden on protected routes */}
            {!shouldHideNavMenu && (
              <div className="classy-navbar-toggler" onClick={toggleMobileMenu} style={headerStyles.navbarToggler}>
                <span className="navbarToggler">
                  <span style={headerStyles.togglerSpan}></span>
                  <span style={headerStyles.togglerSpan}></span>
                  <span style={headerStyles.togglerSpan}></span>
                </span>
              </div>
            )}

            {/* Menu */}
            <div className={`classy-menu ${isMobileMenuOpen ? 'menu-on' : ''}`}>
              {/* Close Button - Only visible on mobile */}
              <div className="classycloseIcon mobile-only" onClick={toggleMobileMenu}>
                <div className="cross-wrap">
                  <span className="top" style={{backgroundColor: 'white'}}></span>
                  <span className="bottom" style={{backgroundColor: 'white'}}></span>
                </div>
              </div>

              {/* Nav */}
              <div className="classynav">
                {!shouldHideNavMenu && (
                  <ul id="nav">
                    <li><NavLink to="/" style={headerStyles.navLink}>Home</NavLink></li>
                    <li><NavLink to="/investments" style={headerStyles.navLink}>Investments</NavLink>
                      <ul className="dropdown" style={{backgroundColor: '#192a56'}}>
                        <li><NavLink to="/investments" style={headerStyles.navLink}>All Investments</NavLink></li>
                        <li><NavLink to="/crypto-investments" style={headerStyles.navLink}>Cryptocurrency</NavLink></li>
                        <li><NavLink to="/market-overview" style={headerStyles.navLink}>Market Overview</NavLink></li>
                      </ul>
                    </li>
                    {/* Show these links only when logged in */}
                    {isLoggedIn && (
                      <>
                        <li><NavLink to="/dashboard" style={headerStyles.navLink}>Dashboard</NavLink></li>
                        <li><NavLink to="/portfolio" style={headerStyles.navLink}>Portfolio</NavLink></li>
                      </>
                    )}
                    <li><NavLink to="/about" style={headerStyles.navLink}>About</NavLink></li>
                    <li><NavLink to="/contact" style={headerStyles.navLink}>Contact</NavLink></li>
                  </ul>
                )}

                {/* Authentication Buttons */}
                {!isLoggedIn ? (
                  <>
                    <Link to="/login" className="btn login-btn mr-im" style={headerStyles.loginBtn}>Log in</Link>
                    <Link to="/register" className="btn login-btn" style={headerStyles.loginBtn}>Signup</Link>
                  </>
                ) : (
                  <>
                    <span className="user-greeting" style={{color: 'white', marginRight: '15px'}}>
                      Welcome, {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <button onClick={handleLogout} className="btn login-btn" style={headerStyles.loginBtn}>Logout</button>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
    {/* ##### Header Area End ##### */}
    </>
  );
};

export default Header;
