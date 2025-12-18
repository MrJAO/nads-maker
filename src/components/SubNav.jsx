import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/subnav.css';

function SubNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

const navItems = [
     { label: 'Live', path: '/1mon' },
     { label: 'Treasure Hunt', path: '/treasure-hunt' },
     { label: 'NFT Draw', path: '/nft-draw' },
     { label: 'Previous Raffles', path: '/prev-raffle' },
     { label: 'Analytics', path: '/1mon-analytics' }
   ];

  const currentItem = navItems.find(item => item.path === location.pathname) || navItems[0];

  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <div className="sub-nav-container">
      {/* Desktop Horizontal Tabs */}
      <nav className="sub-nav-tabs">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`sub-nav-tab ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile Dropdown */}
      <button 
        className="sub-nav-dropdown-btn"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="current-label">{currentItem.label}</span>
        <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
      </button>

      {dropdownOpen && (
        <>
          <div className="sub-nav-overlay" onClick={() => setDropdownOpen(false)}></div>
          <div className="sub-nav-dropdown">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`sub-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SubNav;