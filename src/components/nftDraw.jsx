import { useState } from 'react';
import Header from './Header';
import '../css/nftDraw.css';
import skrumpey from '../assets/skrumpey_1153_pfp.png';

const cardColors = [
  { border: '#ff0000', glow: 'rgba(255, 0, 0, 0.6)', text: '#ff4444', bg: '#1a0000' },
  { border: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)', text: '#c084fc', bg: '#1a0a1a' },
  { border: '#3b82f6', glow: 'rgba(59, 130, 246, 0.6)', text: '#60a5fa', bg: '#0a0a1a' },
  { border: '#22c55e', glow: 'rgba(34, 197, 94, 0.6)', text: '#4ade80', bg: '#0a1a0a' },
  { border: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)', text: '#fbbf24', bg: '#1a150a' },
];

const cardImages = [skrumpey, null, null, null, null];

function NFTDraw() {
  const [revealedCards, setRevealedCards] = useState([false, false, false, false, false]);

  const handleCardClick = (index) => {
    if (cardImages[index]) {
      setRevealedCards(prev => {
        const newState = [...prev];
        newState[index] = !newState[index];
        return newState;
      });
    }
  };

  return (
    <div className="nads-container">
      <Header />
      
      <main className="nads-main">
        <div className="nft-draw-wrapper">
          <div className="nft-cards-container">
            {cardColors.map((color, i) => (
              <div 
                className={`nft-card ${revealedCards[i] ? 'revealed' : ''}`}
                key={i} 
                onClick={() => handleCardClick(i)}
                style={{ 
                  animationDelay: `${i * 0.2}s, ${1 + i * 0.2}s`,
                  '--card-border': color.border,
                  '--card-glow': color.glow,
                  '--card-text': color.text,
                  '--card-bg': color.bg,
                }}
              >
                <div className="nft-card-inner">
                  <div className="nft-card-front">
                    <div className="nft-card-shine"></div>
                    <div className="nft-card-content">?</div>
                  </div>
                  <div className="nft-card-back">
                    {cardImages[i] && (
                      <img src={cardImages[i]} alt="NFT" className="nft-card-image" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="nft-coming-soon">Coming Soon</p>
        </div>
      </main>
    </div>
  );
}

export default NFTDraw;
