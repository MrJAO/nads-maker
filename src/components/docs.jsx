import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/docs.css';
import { guidelinesData } from '../ts/guidelines';
import { onemonData } from '../ts/1mon';
import { treasureHuntData } from '../ts/treasureHunt';
import { nftDrawData } from '../ts/nftDraw';
import { smartContractData } from '../ts/smartContract';

function Docs() {
  const [activeTab, setActiveTab] = useState('guidelines');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  // Renderer function to convert data objects to JSX
  const renderSection = (section, index) => {
    switch (section.type) {
      case 'heading':
        const HeadingTag = `h${section.level}`;
        return <HeadingTag key={index}>{section.content}</HeadingTag>;
      
      case 'paragraph':
        return <p key={index}>{section.content}</p>;
      
      case 'notice':
        return (
          <div key={index} className="docs-notice">
            <p><strong>{section.content}</strong></p>
          </div>
        );
      
      case 'list':
        return (
          <ul key={index}>
            {section.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      
      case 'table':
        return (
          <table key={index} className="docs-table">
            <thead>
              <tr>
                {section.headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'code':
        return <p key={index}><code>{section.content}</code></p>;
      
      default:
        return null;
    }
  };

  return (
    <div className="docs-container">
      {/* Mobile Hamburger Button */}
      <button 
        className="docs-hamburger-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menu"
      >
        <span className="hamburger-icon">☰</span>
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="docs-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`docs-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="docs-title" onClick={() => navigate('/1mon')}>Documentation</div>
        <nav className="docs-nav">
          <button 
            className={`docs-nav-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
            onClick={() => handleTabChange('guidelines')}
          >
            Guidelines
          </button>
          <button 
            className={`docs-nav-btn ${activeTab === '1mon' ? 'active' : ''}`}
            onClick={() => handleTabChange('1mon')}
          >
            1 MON and A Dream
          </button>
          <button 
            className={`docs-nav-btn ${activeTab === 'treasureHunt' ? 'active' : ''}`}
            onClick={() => handleTabChange('treasureHunt')}
          >
            Treasure Hunt
          </button>
          <button 
            className={`docs-nav-btn ${activeTab === 'nftDraw' ? 'active' : ''}`}
            onClick={() => handleTabChange('nftDraw')}
          >
            NFT Draw
          </button>
          <button 
            className={`docs-nav-btn ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => handleTabChange('contracts')}
          >
            Smart Contract
          </button>
        </nav>

        {/* Sidebar Links */}
        <div className="docs-sidebar-links">
          <a href="https://github.com/MrJAO/nads-maker" target="_blank" rel="noopener noreferrer" className="sidebar-link">
            <span className="sidebar-link-icon">📦</span>
            <span>GitHub</span>
          </a>
          <a href="https://x.com/CryptoModJAO" target="_blank" rel="noopener noreferrer" className="sidebar-link">
            <span className="sidebar-link-icon">𝕏</span>
            <span>Twitter</span>
          </a>
          <div className="sidebar-support">
            <span className="sidebar-link-icon">💬</span>
            <span>If you have any questions or experienced a problem, message me on X/Twitter</span>
          </div>
        </div>
      </aside>

      <main className="docs-content">
        {activeTab === 'guidelines' && (
          <div className="docs-section">
            <h1>{guidelinesData.title}</h1>
            {guidelinesData.sections.map((section, index) => renderSection(section, index))}
          </div>
        )}

        {activeTab === '1mon' && (
          <div className="docs-section">
            <h1>{onemonData.title}</h1>
            {onemonData.sections.map((section, index) => renderSection(section, index))}
          </div>
        )}

        {activeTab === 'treasureHunt' && (
          <div className="docs-section">
            <h1>{treasureHuntData.title}</h1>
            {treasureHuntData.sections.map((section, index) => renderSection(section, index))}
          </div>
        )}

        {activeTab === 'nftDraw' && (
          <div className="docs-section">
            <h1>{nftDrawData.title}</h1>
            {nftDrawData.sections.map((section, index) => renderSection(section, index))}
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="docs-section">
            <h1>{smartContractData.title}</h1>
            {smartContractData.sections.map((section, index) => renderSection(section, index))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Docs;