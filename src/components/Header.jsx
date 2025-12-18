import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ADMIN_ADDRESS } from '../walletIntegration/config';
import '../css/header.css';

function Header() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = isConnected && address?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  const handleWalletClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: connectors[0] });
    }
    setMenuOpen(false);
  };

  const shortenAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="nads-header">
      <div className="nads-logo" onClick={() => handleNavigation('/1mon')}>
        NadsMaker
      </div>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <button className="nav-btn" onClick={() => handleNavigation('/1mon')}>
          1 MON
        </button>
        <button className="nav-btn" onClick={() => handleNavigation('/profile')}>
          Profile
        </button>
        <button className="nav-btn" onClick={() => handleNavigation('/docs')}>
          Documentation
        </button>
        {isAdmin && (
          <button className="nav-btn admin-btn" onClick={() => handleNavigation('/admin')}>
            Admin
          </button>
        )}
      </nav>

      {/* Desktop Wallet Button */}
      <button className="desktop-wallet-btn" onClick={handleWalletClick}>
        {isConnected ? shortenAddress(address) : 'Connect Wallet'}
      </button>

      {/* Mobile Hamburger Button */}
      <button 
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span className="hamburger-icon">☰</span>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
          <nav className="dropdown-menu">
            <button className="menu-item" onClick={() => handleNavigation('/1mon')}>
              1 MON
            </button>
            <button className="menu-item" onClick={() => handleNavigation('/profile')}>
              Profile
            </button>
            <button className="menu-item" onClick={() => handleNavigation('/docs')}>
              Documentation
            </button>
            {isAdmin && (
              <button className="menu-item admin-item" onClick={() => handleNavigation('/admin')}>
                Admin
              </button>
            )}
            <button className="menu-item wallet-item" onClick={handleWalletClick}>
              {isConnected ? shortenAddress(address) : 'Connect Wallet'}
            </button>
          </nav>
        </>
      )}
    </header>
  );
}

export default Header;